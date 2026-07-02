import { PlaneTakeoff, User, AlertTriangle } from "lucide-react";

export default function MessageBubble({ role, text, isError = false }) {
  const isUser = role === "user";

  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-lagoon text-paper" : "bg-ink text-paper"
        }`}
      >
        {isUser ? <User size={14} /> : <PlaneTakeoff size={14} />}
      </span>

      <div
        className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "rounded-br-sm bg-lagoon text-paper"
            : isError
            ? "rounded-bl-sm border border-coral/40 bg-coral/10 text-coral-dark"
            : "rounded-bl-sm border border-line bg-white text-ink"
        }`}
      >
        {isError && (
          <span className="mb-1 flex items-center gap-1 text-xs font-semibold">
            <AlertTriangle size={12} /> Something went wrong
          </span>
        )}
        {text}
      </div>
    </div>
  );
}
