// lib/sheets.js
// Purpose: Google Sheets API v4 client for reading and writing leads

import { google } from "googleapis";
import { normalisePhone } from "./validateLead.js";

// Column order in the Google Sheet (Row 1 = headers)
// Timestamp | Name | Phone | Email | Destination | Travel Date | Number of People | Budget | Package Type | Special Requirements | Status | Summary

const SHEET_RANGE = "Sheet1";
const HEADER_ROW_COUNT = 1;

function getAuthClient() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

/**
 * Append a new lead row to the Google Sheet.
 *
 * @param {Object} leadData
 * @returns {Promise<{ success: boolean }>}
 */
export async function appendLead(leadData) {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });

  const timestamp = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const row = [
    timestamp,
    leadData.name || "",
    normalisePhone(leadData.phone) || leadData.phone || "",
    leadData.email || "",
    leadData.destination || "",
    leadData.travelDate || "",
    leadData.numberOfPeople || "",
    leadData.budget || "",
    leadData.packageType || "",
    leadData.specialRequirements || "",
    "New",
    leadData.summary || "",
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${SHEET_RANGE}!A:L`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [row],
    },
  });

  return { success: true };
}

/**
 * Read all leads from the Google Sheet.
 * Skips the header row and returns newest first.
 *
 * @returns {Promise<Array>}
 */
export async function getLeads() {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${SHEET_RANGE}!A:L`,
  });

  const rows = response.data.values || [];

  if (rows.length <= HEADER_ROW_COUNT) {
    return [];
  }

  // Skip header row, map to objects, reverse for newest first
  const dataRows = rows.slice(HEADER_ROW_COUNT);

  const leads = dataRows
    .map((row) => ({
      timestamp: row[0] || "",
      name: row[1] || "",
      phone: row[2] || "",
      email: row[3] || "",
      destination: row[4] || "",
      travelDate: row[5] || "",
      numberOfPeople: row[6] || "",
      budget: row[7] || "",
      packageType: row[8] || "",
      specialRequirements: row[9] || "",
      status: row[10] || "New",
      summary: row[11] || "",
    }))
    .filter((lead) => lead.name || lead.phone); // skip empty rows

  return leads.reverse();
}

/**
 * Check if a phone number already exists in the sheet.
 *
 * @param {string} phone
 * @returns {Promise<boolean>}
 */
export async function phoneExists(phone) {
  const normalised = normalisePhone(phone);
  if (!normalised) return false;

  const leads = await getLeads();
  return leads.some((lead) => normalisePhone(lead.phone) === normalised);
}
