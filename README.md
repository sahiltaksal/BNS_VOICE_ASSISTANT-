# AI Travel Receptionist — Backend (Demo)

Backend-only Next.js API routes powering an AI travel receptionist demo.
No Express. No JWT. No Firebase. No LangChain. No real phone calling.

Stack: **Next.js API Routes + Gemini API + Google Sheets API + hardcoded packages.json**

---

## 1. Install

```bash
npm install
```

This installs `@google/generative-ai`, `googleapis`, `next`, `react`, `react-dom`, and `dotenv`.

---

## 2. Configure environment variables

```bash
cp .env.example .env.local
```

Then fill in `.env.local`:

| Variable | Where to get it |
|---|---|
| `GEMINI_API_KEY` | https://aistudio.google.com/app/apikey — free tier, 1,500 requests/day |
| `GEMINI_MODEL` | Leave as `gemini-1.5-flash` |
| `GOOGLE_SHEET_ID` | The long ID in your sheet URL: `.../d/SHEET_ID_HERE/edit` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | From the service account JSON key file |
| `GOOGLE_PRIVATE_KEY` | From the same JSON key file — keep the quotes and `\n` characters exactly as downloaded |
| `LEADS_ACCESS_KEY` | Any secret string you choose — protects `/api/leads/list` |

**Never commit `.env.local` to GitHub.** It is already in `.gitignore`.

---

## 3. One-time Google Sheets setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → create a new project.
2. Enable the **Google Sheets API** for that project.
3. Create a **Service Account** (role: Editor) and download its JSON key.
4. Copy `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and `private_key` → `GOOGLE_PRIVATE_KEY`.
5. Create a new Google Sheet.
6. Share the sheet with the service account email (Editor access).
7. In Row 1, add these exact headers, in this exact order:

   ```
   Timestamp | Name | Phone | Email | Destination | Travel Date | Number of People | Budget | Package Type | Special Requirements | Status | Summary
   ```

8. Copy the Sheet ID from the URL into `GOOGLE_SHEET_ID`.

Verify the connection works:

```bash
npm run test:sheets
```

This appends one test row, reads it back, and checks duplicate detection. All three steps must pass before moving on.

---

## 4. Run locally

```bash
npm run dev
```

Server runs at `http://localhost:3000`.

---

## 5. Project structure

```
app/
├── layout.js                  ← minimal root layout (frontend dev replaces this)
├── page.js                    ← placeholder home page (frontend dev replaces this)
└── api/
    ├── health/route.js        ← GET  /api/health
    ├── ai/chat/route.js       ← POST /api/ai/chat
    └── leads/
        ├── route.js           ← POST /api/leads
        └── list/route.js      ← GET  /api/leads/list?key=...

lib/
├── gemini.js                  ← Gemini API client (15s timeout)
├── prompt.js                  ← System prompt builder + intent detection
├── parseAIResponse.js         ← Safe JSON parsing with fallback
├── validateLead.js            ← Required-field validation + phone normalisation
└── sheets.js                  ← Google Sheets read/write/duplicate-check

data/
└── packages.json              ← 5 hardcoded travel packages

scripts/
└── test-sheets.js             ← Manual Google Sheets connection test
```

---

## 6. API Reference

### `GET /api/health`
No auth. Returns service status.

```json
{ "success": true, "message": "AI Travel Receptionist API is running", "timestamp": "..." }
```

### `POST /api/ai/chat`
Main AI receptionist endpoint. Rate limited to 50 requests/minute per IP (demo-level only).

**Request**
```json
{
  "message": "I want Goa package",
  "conversationHistory": [],
  "collectedData": {}
}
```

**Response**
```json
{
  "success": true,
  "intent": "package_enquiry",
  "reply": "Sure, I can help you with Goa package. How many people are travelling?",
  "collectedData": { "destination": "Goa" },
  "isLeadReady": false,
  "handoffRequired": false,
  "leadSaved": false,
  "summary": null
}
```

When `name`, `phone`, `destination`, `numberOfPeople`, and `travelDate` are all collected, `isLeadReady` becomes `true` and the lead is **automatically validated, duplicate-checked, and saved** to the Google Sheet — `leadSaved` will be `true` in the response.

### `POST /api/leads`
Manually save a lead (also used internally by `/api/ai/chat`).

**Success (201)**
```json
{ "success": true, "message": "Lead saved successfully" }
```

**Validation error (400)**
```json
{ "success": false, "error": "Missing required fields: phone, travelDate" }
```

**Duplicate (409)**
```json
{ "success": false, "error": "Lead already exists for this phone number" }
```

### `GET /api/leads/list?key=YOUR_KEY`
Returns all leads, newest first. Requires the correct `LEADS_ACCESS_KEY`.

**Wrong/missing key (401)**
```json
{ "success": false, "error": "Access denied" }
```

**Success**
```json
{ "success": true, "count": 3, "leads": [ { "timestamp": "...", "name": "...", ... } ] }
```

---

## 7. Build order (recommended)

```
1.  GET /api/health
2.  data/packages.json
3.  lib/gemini.js
4.  lib/prompt.js (with intent detection)
5.  app/api/ai/chat/route.js
6.  Test AI reply manually
7.  lib/sheets.js
8.  app/api/leads/route.js
9.  app/api/leads/list/route.js
10. lib/validateLead.js
11. Duplicate phone check (phoneExists)
12. Auto-save lead from /api/ai/chat
13. Rate limiting (already included)
14. Final curl/Postman testing
```

---

## 8. Testing commands

### Health
```bash
curl http://localhost:3000/api/health
```

### AI Chat
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I want Goa package",
    "conversationHistory": [],
    "collectedData": {}
  }'
```

### Save Lead
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sahil",
    "phone": "9876543210",
    "destination": "Goa",
    "travelDate": "December",
    "numberOfPeople": 4,
    "budget": "40000",
    "summary": "Customer wants Goa package for 4 people in December."
  }'
```

### Get Leads
```bash
curl "http://localhost:3000/api/leads/list?key=demo2024"
```

### Wrong Key
```bash
curl "http://localhost:3000/api/leads/list"
```

---

## 9. Full conversation test (via /api/ai/chat)

Send these messages in sequence, reusing the returned `collectedData` and appending each turn to `conversationHistory`:

```
"Hello"                          → intent: greeting
"I want to go to Goa"            → intent: package_enquiry, collectedData.destination: "Goa"
"4 people"                       → collectedData.numberOfPeople: 4
"In December"                    → collectedData.travelDate: "December"
"My name is Sahil"               → collectedData.name: "Sahil"
"My phone number is 9876543210"  → isLeadReady: true, leadSaved: true
```

After the last message, check the Google Sheet — a new row should appear.

---

## 10. Completion checklist

- [ ] `/api/health` works
- [ ] Gemini API responds with valid JSON
- [ ] AI detects intent correctly
- [ ] AI extracts destination, people, date, name, phone
- [ ] AI asks only one question at a time
- [ ] Lead saves only when all required fields are present
- [ ] Duplicate phone does not create a duplicate row
- [ ] Google Sheet stores leads with correct columns
- [ ] `/api/leads/list` works with the correct key and rejects wrong/missing keys
- [ ] All APIs return clean JSON (no raw stack traces)

---

## 11. Explicitly out of scope

This package intentionally does **not** include: an Express server, JWT auth, Firebase, MongoDB, LangChain, or real phone/telephony integration. See the project plan for the frontend pieces and future production roadmap.
