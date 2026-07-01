// app/api/leads/list/route.js
// GET /api/leads/list?key=demo2024 — Return all leads (protected by access key)

import { getLeads } from "@/lib/firestore";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    // Access key check
    if (!key || key !== process.env.LEADS_ACCESS_KEY) {
      return Response.json(
        {
          success: false,
          error: "Access denied",
        },
        { status: 401 }
      );
    }

    const leads = await getLeads();

    return Response.json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (err) {
    console.error("[GET /api/leads/list] Error:", err.message);
    return Response.json(
      {
        success: false,
        error: "Failed to fetch leads. Check your Firestore connection.",
      },
      { status: 500 }
    );
  }
}
