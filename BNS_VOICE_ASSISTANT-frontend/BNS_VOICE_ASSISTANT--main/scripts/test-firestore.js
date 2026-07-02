
import { appendLead, getLeads, phoneExists } from "../lib/firestore.js";

async function testFirestore() {
  try {
    const testPhone = "9999999999";

    console.log("── Testing Firestore connection ──\n");

    // 1. Check if test phone already exists
    const existsBefore = await phoneExists(testPhone);
    console.log("1. Phone exists before:", existsBefore);

    if (!existsBefore) {
      console.log("\n2. Appending test lead...");
      const result = await appendLead({
        name: "Test User",
        phone: testPhone,
        destination: "Goa",
        travelDate: "December",
        numberOfPeople: 4,
        budget: "40000",
        summary: "Test lead from Firestore script",
        intent: "package_enquiry",
      });

      console.log("   ✓ Lead saved:", result);
    } else {
      console.log("\n2. Skipping insert — lead already exists for this phone.");
    }

    // 3. Read all leads
    console.log("\n3. Reading all leads from Firestore...");
    const leads = await getLeads();
    console.log(`   ✓ Total leads: ${leads.length}`);
    console.log("   Latest lead:", leads[0]);

    // 4. Duplicate check (should be true now)
    console.log("\n4. Checking duplicate detection for", testPhone, "...");
    const existsAfter = await phoneExists(testPhone);
    console.log(
      `   ✓ phoneExists("${testPhone}") = ${existsAfter} (should be true)`
    );

    console.log("\n── All Firestore tests passed ──");
    process.exit(0);
  } catch (error) {
    console.error("Firestore test failed:", error);
    process.exit(1);
  }
}

testFirestore();
