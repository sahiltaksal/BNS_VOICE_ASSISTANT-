// lib/parseAIResponse.js
// Purpose: Safely parse the JSON response from Gemini, with fallback on failure

const FALLBACK = {
  intent: "unknown_query",
  reply: "Sorry, I could not understand that clearly. Could you please repeat?",
  collectedData: {},
  isLeadReady: false,
  handoffRequired: false,
  summary: null,
};

/**
 * Parse the raw text returned by Gemini into a structured object.
 * Strips markdown code fences if Gemini accidentally includes them.
 *
 * @param {string} rawText - Raw string from Gemini
 * @returns {Object} Parsed response object
 */
export function parseAIResponse(rawText) {
  if (!rawText || typeof rawText !== "string") {
    console.warn("[parseAIResponse] Empty or non-string input.");
    return { ...FALLBACK };
  }

  try {
    // Strip markdown code fences: ```json ... ``` or ``` ... ```
    let cleaned = rawText.trim();
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    cleaned = cleaned.trim();

    const parsed = JSON.parse(cleaned);

    // Ensure all required keys are present
    return {
      intent: parsed.intent || FALLBACK.intent,
      reply: parsed.reply || FALLBACK.reply,
      collectedData: parsed.collectedData || {},
      isLeadReady: parsed.isLeadReady === true,
      handoffRequired: parsed.handoffRequired === true,
      summary: parsed.summary || null,
    };
  } catch (err) {
    console.error("[parseAIResponse] JSON parse failed:", err.message);
    console.error("[parseAIResponse] Raw text was:", rawText);
    return { ...FALLBACK };
  }
}
