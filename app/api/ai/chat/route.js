
import { askGemini } from "@/lib/gemini";
import { buildSystemPrompt } from "@/lib/prompt";
import { parseAIResponse } from "@/lib/parseAIResponse";
import { validateLead, normalisePhone } from "@/lib/validateLead";
import { appendLead, phoneExists } from "@/lib/firestore";
import packages from "@/data/packages.json";


const requestCounts = {};
const RATE_LIMIT = 50;
const RATE_WINDOW_MS = 60 * 1000;

function isRateLimited(ip) {
  const now = Date.now();
  if (!requestCounts[ip]) {
    requestCounts[ip] = { count: 1, windowStart: now };
    return false;
  }
  const entry = requestCounts[ip];
  if (now - entry.windowStart > RATE_WINDOW_MS) {
    // Reset window
    requestCounts[ip] = { count: 1, windowStart: now };
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}


function mergeCollectedData(existing, incoming) {
  const merged = { ...existing };
  if (incoming && typeof incoming === "object") {
    Object.keys(incoming).forEach((key) => {
      const val = incoming[key];
      if (val !== null && val !== undefined && val !== "") {
        merged[key] = val;
      }
    });
  }
  return merged;
}


export async function POST(request) {
  // Rate limit check
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return Response.json({
      success: false,
      reply:
        "I'm receiving too many requests right now. Please wait a moment and try again.",
      collectedData: {},
      isLeadReady: false,
      handoffRequired: false,
      leadSaved: false,
      summary: null,
    });
  }

  try {
    const body = await request.json();
    const { message, conversationHistory = [], collectedData = {} } = body;

    // Validate message
    if (!message || String(message).trim() === "") {
      return Response.json(
        {
          success: false,
          reply: "I did not receive a message. Could you please try again?",
          collectedData: {},
          isLeadReady: false,
          handoffRequired: false,
          leadSaved: false,
          summary: null,
        },
        { status: 400 }
      );
    }

    // 1. Build system prompt with current package data and already-collected data
    const systemPrompt = buildSystemPrompt(packages, collectedData);

    // 2. Call Gemini
    const rawResponse = await askGemini(
      systemPrompt,
      conversationHistory,
      message.trim()
    );

    const parsed = parseAIResponse(rawResponse);

    const updatedCollectedData = mergeCollectedData(
      collectedData,
      parsed.collectedData
    );

    // 5. Normalise phone if collected
    if (updatedCollectedData.phone) {
      updatedCollectedData.phone = normalisePhone(updatedCollectedData.phone);
    }

    // 6. Check if lead is ready and auto-save
    let leadSaved = false;

    if (parsed.isLeadReady) {
      const { isValid } = validateLead(updatedCollectedData);

      if (isValid) {
        // Duplicate check
        const isDuplicate = await phoneExists(updatedCollectedData.phone);

        if (!isDuplicate) {
          try {
            await appendLead({
              ...updatedCollectedData,
              summary: parsed.summary,
            });
            leadSaved = true;
            console.log(
              `[/api/ai/chat] Lead saved for phone: ${updatedCollectedData.phone}`
            );
          } catch (saveErr) {
            console.error(
              "[/api/ai/chat] Lead save failed:",
              saveErr.message
            );
            // Do not fail the whole request — just note it
          }
        } else {
          console.log(
            `[/api/ai/chat] Duplicate phone skipped: ${updatedCollectedData.phone}`
          );
          // Return early with duplicate lead message
          return Response.json({
            success: true,
            intent: parsed.intent,
            reply:
              "I already have your enquiry. Our travel expert will contact you soon.",
            collectedData: updatedCollectedData,
            isLeadReady: true,
            handoffRequired: parsed.handoffRequired,
            leadSaved: false,
            duplicateLead: true,
            summary: parsed.summary,
          });
        }
      }
    }

    // 7. Return response to frontend
    return Response.json({
      success: true,
      intent: parsed.intent,
      reply: parsed.reply,
      collectedData: updatedCollectedData,
      isLeadReady: parsed.isLeadReady,
      handoffRequired: parsed.handoffRequired,
      leadSaved,
      summary: parsed.summary,
    });
  } catch (err) {
    console.error("[POST /api/ai/chat] Error:", err.message);


    return Response.json(
      {
        success: false,
        reply:
          "I'm having a small issue right now. Could you please try again?",
        collectedData: {},
        isLeadReady: false,
        handoffRequired: false,
        leadSaved: false,
        summary: null,
        error: err.message,
      },
      { status: 200 }
    );
  }
}
