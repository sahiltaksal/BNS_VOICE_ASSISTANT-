export default function SpeakingAnimation({ active = false }) {
  return (
    <div
      className="flex h-4 items-end gap-0.5"
      role="status"
      aria-label={active ? "Aria is speaking" : "Aria is silent"}
    >
      {[
        "animate-wave1",
        "animate-wave2",
        "animate-wave3",
        "animate-wave2",
        "animate-wave1",
      ].map((anim, i) => (
        <span
          key={i}
          className={`w-1 origin-bottom rounded-full bg-coral ${
            active ? anim : ""
          } ${active ? "opacity-100" : "opacity-30"}`}
          style={{ height: "100%" }}
        />
      ))}
    </div>
  );
}
