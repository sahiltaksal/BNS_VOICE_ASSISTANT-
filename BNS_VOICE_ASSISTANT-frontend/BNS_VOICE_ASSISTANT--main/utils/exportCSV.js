// utils/exportCSV.js
// Convert an array of lead objects into a downloadable CSV file.

function escapeCSVValue(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportLeadsToCSV(leads = [], filename = "leads.csv") {
  if (typeof window === "undefined" || leads.length === 0) return;

  const columns = [
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "destination", label: "Destination" },
    { key: "travelDate", label: "Travel Date" },
    { key: "numberOfPeople", label: "People" },
    { key: "budget", label: "Budget" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created At" },
    { key: "summary", label: "Summary" },
  ];

  const header = columns.map((c) => escapeCSVValue(c.label)).join(",");
  const rows = leads.map((lead) =>
    columns.map((c) => escapeCSVValue(lead[c.key])).join(",")
  );

  const csvContent = [header, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
