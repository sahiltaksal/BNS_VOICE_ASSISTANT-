// utils/mergeCollectedData.js
// Merge newly collected fields into the existing collected-data object,
// ignoring null/undefined/empty values so previously known fields are kept.

export function mergeCollectedData(existing = {}, incoming = {}) {
  const merged = { ...existing };

  if (incoming && typeof incoming === "object") {
    Object.keys(incoming).forEach((key) => {
      const value = incoming[key];
      if (value !== null && value !== undefined && value !== "") {
        merged[key] = value;
      }
    });
  }

  return merged;
}

// Fields tracked on the Collected Information Card, in display order.
export const LEAD_FIELDS = [
  { key: "destination", label: "Destination" },
  { key: "packageType", label: "Package" },
  { key: "travelDate", label: "Travel Date" },
  { key: "numberOfPeople", label: "Number of People" },
  { key: "budget", label: "Budget" },
  { key: "name", label: "Name" },
  { key: "phone", label: "Phone" },
  { key: "specialRequirements", label: "Special Requirements" },
];

/**
 * Work out how many of the tracked lead fields have a value, for a
 * simple "3 of 8 collected" progress indicator.
 */
export function getCollectionProgress(collectedData = {}) {
  const filled = LEAD_FIELDS.filter(
    (f) =>
      collectedData[f.key] !== null &&
      collectedData[f.key] !== undefined &&
      collectedData[f.key] !== ""
  ).length;

  return { filled, total: LEAD_FIELDS.length };
}
