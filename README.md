# Sentinel Ops — SOC Case File Workbook

A modern web application designed to train SOC analysts and security professionals through interactive incident response scenarios. Investigate realistic security incidents, check off playbook steps, and practice structured threat triage in a hands-on simulation environment.

## 🚀 Features

### Interactive Case File Scenarios
- **4 Incident Types**: Impossible travel sign-ins, MFA fatigue attacks, suspicious PowerShell execution, and data exposure scenarios
- **Structured Playbook Engine**: 9-step investigation workflows per scenario split into three phases:
  - **Preparation**: Validate prerequisites and gather initial context
  - **Analysis**: Deep-dive technical investigation with evidence review
  - **Containment**: Remediation and incident closure steps
- **Per-Step Findings**: Each completed step logs scenario-specific investigation findings (not generic checkmarks) — e.g., "Kiev IP identified as known Commercial Proxy" vs. just "✓ Verified"

### Evidence-Driven Investigation
- **Logs to Investigate**: Browse relevant log sources (IdP sign-ins, GeoIP data, MFA events, etc.) with simulated evidence content
- **Evidence Review Tracking**: Mark evidence items as reviewed while reading investigation instructions
- **Auto-Logged Findings**: Completed playbook steps automatically populate the investigation report with technical findings

### Ticket Filing & Verdict
- **Final Verdict Options**: TRUE POSITIVE / FALSE POSITIVE for incident classification
- **Severity & Confidence Levels**: Rate incident severity (Low/Medium/High) and confidence (Low/Medium/High)
- **Automated Findings Log**: Bullet-point summary of all investigation steps completed, ready for report submission
- **Verification ID**: Unique identifier for each investigation submission
- **Case Summary**: Write alert summaries and evidence notes during investigation

### Responsive Dashboard
- **Three-Panel Layout**:
  - Left: Incident context, critical alert badge, ticket number, scenario briefing
  - Center: Tabbed incident playbook with step-by-step checkboxes and SME guidance
  - Right: Investigation report with verdict, findings log, and submit button
- **Live Status**: "Triage in Progress" status display with progress tracking

### Learning Support
- **SME Insights**: Scenario-specific guidance at the bottom of the playbook explaining investigation methodology
- **Investigation Ladder**: Educational reference showing beginner → advanced investigation approaches
- **Learning Bridge**: Context and reference materials for deepening threat knowledge

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Custom CSS with Lucide React icons
- **State Management**: React hooks + Zustand
- **Backend**: Vercel Edge Functions (serverless)
- **Database**: Supabase PostgreSQL + JSONB playbook data
- **Authentication**: Supabase Auth (OAuth, JWT)
- **Payments**: Stripe integration for professional/team tiers

## 📦 Project Structure

```
├── api/                          # Vercel serverless functions
│   ├── case-files/
│   │   ├── scenarios.ts         # Fetch active case file scenarios with playbook data
│   │   └── submit.ts            # Submit investigation results
│   └── lib/
│       ├── auth.ts              # JWT verification & tier validation
│       └── supabase.ts          # Database client
├── src/
│   ├── pages/
│   │   ├── CaseFilesPage.tsx    # Main incident investigation UI
│   │   └── LandingPage.tsx
│   ├── types/
│   │   └── CaseFile.ts          # PlaybookStep, Playbook, CaseFileScenario types
│   └── components/
├── supabase/
│   └── migrations/              # Database schema migrations
└── package.json
```

## 🗂️ Database Schema

### case_file_scenarios
Each scenario contains structured playbook data:

```json
{
  "id": "uuid",
  "scenario_number": 1,
  "title": "Impossible Travel Sign-In",
  "scenario_text": "User signed in from Phoenix, AZ and 12 mins later from Kiev, Ukraine.",
  "mission_steps": ["legacy array fallback"],
  "playbook": {
    "stages": ["Preparation", "Analysis", "Containment"],
    "steps": {
      "Preparation": [
        {
          "id": "p1",
          "task": "Identify User Context",
          "detail": "Is this a VIP, admin, or privileged account?",
          "finding": "User is j.doe, Sales Rep (Non-Admin). No elevated privileges."
        }
      ],
      "Analysis": [
        {
          "id": "a1",
          "task": "Geolocation Verification",
          "detail": "Check if either IP belongs to a VPN or proxy.",
          "finding": "Kiev IP (194.x.x.x) identified as a known Commercial Proxy."
        }
      ],
      "Containment": [...]
    }
  },
  "learning_bridge": {
    "investigation_map": [...],
    "beginner_rules": [...]
  },
  "pause_prompt": "Checking off steps in the playbook simulates..."
}
```

## 💻 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase project (or local PostgreSQL)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd random-mitre-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Fill in Supabase keys, Stripe keys, etc.
   ```

4. **Start dev server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## 🎯 Adding New Scenarios

To add a new case file scenario to the database:

1. **Create scenario record** in `case_file_scenarios` table with:
   - `title`, `subtitle`, `scenario_text` (briefing text)
   - `onetsoc_code` (job code for role context)
   - `level` (1-5) and `level_label` (e.g., "Level 2")

2. **Add playbook data** as structured JSONB:
   ```json
   {
     "stages": ["Preparation", "Analysis", "Containment"],
     "steps": {
       "Preparation": [
         {
           "id": "p1",
           "task": "Step title",
           "detail": "What to investigate",
           "finding": "What you discovered"
         }
       ],
       ...
     }
   }
   ```

3. **Add supporting data**:
   - `evidence_locker`: Array of evidence items (IdP logs, firewall data, etc.)
   - `learning_bridge`: Investigation guidance and educational context
   - `pause_prompt`: Custom SME insight message (optional, has default)

## 📊 How Playbooks Work

1. **User loads scenario** → Sees incident briefing, evidence sources, and playbook tabs
2. **User checks steps** → Each check stores the specific `finding` text (not generic "✓")
3. **Findings auto-populate** → Right panel's "Automated Findings Log" shows real investigation results
4. **User submits verdict** → TRUE POSITIVE / FALSE POSITIVE + severity/confidence + notes
5. **Investigation saved** → Backend records all checked steps, findings, and final verdict

## 🔐 Authentication & Tiers

- **Free tier**: Limited access, may have scenario restrictions
- **Professional tier**: Full case file access (4+ scenarios)
- **Team tier**: Team management and audit logging

Auth is enforced at the API level in `/api/case-files/scenarios.ts`.

## 📝 License

Private/Internal use.

---

**For questions or feature requests**, please reach out to the SOC training team.
