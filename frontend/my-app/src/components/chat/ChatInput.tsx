import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  onTyping?: () => void
}

export function ChatInput({
  onSend,
  onTyping,
  disabled = false,
  placeholder = "Type a message...",
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setMessage("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 p-4 border-t border-gray-200 bg-white">
      <textarea
        ref={inputRef}
        value={message}
        onChange={(e) =>{ setMessage(e.target.value);
          onTyping?.();
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="flex-1 resize-none rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
        style={{ height: "48px" }}
        onInput={(e) => {
          const el = e.currentTarget;
          el.style.height = "48px";
          el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
        }}
      />

      <button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="h-12 w-15 rounded-xl bg-teal-500 text-white flex items-center justify-center"
      >
        <Send className="h-8 w-8" />
      </button>
    </div>
  );
}
