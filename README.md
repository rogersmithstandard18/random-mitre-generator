# MITRE ATT&CK Learning Tool

A modern web application to help master cybersecurity techniques through plain-language translation cards.

## Features
- **Plain Language Translations:** Complex MITRE ATT&CK techniques explained for humans.
- **Boardroom Pitches:** Context for why these techniques matter to business leaders.
- **Learning Paths:** Focused tracks for Blue Team, Red Team, Purple Team, and GRC.
- **Progress Tracking:** Favorite techniques and view your learning history.

## Tech Stack
- **Frontend:** React, Vite, TypeScript
- **Styling:** CSS3
- **Icons:** Lucide-React
- **State Management:** Zustand (with Persistence)
- **Routing:** React Router

## Local Development

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

## Deployment on Vercel

Since you've already configured `vercel.json` and `package.json`, setting up on Vercel is straightforward:

1. **Push your code** to a GitHub/GitLab/Bitbucket repository.
2. **Import the project** in the [Vercel Dashboard](https://vercel.com/new).
3. **Framework Preset:** Vercel should automatically detect **Vite**.
4. **Build & Development Settings:**
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. **Deploy:** Click the "Deploy" button.

The included `vercel.json` ensures that client-side routing works correctly by redirecting all non-asset requests to `index.html`.
