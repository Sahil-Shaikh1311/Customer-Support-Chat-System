import { useState, useEffect, useRef } from "react";
import { ChatMessages } from "../components/chat/ChatMessages";
import { ChatInput } from "../components/chat/ChatInput";
import type { Message } from "../components/chat/ChatBubble";
import api from "../api/axios";
import {
  MessageSquare,
  LogOut,
  History,
  ChevronLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type CustomerChatSession = {
  chat_id: number;
  agent_name: string;
  is_active: boolean;
  created_at: string;
};

export default function CustomerChat() {
  const navigate = useNavigate();

  const [chatList, setChatList] = useState<CustomerChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [activeChat, setActiveChat] = useState<CustomerChatSession | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const [typingUser, setTypingUser] = useState<string | null>(null);
  const typingTimeoutRef = useRef<any>(null);


  const socketRef = useRef<WebSocket | null>(null);


  useEffect(() => {
    const loadChats = async () => {
      try {
        const res = await api.get("/chat/customer/chats/");
        setChatList(res.data);

        // auto select active chat
        const active = res.data.find((c: any) => c.is_active);
        if (active) {
          setActiveChatId(active.chat_id);
          setActiveChat(active);
        }
      } catch (err) {
        console.error("Failed to load customer chats", err);
      }
    };

    loadChats();
  }, []);

  useEffect(() => {
    if (!activeChatId) return;

    const loadHistory = async () => {
      try {
        setIsLoading(true);

        const res = await api.get(`/chat/history/${activeChatId}/`);

        const formatted: Message[] = res.data.map((msg: any) => ({
          id: String(msg.id),
          content: msg.content,
          sender: msg.role === "customer" ? "customer" : "agent",
          time: new Date(msg.created_at).toLocaleTimeString(),
        }));

        setMessages(formatted);
      } catch (err) {
        console.error("Failed to load chat history", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [activeChatId]);

  useEffect(() => {
    if (!activeChatId) return;

    if (socketRef.current) {
      socketRef.current.close();
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
  console.error("No JWT token found");
  return;
}

    const wsUrl = `ws://127.0.0.1:8000/ws/chat/${activeChatId}/?token=${token}`;
    const socket = new WebSocket(wsUrl);

      socketRef.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

        if (data.type === "typing") {

        if(data.role === "customer") return;

        if (data.is_typing) {
          setTypingUser(data.role === "agent" ? "Agent" : "Customer");
        } else {
          setTypingUser(null);
        }
        return;
      }


      const username = localStorage.getItem("username");

      if (data.sender === username) return;

       const newMessage: Message = {
        id: Date.now().toString(),
        content: data.message,
        sender: data.role,
        time: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, newMessage]);
    };



    return () => socket.close();
  }, [activeChatId]);

  const handleSendMessage = (content: string) => {
    if (!socketRef.current || !activeChat?.is_active) return;
    
    // const userId = Number(localStorage.getItem("userId"));

    socketRef.current.send(
      JSON.stringify({
        message: content,
        // sender_id: userId,
      })
    );

  };

  const startNewChat = async () => {
    try {
      const res = await api.post("/chat/start/");
      const chatId = res.data.chat_id;

      setActiveChatId(chatId);
      setActiveChat({
        chat_id: chatId,
        agent_name: "Support Agent",
        is_active: true,
        created_at: new Date().toISOString(),
      });

      const listRes = await api.get("/chat/customer/chats/");
      setChatList(listRes.data);
    } catch (err) {
      console.error("Failed to start new chat", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="h-screen flex flex-col bg-white text-gray-900 overflow-hidden">

      <header className="h-14 shrink-0 px-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-teal-500 text-white flex items-center justify-center">
            <MessageSquare className="h-5 w-5" />
          </div>
          <h2 className="font-semibold text-lg">SupportHub</h2>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setShowHistory(!showHistory)}>
            {showHistory ? <ChevronLeft /> : <History />}
          </button>
          <button onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {showHistory && (
          <aside className="w-64 border-r p-3 space-y-2 shrink-0 overflow-y-auto">
            {chatList.map((chat) => (
              <button
                key={chat.chat_id}
                onClick={() => {
                  setActiveChatId(chat.chat_id);
                  setActiveChat(chat);
                  setShowHistory(false);
                }}
                className="w-full text-left p-2 rounded hover:bg-gray-100"
              >
                <div className="flex justify-between">
                  <span>{chat.agent_name}</span>
                  <span className={chat.is_active ? "text-green-600" : "text-gray-400"}>
                    {chat.is_active ? "Active" : "Resolved"}
                  </span>
                </div>
              </button>
            ))}

            {!chatList.some(c => c.is_active) && (
              <button
                onClick={startNewChat}
                className="mt-4 w-full bg-teal-500 text-white rounded p-2"
              >
                Start New Chat
              </button>
            )}
          </aside>
        )}


        <main className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 py-2">
            <ChatMessages
              messages={messages}
              currentUserId="customer"
              isLoading={isLoading}
            />
          </div>
          {typingUser && (
            <div className="px-4 py-1 text-sm italic text-gray-500">
              {typingUser} is typing...
            </div>
          )}


          {activeChat?.is_active ? (

            <div className="shrink-0 border-t bg-white">
              <ChatInput

                onSend={handleSendMessage}
                onTyping={() => {
                  if (!socketRef.current) return;
                  console.log("SENDING......:");
                  socketRef.current.send(
                    JSON.stringify({
                      type: "typing",
                      is_typing: true,
                      // sender_id: Number(localStorage.getItem("userId")),
                      // role: "customer",
                    })
                  );

                  clearTimeout(typingTimeoutRef.current);
                  typingTimeoutRef.current = setTimeout(() => {
                    socketRef.current?.send(
                      JSON.stringify({
                        type: "typing",
                        is_typing: false,
                        // sender_id: Number(localStorage.getItem("userId")),
                        // role: "customer",
                      })
                    );
                  }, 1000);
                }}
              />
            </div>

          ) : (
            <p className="text-center text-gray-500 text-sm p-3">
              This chat is resolved. Start a new chat for further help.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
