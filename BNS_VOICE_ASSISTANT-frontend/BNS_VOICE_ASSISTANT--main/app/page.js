import Link from "next/link";
import {
  Mic,
  MessageCircle,
  Clock3,
  ShieldCheck,
  ArrowRight,
  IndianRupee,
  Sparkles,
  PhoneCall,
  ClipboardCheck,
  Headset,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import packages from "@/data/packages.json";

const FEATURES = [
  {
    icon: Mic,
    title: "Talk, don't type",
    desc: "Speak naturally and Aria transcribes, understands, and replies in your voice — no forms, no menus.",
  },
  {
    icon: Clock3,
    title: "On duty around the clock",
    desc: "No hold music, no office hours. Aria answers travel questions the moment they come to mind.",
  },
  {
    icon: ShieldCheck,
    title: "Never asks for sensitive info",
    desc: "No OTPs, card numbers, or passport details — just enough to have a human expert call you back.",
  },
  {
    icon: Sparkles,
    title: "Knows every package by heart",
    desc: "Prices, inclusions, best travel months — pulled straight from our current package catalogue.",
  },
];

const STEPS = [
  {
    icon: PhoneCall,
    title: "Start the conversation",
    desc: "Tap the mic or type — tell Aria where you're dreaming of going.",
  },
  {
    icon: MessageCircle,
    title: "Answer a few quick questions",
    desc: "Aria asks one thing at a time: dates, group size, budget — at your pace.",
  },
  {
    icon: ClipboardCheck,
    title: "Your enquiry is boarded",
    desc: "Once the essentials are in, your enquiry is saved and ticketed automatically.",
  },
  {
    icon: Headset,
    title: "A human takes it from here",
    desc: "Our travel expert calls you back with the best-fit options and final pricing.",
  },
];

export default function LandingPage() {
  return (
    <>
      <Navbar />

      {/* HERO — styled as a boarding pass */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 font-mono text-xs uppercase tracking-widest text-lagoon">
              <span className="h-1.5 w-1.5 rounded-full bg-lagoon" />
              Now boarding · AI Receptionist
            </span>

            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Your next holiday starts with a{" "}
              <span className="italic text-coral">conversation</span>, not a form.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-ink/70 sm:text-lg">
              Meet Aria, ABC Travels&rsquo; AI receptionist. Speak or type your
              travel plans and she&rsquo;ll find the right package, answer your
              questions, and hand your enquiry to a real travel expert.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/receptionist"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-medium text-paper transition-colors hover:bg-coral"
              >
                <Mic size={18} />
                Talk to AI Receptionist
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="#packages"
                className="text-sm font-medium text-ink/70 underline decoration-line decoration-2 underline-offset-4 hover:text-coral"
              >
                Browse packages
              </Link>
            </div>
          </div>

          {/* Boarding pass visual */}
          <div className="relative mx-auto w-full max-w-sm animate-floatSlow">
            <div className="ticket-notch relative rounded-2xl border border-line bg-white p-6 shadow-ticket">
              <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-ink/40">
                <span>Boarding Pass</span>
                <span>ABC-AI</span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-mono text-3xl font-semibold text-ink">YOU</p>
                  <p className="text-xs text-ink/50">Right here</p>
                </div>
                <ArrowRight className="text-coral" size={22} />
                <div className="text-right">
                  <p className="font-mono text-3xl font-semibold text-ink">GOA</p>
                  <p className="text-xs text-ink/50">or anywhere</p>
                </div>
              </div>

              <div className="tear-line my-5" />

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-ink/40">Passenger</p>
                  <p className="mt-1 font-medium text-ink">Ask Aria</p>
                </div>
                <div>
                  <p className="text-ink/40">Gate</p>
                  <p className="mt-1 font-medium text-ink">/receptionist</p>
                </div>
                <div>
                  <p className="text-ink/40">Status</p>
                  <p className="mt-1 font-medium text-lagoon">Ready to talk</p>
                </div>
                <div>
                  <p className="text-ink/40">Boarding</p>
                  <p className="mt-1 font-medium text-ink">Anytime</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR PACKAGES */}
      <section id="packages" className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-coral">
              Popular Routes
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Where travellers are heading
            </h2>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="ticket-notch relative flex flex-col rounded-2xl border border-line bg-white shadow-ticket"
            >
              <div className="flex items-center justify-between px-5 pt-5 font-mono text-xs uppercase tracking-widest text-ink/40">
                <span>{pkg.destination.slice(0, 3).toUpperCase()}</span>
                <span>{pkg.duration}</span>
              </div>

              <div className="px-5 pb-4 pt-2">
                <h3 className="font-display text-xl font-semibold">{pkg.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">
                  {pkg.highlights}
                </p>
              </div>

              <div className="tear-line mx-5" />

              <div className="flex flex-1 flex-col gap-3 px-5 py-4">
                <div className="flex flex-wrap gap-1.5">
                  {pkg.includes.slice(0, 3).map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-sand px-2.5 py-1 text-xs text-ink/60"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <p className="flex items-center font-mono text-lg font-semibold text-ink">
                    <IndianRupee size={15} />
                    {pkg.pricePerPerson.toLocaleString("en-IN")}
                    <span className="ml-1 text-xs font-normal text-ink/40">
                      /person
                    </span>
                  </p>
                  <Link
                    href="/receptionist"
                    className="text-xs font-semibold text-coral hover:underline"
                  >
                    Ask Aria →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-y border-line bg-sand/50">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <p className="font-mono text-xs uppercase tracking-widest text-coral">
            Why Aria
          </p>
          <h2 className="mt-2 max-w-xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            A receptionist that never puts you on hold
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-line bg-white p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lagoon/10 text-lagoon">
                  <f.icon size={18} />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-coral">
          The Itinerary
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          How a conversation becomes a holiday
        </h2>

        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative rounded-2xl border border-line bg-white p-5">
              <span className="font-mono text-xs text-ink/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-3 flex h-10 w-10 items-center justify-center rounded-full bg-coral/10 text-coral">
                <step.icon size={18} />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex justify-center">
          <Link
            href="/receptionist"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-medium text-paper transition-colors hover:bg-coral"
          >
            <Mic size={18} />
            Talk to AI Receptionist
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
