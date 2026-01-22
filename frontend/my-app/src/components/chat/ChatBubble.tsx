export interface Message {
  id: string;
  content: string;
  sender: "customer" | "agent";
  time: string;
}

interface ChatBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
}

export function ChatBubble({
  message,
  isOwn,
  showAvatar = true,
}: ChatBubbleProps) {
  return (
    <div
      className={`flex gap-2 max-w-[80%] ${
        isOwn ? "ml-auto flex-row-reverse" : "mr-auto"
      }`}
    >
            {showAvatar && (
        <div
          className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium ${
            isOwn ? "bg-teal-600 text-white" : "bg-gray-300 text-gray-700"
          }`}
        >
          {isOwn ? "S" : "A"}
        </div>
      )}

      
      <div className="flex flex-col gap-1">
        <div
          className={`px-3 py-2 rounded-lg text-[13px] leading-snug ${
            isOwn
              ? "bg-teal-400 text-white"
              : "bg-gray-200 text-gray-900"
          }`}
        >
        {message.content}
        </div>

       
        <span
          className={`text-[11px] text-gray-400 ${
            isOwn ? "text-right" : "text-left"
          }`}
        >
          {message.time}
        </span>
      </div>
    </div>
  );
}
