# BNS Voice Assistant — AI Travel Receptionist

Full-stack demo: existing Next.js API backend (Gemini + Firestore) plus a new
frontend (landing page, AI receptionist chat/voice UI, and admin leads
dashboard) built with Next.js App Router, React, and Tailwind CSS.

## Stack

- Next.js (App Router) + React
- Tailwind CSS
- Web Speech API (voice input) + SpeechSynthesis API (voice output)
- lucide-react icons
- Existing backend: Next.js API routes, Gemini API, Firebase Firestore

## Getting started

```bash
npm install
npm run dev
```

Requires the same `.env.local` values the backend already expects
(`GEMINI_API_KEY`, Firebase Admin credentials, `LEADS_ACCESS_KEY`, etc).
The leads dashboard calls `GET /api/leads/list?key=demo2024` — make sure
`LEADS_ACCESS_KEY=demo2024` in `.env.local`, or update the `ACCESS_KEY`
constant in `app/leads/page.js` to match your key.

## Pages

- `/` — Landing page (hero, popular packages, features, how it works)
- `/receptionist` — AI Travel Receptionist (text + voice chat with Aria)
- `/leads` — Admin Leads Dashboard (summary cards, table, search, CSV export)

## Structure

```
app/
  layout.js, page.js, globals.css
  receptionist/page.js
  leads/page.js
  api/...            (existing backend — untouched)
components/
  Navbar, Footer, ChatWindow, MessageBubble, VoiceButton,
  SpeakingAnimation, CollectedInfoCard, LeadsTable, LoadingDots
utils/
  textToSpeech.js, mergeCollectedData.js, exportCSV.js, formatDate.js
```

## Notes

- Voice input uses the browser's `SpeechRecognition` API (Chrome/Edge). It
  degrades gracefully (mic button disables itself) in unsupported browsers.
- Voice output uses `speechSynthesis` and can be muted from the chat header.
- The frontend only calls the existing backend routes
  (`/api/health`, `/api/ai/chat`, `/api/leads/list`) — no Firebase or Gemini
  code runs in the browser.
