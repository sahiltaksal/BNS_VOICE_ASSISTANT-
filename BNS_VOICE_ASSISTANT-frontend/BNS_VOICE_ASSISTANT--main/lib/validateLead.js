// lib/validateLead.js
// Purpose: Validate required lead fields before saving to Firestore

/**
 * Normalise a phone number to 10 digits.
 * Strips +91, country codes, spaces, and hyphens.
 *
 * @param {string|number} phone
 * @returns {string} 10-digit phone string or original if cannot normalise
 */
export function normalisePhone(phone) {
  if (!phone) return "";
  let p = String(phone).trim();
  // Remove +91 or 91 prefix
  p = p.replace(/^\+91/, "").replace(/^91(?=\d{10}$)/, "");
  // Remove spaces, hyphens, dots
  p = p.replace(/[\s\-().]/g, "");
  return p;
}

/**
 * Validate a lead object before saving.
 *
 * @param {Object} leadData
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateLead(leadData) {
  const errors = [];

  // name
  if (!leadData.name || String(leadData.name).trim() === "") {
    errors.push("name is required");
  }

  // phone
  const phone = normalisePhone(leadData.phone);
  if (!phone) {
    errors.push("phone is required");
  } else if (!/^\d{10}$/.test(phone)) {
    errors.push("phone must be a valid 10-digit number");
  }

  // destination
  if (!leadData.destination || String(leadData.destination).trim() === "") {
    errors.push("destination is required");
  }

  // numberOfPeople
  if (
    leadData.numberOfPeople === null ||
    leadData.numberOfPeople === undefined ||
    leadData.numberOfPeople === ""
  ) {
    errors.push("numberOfPeople is required");
  }

  // travelDate
  if (!leadData.travelDate || String(leadData.travelDate).trim() === "") {
    errors.push("travelDate is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
