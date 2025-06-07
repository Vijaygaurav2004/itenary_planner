"use client";

import { useState, useEffect, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";

interface ChatBoxProps {
  onClose: () => void;
}

export default function ChatBox({ onClose }: ChatBoxProps) {
  const [messages, setMessages] = useState<
    { from: "user" | "bot"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text: input }]);

    const response = await axios.post("http://localhost:8080/giveairesponce", {
      content: input,
    });

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: `${response.data.candidates[0].content.parts[0].text}`,
        },
      ]);
    }, 600);

    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="
        fixed bottom-6 right-6
        h-[50vh]
        w-96
        bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
        border border-gray-300 dark:border-gray-700
        flex flex-col
        rounded-2xl
        shadow-2xl
        z-50
        ring-1 ring-gray-300 dark:ring-gray-700
        animate-slideFadeIn
      "
      style={{
        animationDuration: "0.4s",
        animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl shadow-md">
        <span className="text-lg select-none">Travel Assistant</span>
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="text-white hover:text-gray-300 transition rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-white"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 px-5 py-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 dark:scrollbar-thumb-indigo-700 dark:scrollbar-track-gray-700"
        style={{ overscrollBehavior: "contain" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-sm px-4 py-2 rounded-xl max-w-[80%] break-words ${
              msg.from === "user"
                ? "bg-blue-100 self-end ml-auto text-blue-900"
                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white self-start mr-auto"
            } shadow-sm`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex border-t border-gray-300 dark:border-gray-700 p-3 rounded-b-2xl bg-white dark:bg-gray-900">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-4 py-2 rounded-l-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-r-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Send message"
        >
          Send
        </button>
      </div>
    </div>
  );
}
