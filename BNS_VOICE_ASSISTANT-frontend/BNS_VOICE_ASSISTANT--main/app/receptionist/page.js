"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Send,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  Headset,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import ChatWindow from "@/components/ChatWindow";
import VoiceButton from "@/components/VoiceButton";
import SpeakingAnimation from "@/components/SpeakingAnimation";
import CollectedInfoCard from "@/components/CollectedInfoCard";
import { speak, stopSpeaking } from "@/utils/textToSpeech";

const GREETING =
  "Hi, I'm Aria from ABC Travels! Where are you dreaming of travelling to?";

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `msg-${Date.now()}-${idCounter}`;
}

function freshMessages() {
  return [{ id: nextId(), role: "assistant", text: GREETING }];
}

export default function ReceptionistPage() {
  const [messages, setMessages] = useState(freshMessages);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [collectedData, setCollectedData] = useState({});
  const [leadSaved, setLeadSaved] = useState(false);
  const [errorBanner, setErrorBanner] = useState("");

  const conversationHistoryRef = useRef([]);
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const speakReply = useCallback((text) => {
    if (isMutedRef.current || !text) return;
    speak(text, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  }, []);

  const sendMessage = useCallback(
    async (rawText) => {
      const text = rawText.trim();
      if (!text || isTyping) return;

      setErrorBanner("");
      setMessages((prev) => [...prev, { id: nextId(), role: "user", text }]);
      setInputText("");
      setIsTyping(true);

      try {
        const res = await fetch(`/api/ai/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
            conversationHistory: conversationHistoryRef.current,
            collectedData,
          }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }



        const data = await res.json();

        conversationHistoryRef.current = [
          ...conversationHistoryRef.current,
          { role: "user", parts: [{ text }] },
          {
            role: "model",
            parts: [
              {
                text: JSON.stringify({
                  intent: data.intent,
                  reply: data.reply,
                  collectedData: data.collectedData,
                  isLeadReady: data.isLeadReady,
                  handoffRequired: data.handoffRequired,
                  summary: data.summary,
                }),
              },
            ],
          },
        ];

        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "assistant",
            text: data.reply || "Sorry, could you say that again?",
            isError: data.success === false,
          },
        ]);

        if (data.collectedData) setCollectedData(data.collectedData);
        if (data.leadSaved) setLeadSaved(true);

        speakReply(data.reply);
      } catch (err) {
        const fallback =
          "I'm having trouble connecting right now. Please check your connection and try again.";
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: "assistant", text: fallback, isError: true },
        ]);
        setErrorBanner("Could not reach the receptionist service.");
      } finally {
        setIsTyping(false);
      }
    },
    [collectedData, isTyping, speakReply]
  );

  const handleTranscript = useCallback(
    (transcript) => {
      sendMessage(transcript);
    },
    [sendMessage]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next) stopSpeaking();
      return next;
    });
  };

  const startNewConversation = () => {
    stopSpeaking();
    setMessages(freshMessages());
    setInputText("");
    setCollectedData({});
    setLeadSaved(false);
    setErrorBanner("");
    conversationHistoryRef.current = [];
  };

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-coral">
              Gate · AI Receptionist
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Talk to Aria
            </h1>
          </div>
          <button
            onClick={startNewConversation}
            className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink/70 transition-colors hover:border-coral hover:text-coral"
          >
            <RotateCcw size={15} />
            New Conversation
          </button>
        </div>

        {leadSaved && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-lagoon/30 bg-lagoon/10 px-5 py-4 text-lagoon-dark">
            <CheckCircle2 size={20} className="shrink-0 text-lagoon" />
            <div>
              <p className="font-semibold">Your enquiry is booked in!</p>
              <p className="text-sm text-lagoon-dark/80">
                One of our travel experts will call you back shortly.
              </p>
            </div>
          </div>
        )}

        {errorBanner && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-coral/30 bg-coral/10 px-5 py-4 text-coral-dark">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm">{errorBanner}</p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Chat column */}
          <div className="flex flex-col rounded-2xl border border-line bg-white shadow-ticket">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-paper">
                  <Headset size={16} />
                </span>
                <div>
                  <p className="font-display text-sm font-semibold leading-tight">
                    Aria
                  </p>
                  <p className="text-xs text-ink/50">AI Travel Receptionist</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SpeakingAnimation active={isSpeaking} />
                <button
                  onClick={toggleMute}
                  aria-pressed={isMuted}
                  title={isMuted ? "Unmute voice replies" : "Mute voice replies"}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink/60 transition-colors hover:border-coral hover:text-coral"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>
            </div>

            <ChatWindow messages={messages} isTyping={isTyping} />

            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-line px-4 py-4"
            >
              <VoiceButton onTranscript={handleTranscript} disabled={isTyping} />
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message, or tap the mic to speak…"
                className="flex-1 rounded-full border border-line bg-paper px-4 py-2.5 text-sm outline-none placeholder:text-ink/40 focus:border-coral"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-colors hover:bg-coral disabled:opacity-40"
                title="Send message"
              >
                <Send size={17} />
              </button>
            </form>
          </div>

          {/* Collected info sidebar */}
          <CollectedInfoCard collectedData={collectedData} />
        </div>
      </main>
    </>
  );
}
