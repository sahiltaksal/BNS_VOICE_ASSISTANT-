// app/api/leads/route.js
// POST /api/leads — Validate and save a lead to Firestore

import { appendLead, phoneExists } from "@/lib/firestore";
import { validateLead, normalisePhone } from "@/lib/validateLead";

export async function POST(request) {
  try {
    const body = await request.json();

    // Normalise phone before processing
    if (body.phone) {
      body.phone = normalisePhone(body.phone);
    }

    // 1. Validate required fields
    const { isValid, errors } = validateLead(body);
    if (!isValid) {
      return Response.json(
        {
          success: false,
          error: `Missing required fields: ${errors.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // 2. Duplicate phone check
    const duplicate = await phoneExists(body.phone);
    if (duplicate) {
      return Response.json(
        {
          success: false,
          error: "Lead already exists for this phone number",
        },
        { status: 409 }
      );
    }

    // 3. Append to Firestore
    await appendLead(body);

    return Response.json(
      {
        success: true,
        message: "Lead saved successfully",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/leads] Error:", err.message);
    return Response.json(
      {
        success: false,
        error: "Failed to save lead. Please try again.",
      },
      { status: 500 }
    );
  }
}
