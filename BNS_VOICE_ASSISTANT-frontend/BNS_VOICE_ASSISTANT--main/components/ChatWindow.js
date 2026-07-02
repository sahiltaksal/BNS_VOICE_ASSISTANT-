"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import LoadingDots from "./LoadingDots";

export default function ChatWindow({ messages, isTyping }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  return (
    <div className="chat-scroll flex h-[420px] flex-col gap-4 overflow-y-auto px-4 py-5 sm:h-[480px]">
      {messages.map((m) => (
        <MessageBubble key={m.id} role={m.role} text={m.text} isError={m.isError} />
      ))}

      {isTyping && (
        <div className="flex items-center gap-2 pl-9">
          <LoadingDots />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
