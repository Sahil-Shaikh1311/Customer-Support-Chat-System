import { useRef, useEffect } from "react";
import { ChatBubble } from "./ChatBubble";
import type { Message } from "./ChatBubble";
import { MessageSquare } from "lucide-react";

interface ChatMessagesProps {
  messages: Message[];
  currentUserId: "customer" | "agent";
  isLoading?: boolean;
}

export function ChatMessages({
  messages,
  currentUserId,
  isLoading = false,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

    if (isLoading) {
    return (
      <div className="flex-1 p-4 text-sm text-gray-500">
        Loading messages...
      </div>
    );
  }

 
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center text-gray-500">
          <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <MessageSquare className="h-8 w-8" />
          </div>
          <h3 className="font-medium mb-1">No messages yet</h3>
          <p className="text-sm">
            Start the conversation by sending a message.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-100  break-all
     whitespace-pre-wrap">
      {messages.map((message, index) => (
        <ChatBubble
          key={message.id}
          message={message}
          isOwn={message.sender === currentUserId}
          showAvatar={
            index === 0 || messages[index - 1].sender !== message.sender
          }
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

