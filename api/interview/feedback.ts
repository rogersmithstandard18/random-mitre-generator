import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from '../lib/auth.js';
import { supabaseAdmin } from '../lib/supabase.js';

export interface DrillFeedback {
  score: number;
  verdict: 'Strong' | 'Good' | 'Needs Work' | 'Too Vague';
  whatWorked: string;
  gap: string;
  modelAnswer: string;
  keywordHits: string[];
  keywordMisses: string[];
  newTerms: string[];
}

interface FeedbackBody {
  areaId: string;
  areaLabel: string;
  question: string;
  idealKeywords: string[];
  idealStructure: string;
  commonMistake: string;
  answer: {
    situation: string;
    action: string;
    tool: string;
    outcome: string;
  };
  elapsedSeconds: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'AI not configured' });

  const decoded = verifyAuth(req, res);
  if (!decoded) return;

  const { areaId, areaLabel, question, idealKeywords, idealStructure, commonMistake, answer, elapsedSeconds } =
    req.body as FeedbackBody;

  if (!question || !answer?.situation) {
    return res.status(400).json({ error: 'question and answer are required' });
  }

  const full = `Situation: ${answer.situation}\nAction: ${answer.action}\nTool/Log: ${answer.tool}\nOutcome: ${answer.outcome}`;

  const prompt = `You are a Senior SOC hiring manager evaluating a panel interview answer.

Question: "${question}"
Area: ${areaLabel}
Ideal answer should include: ${idealStructure}
Key keywords expected: ${idealKeywords.join(', ')}
Common weak answer pattern: ${commonMistake}

Candidate's answer (Situation → Action → Tool → Outcome):
${full}

Evaluate strictly but fairly. Respond with ONLY a valid JSON object — no markdown, no code fences:
{
  "score": number from 1-10,
  "verdict": "Strong" | "Good" | "Needs Work" | "Too Vague",
  "whatWorked": "1-2 sentences on what was specific and strong",
  "gap": "1-2 sentences on what was missing or too vague",
  "modelAnswer": "3-4 sentence model answer using Situation→Action→Tool→Outcome that would score 9-10",
  "keywordHits": ["keywords from idealKeywords the candidate demonstrated"],
  "keywordMisses": ["keywords from idealKeywords the candidate missed"]
}`;

  try {
    const geminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 700,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      console.error('Gemini error:', geminiRes.status, await geminiRes.text());
      return res.status(502).json({ error: 'AI service unavailable' });
    }

    const geminiData = await geminiRes.json();
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return res.status(502).json({ error: 'No response from AI' });

    const fb = JSON.parse(text) as Omit<DrillFeedback, 'newTerms'>;

    // Persist session and update vocabulary in Supabase
    let newTerms: string[] = [];

    if (supabaseAdmin) {
      // Save session
      await supabaseAdmin.from('interview_drill_sessions').insert({
        user_id: decoded.id,
        area_id: areaId,
        area_label: areaLabel,
        question,
        ideal_keywords: idealKeywords,
        answer_situation: answer.situation,
        answer_action: answer.action,
        answer_tool: answer.tool,
        answer_outcome: answer.outcome,
        score: fb.score,
        verdict: fb.verdict,
        keyword_hits: fb.keywordHits ?? [],
        keyword_misses: fb.keywordMisses ?? [],
        response_time_seconds: elapsedSeconds,
      });

      // Upsert vocab — track which terms are genuinely new for this user
      for (const kw of fb.keywordHits ?? []) {
        const key = kw.toLowerCase();

        const { data: existing } = await supabaseAdmin
          .from('interview_vocab')
          .select('hit_count, areas')
          .eq('user_id', decoded.id)
          .eq('keyword', key)
          .maybeSingle();

        if (!existing) {
          newTerms.push(kw);
          await supabaseAdmin.from('interview_vocab').insert({
            user_id: decoded.id,
            keyword: key,
            hit_count: 1,
            areas: [areaLabel],
            last_seen_at: new Date().toISOString(),
          });
        } else {
          const updatedAreas = existing.areas.includes(areaLabel)
            ? existing.areas
            : [...existing.areas, areaLabel];
          await supabaseAdmin
            .from('interview_vocab')
            .update({
              hit_count: existing.hit_count + 1,
              areas: updatedAreas,
              last_seen_at: new Date().toISOString(),
            })
            .eq('user_id', decoded.id)
            .eq('keyword', key);
        }
      }
    }

    return res.status(200).json({ ...fb, newTerms });
  } catch (err: any) {
    console.error('Interview feedback error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
