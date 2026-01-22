import { format } from "date-fns";

export interface ChatSession {
  id: string;
  customerName: string;
  customerEmail?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isResolved?: boolean;
}

interface ChatListItemProps {
  chat: ChatSession;
  isActive?: boolean;
  onClick?: () => void;
}

export function ChatListItem({ chat, isActive = false, onClick,}: ChatListItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-start gap-3 p-3 rounded-lg text-left hover:bg-gray-100 ${
        isActive ? "bg-gray-200" : ""
      }`}
    >
      {/* Avatar */}
      <div className="shrink-0">
        <div className="h-10 w-10 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-medium">
          {chat.customerName.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Chat Info */}
      <div className="flex-1 min-w-0 ">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm truncate">
            {chat.customerName}
          </span>
          <span className="text-xs text-gray-500">
            {format(chat.lastMessageTime, "HH:mm")}
          </span>
        </div>

        <p className="text-sm text-gray-500  truncate mt-0.5">
          {chat.lastMessage}
        </p>
      </div>

      {/* Unread Count */}
      {chat.unreadCount > 0 && (
        <div className="shrink-0 h-5 min-w-5 px-1.5 rounded-full bg-teal-500 text-white text-xs font-medium flex items-center justify-center">
          {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
        </div>
      )}
    </button>
  );
}
