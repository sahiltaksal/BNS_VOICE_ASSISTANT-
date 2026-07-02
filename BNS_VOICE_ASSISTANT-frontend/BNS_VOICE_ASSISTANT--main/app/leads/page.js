"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users,
  CalendarCheck,
  MapPin,
  Clock,
  RefreshCw,
  Download,
  Search,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import LeadsTable from "@/components/LeadsTable";
import { exportLeadsToCSV } from "@/utils/exportCSV";
import { isToday, timeAgo } from "@/utils/formatDate";

const ACCESS_KEY = "demo2024";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/leads/list?key=${ACCESS_KEY}`);
      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Failed to load leads.");
        setLeads([]);
      } else {
        setLeads(data.leads || []);
      }
    } catch (err) {
      setError("Could not reach the leads service. Please try again.");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter((lead) =>
      [lead.name, lead.phone, lead.destination, lead.summary]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q))
    );
  }, [leads, search]);

  const summary = useMemo(() => {
    const total = leads.length;
    const today = leads.filter((l) => isToday(l.createdAt)).length;

    const destCounts = {};
    leads.forEach((l) => {
      if (!l.destination) return;
      destCounts[l.destination] = (destCounts[l.destination] || 0) + 1;
    });
    const topDestination =
      Object.entries(destCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    const latest = leads[0];

    return { total, today, topDestination, latest };
  }, [leads]);

  const cards = [
    {
      label: "Total Leads",
      value: summary.total,
      icon: Users,
      accent: "bg-lagoon/10 text-lagoon",
    },
    {
      label: "Today's Leads",
      value: summary.today,
      icon: CalendarCheck,
      accent: "bg-coral/10 text-coral",
    },
    {
      label: "Top Destination",
      value: summary.topDestination,
      icon: MapPin,
      accent: "bg-ink/10 text-ink",
    },
    {
      label: "Latest Lead",
      value: summary.latest
        ? `${summary.latest.name || "Unnamed"} · ${timeAgo(summary.latest.createdAt)}`
        : "—",
      icon: Clock,
      accent: "bg-lagoon/10 text-lagoon",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-coral">
              Manifest
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Leads Dashboard
            </h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchLeads}
              disabled={loading}
              className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink/70 transition-colors hover:border-coral hover:text-coral disabled:opacity-50"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              onClick={() => exportLeadsToCSV(filteredLeads, "abc-travels-leads.csv")}
              disabled={filteredLeads.length === 0}
              className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-coral disabled:opacity-40"
            >
              <Download size={15} />
              Export CSV
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-coral/30 bg-coral/10 px-5 py-4 text-coral-dark">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Summary cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div
              key={c.label}
              className="rounded-2xl border border-line bg-white p-5 shadow-ticket"
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full ${c.accent}`}
              >
                <c.icon size={16} />
              </span>
              <p className="mt-3 text-xs uppercase tracking-wide text-ink/50">
                {c.label}
              </p>
              <p className="mt-1 truncate font-display text-xl font-semibold text-ink">
                {loading ? "…" : c.value}
              </p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-5 flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5">
          <Search size={16} className="text-ink/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, destination, or summary…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
          />
        </div>

        {loading ? (
          <div className="rounded-2xl border border-line bg-white py-16 text-center text-sm text-ink/50">
            Loading leads…
          </div>
        ) : (
          <LeadsTable leads={filteredLeads} />
        )}
      </main>
    </>
  );
}
