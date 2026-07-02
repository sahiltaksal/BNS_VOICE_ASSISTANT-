export default function LoadingDots({ label = "Aria is typing" }) {
  return (
    <div className="flex items-center gap-2 text-ink/50" role="status" aria-live="polite">
      <span className="flex gap-1">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40" />
      </span>
      <span className="text-xs italic">{label}&hellip;</span>
    </div>
  );
}
