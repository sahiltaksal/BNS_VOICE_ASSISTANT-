// scripts/test-sheets.js
// Manual test script — verifies Google Sheets connection works end to end.
// Run with: npm run test:sheets   (or: node -r dotenv/config scripts/test-sheets.js)

import "dotenv/config";
import { appendLead, getLeads, phoneExists } from "../lib/sheets.js";

async function run() {
  console.log("── Testing Google Sheets connection ──\n");

  // 1. Append a test row
  console.log("1. Appending test lead...");
  const testLead = {
    name: "Test User",
    phone: "9999999999",
    email: "",
    destination: "Goa",
    travelDate: "December 2025",
    numberOfPeople: 2,
    budget: "20000",
    packageType: "",
    specialRequirements: "",
    summary: "Test lead inserted by scripts/test-sheets.js",
  };

  try {
    await appendLead(testLead);
    console.log("   ✓ Test lead appended successfully.\n");
  } catch (err) {
    console.error("   ✗ Failed to append lead:", err.message);
    console.error(
      "   Check GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, and GOOGLE_PRIVATE_KEY in .env.local"
    );
    process.exit(1);
  }

  // 2. Read all leads
  console.log("2. Reading all leads from sheet...");
  let leads = [];
  try {
    leads = await getLeads();
    console.log(`   ✓ Found ${leads.length} lead(s).\n`);
    console.log("   Most recent lead:", leads[0]);
  } catch (err) {
    console.error("   ✗ Failed to read leads:", err.message);
    process.exit(1);
  }

  // 3. Duplicate check
  console.log("\n3. Checking duplicate detection for 9999999999...");
  try {
    const exists = await phoneExists("9999999999");
    console.log(`   ✓ phoneExists("9999999999") = ${exists} (should be true)`);
  } catch (err) {
    console.error("   ✗ Duplicate check failed:", err.message);
    process.exit(1);
  }

  console.log("\n── All Google Sheets tests passed ──");
}

run();
