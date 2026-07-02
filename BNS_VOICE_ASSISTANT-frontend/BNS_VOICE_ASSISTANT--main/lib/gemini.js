// lib/gemini.js
// Purpose: Gemini 1.5 Flash API client with timeout and error handling

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Send a message to Gemini and get a response.
 *
 * @param {string} systemPrompt - The system instruction for the AI
 * @param {Array} conversationHistory - Array of { role: "user"|"model", parts: [{ text: string }] }
 * @param {string} userMessage - The latest user message
 * @returns {Promise<string>} Raw text response from Gemini
 */
export async function askGemini(systemPrompt, conversationHistory, userMessage) {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    systemInstruction: systemPrompt,
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  // Build the chat history (all turns except the latest)
  const chat = model.startChat({
    history: conversationHistory || [],
  });

  // Race between the Gemini call and a 15 second timeout
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error("Gemini API timed out after 15 seconds")),
      15000
    )
  );

  const geminiCall = chat.sendMessage(userMessage);

  const result = await Promise.race([geminiCall, timeoutPromise]);
  const response = await result.response;
  return response.text();
}
