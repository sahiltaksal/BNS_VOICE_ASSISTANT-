import Link from "next/link";
import { PlaneTakeoff } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-sand">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-paper">
            <PlaneTakeoff size={16} />
          </span>
          <div>
            <p className="font-display text-base font-semibold">ABC Travels</p>
            <p className="text-xs text-ink/60">
              Boarding passes to better holidays.
            </p>
          </div>
        </div>

        <div className="flex gap-6 text-sm text-ink/70">
          <Link href="/" className="hover:text-coral">Home</Link>
          <Link href="/receptionist" className="hover:text-coral">AI Receptionist</Link>
          <Link href="/leads" className="hover:text-coral">Leads Dashboard</Link>
        </div>

        <p className="text-xs text-ink/50">
          &copy; {new Date().getFullYear()} ABC Travels. Demo build.
        </p>
      </div>
    </footer>
  );
}
