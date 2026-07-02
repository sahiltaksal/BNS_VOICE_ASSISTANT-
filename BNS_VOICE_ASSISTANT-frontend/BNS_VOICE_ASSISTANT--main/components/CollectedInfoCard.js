"use client";

import {
  MapPin,
  Package,
  CalendarDays,
  Users,
  Wallet,
  User,
  Phone,
  FileText,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { LEAD_FIELDS, getCollectionProgress } from "@/utils/mergeCollectedData";

const ICONS = {
  destination: MapPin,
  packageType: Package,
  travelDate: CalendarDays,
  numberOfPeople: Users,
  budget: Wallet,
  name: User,
  phone: Phone,
  specialRequirements: FileText,
};

export default function CollectedInfoCard({ collectedData = {} }) {
  const { filled, total } = getCollectionProgress(collectedData);
  const pct = Math.round((filled / total) * 100);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-white shadow-ticket">
      {/* ticket header stub */}
      <div className="ticket-notch relative border-b border-dashed border-line px-5 py-4">
        <p className="text-xs font-mono uppercase tracking-widest text-ink/50">
          Enquiry Boarding Pass
        </p>
        <div className="mt-1 flex items-center justify-between">
          <p className="font-display text-lg font-semibold">
            {collectedData.name || "Traveller Details"}
          </p>
          <span className="font-mono text-xs text-ink/50">
            {filled}/{total} collected
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-sand">
          <div
            className="h-full rounded-full bg-coral transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <ul className="flex flex-col gap-3 px-5 py-4">
        {LEAD_FIELDS.map((field) => {
          const Icon = ICONS[field.key] || Circle;
          const value = collectedData[field.key];
          const has = value !== null && value !== undefined && value !== "";

          return (
            <li key={field.key} className="flex items-center gap-3 text-sm">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  has ? "bg-lagoon/10 text-lagoon" : "bg-sand text-ink/30"
                }`}
              >
                <Icon size={14} />
              </span>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                <span className="text-ink/50">{field.label}</span>
                <span
                  className={`truncate text-right font-medium ${
                    has ? "text-ink" : "text-ink/30"
                  }`}
                >
                  {has ? String(value) : "—"}
                </span>
              </div>
              {has ? (
                <CheckCircle2 size={14} className="shrink-0 text-lagoon" />
              ) : (
                <Circle size={14} className="shrink-0 text-ink/20" />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
