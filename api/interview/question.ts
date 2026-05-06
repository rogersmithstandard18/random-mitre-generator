import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from '../lib/auth.js';

export interface DrillQuestion {
  question: string;
  idealKeywords: string[];
  idealStructure: string;
  commonMistake: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'AI not configured' });

  const decoded = verifyAuth(req, res);
  if (!decoded) return;

  const { areaLabel, usedQuestions = [] } = req.body as {
    areaLabel: string;
    usedQuestions: string[];
  };

  if (!areaLabel) return res.status(400).json({ error: 'areaLabel is required' });

  const avoidStr = usedQuestions.length
    ? `Do NOT repeat these questions: ${usedQuestions.join(' | ')}`
    : '';

  const prompt = `You are a Senior SOC hiring manager conducting a technical panel interview.

Generate one realistic, specific interview question for the area: "${areaLabel}".
The question must be scenario-based and require a specific technical answer — not a conceptual overview.
Make it feel like a real panel pushback or follow-up, not a textbook question.
${avoidStr}

Respond with ONLY a valid JSON object — no markdown, no code fences:
{
  "question": "the interview question",
  "idealKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "idealStructure": "2-3 sentences describing what a strong answer looks like — specific tools, Event IDs, techniques, or decisions expected",
  "commonMistake": "one sentence describing the most common weak answer pattern for this question"
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
            temperature: 0.7,
            maxOutputTokens: 600,
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

    const question: DrillQuestion = JSON.parse(text);
    return res.status(200).json(question);
  } catch (err: any) {
    console.error('Interview question error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
