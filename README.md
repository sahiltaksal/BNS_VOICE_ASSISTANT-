# Project Plan: Virtual AI Receptionist for Travel Company

## 1. Project Title

**AI-Powered Virtual Receptionist for Travel Company**

## 2. Project Goal

Build a virtual AI receptionist that can talk with customers, answer travel-related queries, collect lead information, and save customer enquiries for the travel company.

For the demo version, the system will work through a website using microphone and speaker. Later, the same system can be connected to a real phone number using services like Twilio, Plivo, Exotel, Vapi, or Retell AI.

---

# 3. Main Use Case

A customer wants to ask about travel packages.

The customer speaks:

> “I want a Goa package for 4 people in December.”

The AI receptionist should reply:

> “Sure. I can help you with that. May I know your name, travel date, number of people, and budget range?”

Then the AI collects:

* Customer name
* Phone number
* Destination
* Travel date
* Number of travelers
* Budget
* Package type
* Special requirements

After that, the system saves the enquiry in the database or Google Sheet.

---

# 4. Demo Version Scope

## Demo should include:

1. Web page with “Talk to AI Receptionist” button
2. User can speak using microphone
3. AI converts speech to text
4. AI replies like a travel receptionist
5. AI asks follow-up questions
6. AI collects lead details
7. AI saves lead in Google Sheet / Firebase
8. AI can answer travel package FAQs
9. AI can show call/chat transcript
10. Admin can view customer enquiries

## Demo does not need:

* Real phone number
* Real payment system
* Real ticket booking
* Advanced CRM
* Full production call center setup

---

# 5. Future Production Scope

After demo, add:

1. Real phone number integration
2. Incoming call handling
3. Human call transfer
4. WhatsApp follow-up
5. CRM integration
6. Call recording
7. Call summary
8. Multi-language support: English, Hindi, Marathi
9. Analytics dashboard
10. Lead status tracking

---

# 6. Recommended Tech Stack

## Frontend

Use:

* Next.js or React
* Tailwind CSS
* Shadcn UI if needed

Frontend pages:

* Home page
* AI receptionist page
* Admin dashboard
* Leads page
* Package management page

## Backend

Use:

* Node.js with Express
  or
* Python FastAPI

Recommended for this project:

**Node.js + Express**

Because it is easy to connect with frontend, AI APIs, Google Sheets, Firebase, and webhooks.

## AI / LLM

Use one of these:

* OpenAI API
* Gemini API

The AI should behave like a polite receptionist, not like a general chatbot.

## Voice Input

For demo:

* Browser Web Speech API

This will convert user voice into text.

## Voice Output

For demo:

* Browser Text-to-Speech API

This will speak the AI response aloud.

For production:

* ElevenLabs
* OpenAI TTS
* Vapi voice
* Retell voice

## Database

For demo:

* Firebase Firestore
  or
* Google Sheets

Recommended:

**Firebase Firestore + optional Google Sheet export**

## Hosting

Frontend:

* Vercel

Backend:

* Render
* Railway
* AWS
* Google Cloud Run

Demo recommendation:

* Vercel for frontend
* Render for backend
* Firebase for database

---

# 7. System Architecture

```text
User / Customer
    ↓
Website Voice Interface
    ↓
Speech-to-Text
    ↓
Backend API
    ↓
AI Receptionist Prompt + Travel Knowledge Base
    ↓
AI Response
    ↓
Text-to-Speech
    ↓
Customer hears response

At the same time:
    ↓
Lead details saved in Firebase / Google Sheet
    ↓
Admin dashboard displays enquiry
```

---

# 8. Main Modules

## Module 1: Customer Voice Interface

The website should have:

* Start talking button
* Stop button
* Display user speech text
* Display AI reply text
* Speak AI reply aloud
* Show conversation history

Example UI:

```text
[Start Call]

Customer: I want a Kashmir package.
AI: Sure, I can help you. How many people are travelling?

Customer: Four people.
AI: Great. What is your expected travel date?
```

---

## Module 2: AI Receptionist

The AI should work like a real receptionist.

AI behavior:

* Greet customer politely
* Ask one question at a time
* Understand travel queries
* Collect missing details
* Avoid long answers
* Give package suggestions
* Save enquiry when enough data is collected
* Escalate to human if required

Tone:

* Professional
* Friendly
* Simple
* Helpful
* Travel-company style

---

## Module 3: Travel Knowledge Base

The system should have basic package data.

Example package data:

```json
[
  {
    "destination": "Goa",
    "duration": "3 Nights / 4 Days",
    "price": "₹8,999 per person",
    "includes": ["Hotel", "Breakfast", "Sightseeing", "Airport Pickup"],
    "bestFor": ["Friends", "Couples", "Family"]
  },
  {
    "destination": "Kashmir",
    "duration": "5 Nights / 6 Days",
    "price": "₹18,999 per person",
    "includes": ["Hotel", "Meals", "Sightseeing", "Houseboat Stay"],
    "bestFor": ["Family", "Honeymoon"]
  }
]
```

AI should answer from this data.

Example:

Customer:

> “Do you have Kashmir package?”

AI:

> “Yes, we have a Kashmir package for 5 nights and 6 days starting from ₹18,999 per person. It includes hotel, meals, sightseeing, and houseboat stay. May I know your travel date?”

---

## Module 4: Lead Collection

The AI should collect these fields:

```text
Customer Name
Phone Number
Email optional
Destination
Travel Date
Number of People
Budget
Package Type
Special Requirement
Preferred Language
Lead Status
Conversation Summary
Created Date
```

Lead status values:

```text
New
Contacted
Interested
Not Interested
Converted
Closed
```

---

## Module 5: Admin Dashboard

Admin should see:

* Total leads
* New leads
* Destination-wise enquiries
* Latest enquiries
* Customer details
* Conversation transcript
* Lead status update option

Admin pages:

```text
/login
/dashboard
/leads
/leads/:id
/packages
/settings
```

For demo, authentication can be simple admin login.

---

# 9. Database Design

## Collection: leads

```json
{
  "id": "auto_id",
  "name": "Rahul Sharma",
  "phone": "9876543210",
  "email": "rahul@example.com",
  "destination": "Goa",
  "travelDate": "2026-12-15",
  "numberOfPeople": 4,
  "budget": "40000",
  "packageType": "Family",
  "specialRequirement": "Hotel near beach",
  "preferredLanguage": "English",
  "status": "New",
  "summary": "Customer wants Goa package for 4 people in December.",
  "transcript": [
    {
      "role": "user",
      "message": "I want Goa package."
    },
    {
      "role": "ai",
      "message": "Sure, how many people are travelling?"
    }
  ],
  "createdAt": "timestamp"
}
```

## Collection: packages

```json
{
  "id": "auto_id",
  "destination": "Goa",
  "title": "Goa Beach Holiday Package",
  "duration": "3 Nights / 4 Days",
  "price": "₹8,999 per person",
  "includes": ["Hotel", "Breakfast", "Sightseeing"],
  "description": "Best package for couples, friends and family.",
  "isActive": true
}
```

## Collection: settings

```json
{
  "companyName": "ABC Travels",
  "supportPhone": "+91XXXXXXXXXX",
  "workingHours": "10 AM to 7 PM",
  "languages": ["English", "Hindi", "Marathi"]
}
```

---

# 10. Required Backend APIs

## AI Chat API

Endpoint:

```text
POST /api/ai/chat
```

Request:

```json
{
  "message": "I want Goa package",
  "conversationId": "abc123"
}
```

Response:

```json
{
  "reply": "Sure, I can help you with Goa package. How many people are travelling?",
  "collectedData": {
    "destination": "Goa"
  },
  "isLeadReady": false
}
```

---

## Save Lead API

Endpoint:

```text
POST /api/leads
```

Request:

```json
{
  "name": "Rahul Sharma",
  "phone": "9876543210",
  "destination": "Goa",
  "travelDate": "2026-12-15",
  "numberOfPeople": 4,
  "budget": "40000",
  "summary": "Customer wants Goa package."
}
```

Response:

```json
{
  "success": true,
  "message": "Lead saved successfully"
}
```

---

## Get Leads API

Endpoint:

```text
GET /api/leads
```

Response:

```json
[
  {
    "id": "lead_1",
    "name": "Rahul Sharma",
    "phone": "9876543210",
    "destination": "Goa",
    "status": "New"
  }
]
```

---

## Update Lead Status API

Endpoint:

```text
PUT /api/leads/:id/status
```

Request:

```json
{
  "status": "Contacted"
}
```

---

## Packages API

```text
GET /api/packages
POST /api/packages
PUT /api/packages/:id
DELETE /api/packages/:id
```

---

# 11. AI System Prompt

Use this prompt for the AI receptionist:

```text
You are a polite and professional AI receptionist for a travel company.

Your job is to help customers with travel package enquiries.

Rules:
1. Greet the customer politely.
2. Ask only one question at a time.
3. Keep replies short and natural.
4. Collect these details:
   - Name
   - Phone number
   - Destination
   - Travel date
   - Number of travelers
   - Budget
   - Package type
   - Special requirements
5. If package information is available, answer from the provided package data.
6. If you do not know an answer, say that a human travel expert will contact the customer.
7. Do not make fake promises.
8. Do not confirm booking or payment.
9. Do not ask for sensitive payment details.
10. After collecting enough details, summarize the enquiry and say that the travel team will contact them soon.

Tone:
Friendly, simple, professional, and helpful.

Example:
Customer: I want a Goa package.
AI: Sure, I can help you with Goa packages. How many people are travelling?
```

---

# 12. Conversation Flow

## Start

AI:

```text
Welcome to ABC Travels. I am your virtual travel assistant. How can I help you today?
```

## Customer asks package

Customer:

```text
I want a Dubai package.
```

AI:

```text
Sure, I can help you with Dubai package details. How many people are travelling?
```

## AI collects details

AI should ask:

```text
What is your travel date?
What is your budget range?
May I know your name?
Can you share your phone number so our travel expert can contact you?
```

## Final response

AI:

```text
Thank you, Rahul. I have noted your Dubai travel enquiry for 4 people in December with a budget of around ₹80,000. Our travel expert will contact you soon with the best package options.
```

## Save lead

After final response, save lead in database.

---

# 13. Frontend Pages

## Page 1: Landing Page

Content:

* Company name
* Short intro
* “Talk to AI Receptionist” button
* Package highlights

## Page 2: AI Receptionist Page

Features:

* Start voice button
* Stop voice button
* Conversation display
* Speaking animation
* Text input fallback
* AI voice response

## Page 3: Admin Login

Simple login:

```text
Email
Password
Login button
```

## Page 4: Dashboard

Show:

```text
Total Leads
Today’s Leads
Most Asked Destination
Latest Enquiries
```

## Page 5: Leads Page

Table:

```text
Name | Phone | Destination | Date | Budget | Status | Action
```

## Page 6: Lead Details Page

Show:

* Customer info
* Full transcript
* AI summary
* Status update button

## Page 7: Package Management

Admin can add/edit packages:

```text
Destination
Title
Duration
Price
Includes
Description
Active/Inactive
```

---

# 14. Development Phases

## Phase 1: Basic UI

Build:

* Landing page
* AI receptionist page
* Admin dashboard layout

Deliverable:

```text
User can open website and see AI receptionist interface.
```

---

## Phase 2: Voice Input and Output

Build:

* Browser speech-to-text
* Text-to-speech response
* Start/stop voice button

Deliverable:

```text
User can speak, and system can display spoken text.
AI response can be spoken aloud.
```

---

## Phase 3: AI Chat Integration

Build:

* Backend AI chat API
* AI receptionist prompt
* Conversation memory

Deliverable:

```text
User can talk with AI about travel packages.
AI asks follow-up questions naturally.
```

---

## Phase 4: Lead Extraction and Saving

Build:

* Extract customer details from conversation
* Save lead to Firebase / Google Sheet
* Store transcript

Deliverable:

```text
After conversation, lead is saved successfully.
```

---

## Phase 5: Admin Dashboard

Build:

* View leads
* View lead details
* Update lead status
* View transcript

Deliverable:

```text
Admin can manage all customer enquiries.
```

---

## Phase 6: Package Knowledge Base

Build:

* Package database
* AI answers using package data
* Admin package management

Deliverable:

```text
AI can answer package-specific questions.
```

---

## Phase 7: Production Add-ons

Add later:

* Real phone number
* WhatsApp integration
* Human call transfer
* Call recording
* Multi-language voice
* CRM integration

---

# 15. Folder Structure

```text
ai-travel-receptionist/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── pages/
│   ├── lib/
│   └── styles/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── prompts/
│   ├── config/
│   └── server.js
│
├── docs/
│   ├── project-plan.md
│   ├── api-docs.md
│   └── demo-script.md
│
└── README.md
```

---

# 16. Environment Variables

```env
OPENAI_API_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
GOOGLE_SHEET_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

---

# 17. Security Requirements

1. Do not expose API keys in frontend.
2. Use backend for AI API calls.
3. Validate all user inputs.
4. Do not collect payment card details.
5. Store only required customer information.
6. Add call recording consent if real call system is used.
7. Add admin authentication.
8. Restrict dashboard access.

---

# 18. Demo Script

Use this during project presentation:

```text
User: Hello.
AI: Welcome to ABC Travels. How can I help you today?

User: I want a Goa package.
AI: Sure, I can help you with Goa packages. How many people are travelling?

User: Four people.
AI: Great. What is your expected travel date?

User: 15 December.
AI: Noted. What is your budget range?

User: Around 40,000.
AI: Thank you. May I know your name?

User: Sahil.
AI: Can you share your phone number so our travel expert can contact you?

User: 9876543210.
AI: Thank you, Sahil. I have noted your Goa enquiry for 4 people on 15 December with a budget of around ₹40,000. Our travel expert will contact you soon.
```

Admin dashboard should then show:

```text
Name: Sahil
Phone: 9876543210
Destination: Goa
People: 4
Date: 15 December
Budget: ₹40,000
Status: New
```

---

# 19. Acceptance Criteria

The project is complete when:

1. User can speak to AI from website.
2. AI can respond with voice.
3. AI can answer basic travel queries.
4. AI can ask follow-up questions.
5. AI can collect customer details.
6. AI can save lead in database.
7. Admin can view leads.
8. Admin can view conversation transcript.
9. Admin can update lead status.
10. Project can be demonstrated without real phone number.

---

# 20. Future Phone Call Integration

For production, connect the AI to a real phone number.

Possible tools:

* Vapi
* Retell AI
* Twilio
* Plivo
* Exotel
* Knowlarity

Production flow:

```text
Customer calls company number
    ↓
Telephony provider receives call
    ↓
Voice AI agent answers
    ↓
AI collects enquiry
    ↓
Lead saved in CRM
    ↓
Staff gets notification
```

---

# 21. Final Recommended MVP

Build this first:

```text
Web-based AI Travel Receptionist
+ Voice input
+ Voice output
+ AI chat
+ Lead saving
+ Admin dashboard
+ Package knowledge base
```

After demo success, upgrade to:

```text
Real phone-call AI receptionist
+ WhatsApp follow-up
+ Human call transfer
+ CRM integration
```

---

# 22. Important Instruction for Developer

Do not build it like a normal chatbot.

Build it like a receptionist system.

The AI should not only answer questions. It must also collect enquiry details, save leads, and help the travel company follow up with customers.

Main goal:

```text
Convert customer calls or conversations into travel leads.
```
