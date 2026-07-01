// lib/firestore.js
// Purpose: Firestore service — replaces Google Sheets for lead storage

import { admin, db } from "./firebaseAdmin.js";
import { normalisePhone } from "./validateLead.js";

/**
 * Append a new lead document to the "leads" Firestore collection.
 *
 * @param {Object} leadData
 * @returns {Promise<{ success: boolean, id: string }>}
 */
export async function appendLead(leadData) {
  const phone = normalisePhone(leadData.phone);

  const docRef = await db.collection("leads").add({
    name: leadData.name || "",
    phone,
    email: leadData.email || "",
    destination: leadData.destination || "",
    travelDate: leadData.travelDate || "",
    numberOfPeople: Number(leadData.numberOfPeople) || 0,
    budget: leadData.budget || "",
    packageType: leadData.packageType || "",
    specialRequirements: leadData.specialRequirements || "",
    status: "New",
    summary: leadData.summary || "",
    intent: leadData.intent || "",
    handoffRequired: Boolean(leadData.handoffRequired),
    leadSource: "AI Receptionist",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    success: true,
    id: docRef.id,
  };
}

/**
 * Read all leads from Firestore, ordered newest first.
 *
 * @returns {Promise<Array>}
 */
export async function getLeads() {
  const snapshot = await db
    .collection("leads")
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      name: data.name || "",
      phone: data.phone || "",
      email: data.email || "",
      destination: data.destination || "",
      travelDate: data.travelDate || "",
      numberOfPeople: data.numberOfPeople || "",
      budget: data.budget || "",
      packageType: data.packageType || "",
      specialRequirements: data.specialRequirements || "",
      status: data.status || "New",
      summary: data.summary || "",
      intent: data.intent || "",
      handoffRequired: data.handoffRequired || false,
      leadSource: data.leadSource || "AI Receptionist",
      createdAt: data.createdAt?.toDate?.().toLocaleString("en-IN") || "",
      updatedAt: data.updatedAt?.toDate?.().toLocaleString("en-IN") || "",
    };
  });
}

/**
 * Check if a phone number already exists in Firestore.
 * Uses an indexed query — much faster than reading all leads.
 *
 * @param {string} phone
 * @returns {Promise<boolean>}
 */
export async function phoneExists(phone) {
  const normalisedPhone = normalisePhone(phone);

  if (!normalisedPhone) {
    return false;
  }

  const snapshot = await db
    .collection("leads")
    .where("phone", "==", normalisedPhone)
    .limit(1)
    .get();

  return !snapshot.empty;
}
