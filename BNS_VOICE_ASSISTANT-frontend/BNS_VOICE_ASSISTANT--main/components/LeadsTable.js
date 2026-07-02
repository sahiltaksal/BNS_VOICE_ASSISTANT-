"use client";

const STATUS_STYLES = {
  New: "bg-lagoon/10 text-lagoon",
  Contacted: "bg-coral/10 text-coral-dark",
  Converted: "bg-green-100 text-green-700",
  Closed: "bg-ink/10 text-ink/50",
};

export default function LeadsTable({ leads = [] }) {
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-line bg-white py-16 text-center">
        <p className="font-display text-lg font-semibold text-ink">
          No leads to show
        </p>
        <p className="text-sm text-ink/50">
          Try a different search, or check back once Aria collects new enquiries.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-ticket">
      <table className="min-w-full divide-y divide-line text-sm">
        <thead className="bg-sand/60 text-left text-xs uppercase tracking-wide text-ink/50">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Phone</th>
            <th className="px-4 py-3 font-medium">Destination</th>
            <th className="px-4 py-3 font-medium">Travel Date</th>
            <th className="px-4 py-3 font-medium">People</th>
            <th className="px-4 py-3 font-medium">Budget</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Created At</th>
            <th className="px-4 py-3 font-medium">Summary</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-sand/30">
              <td className="whitespace-nowrap px-4 py-3 font-medium text-ink">
                {lead.name || "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-ink/70">
                {lead.phone || "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {lead.destination || "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {lead.travelDate || "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {lead.numberOfPeople || "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {lead.budget || "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    STATUS_STYLES[lead.status] || "bg-sand text-ink/60"
                  }`}
                >
                  {lead.status || "New"}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-ink/60">
                {lead.createdAt || "—"}
              </td>
              <td className="max-w-xs truncate px-4 py-3 text-ink/60" title={lead.summary}>
                {lead.summary || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
