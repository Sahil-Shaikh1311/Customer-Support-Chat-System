import { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
import { ChatMessages } from "../components/chat/ChatMessages";
import { ChatInput } from "../components/chat/ChatInput";
import { ChatListItem } from "../components/chat/ChatListItem";
import type { ChatSession } from "../components/chat/ChatListItem";
import type { Message } from "../components/chat/ChatBubble";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"
import {
  MessageSquare,
  LogOut,
  Search,
  CheckCircle,
  Filter,
  Menu,
  X,
  RotateCcw,
} from "lucide-react";
type FilterType = "all" | "active" | "resolved";

export default function AgentDashboard() {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChat, setActiveChat] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const socketRef = useRef<WebSocket | null>(null);

  const [typingUser, setTypingUser] = useState<string | null>(null);
  const typingTimeoutRef = useRef<any>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!activeChat) return;

    if (socketRef.current) {
      socketRef.current.close();
    }

      const token = localStorage.getItem("accessToken");

    const wsUrl = `ws://127.0.0.1:8000/ws/chat/${activeChat.id}/?token=${token}`;

    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Agent connected:", activeChat.id);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

          if (data.type === "typing") {

        if(data.role === "agent") return;

        if (data.is_typing) {
          setTypingUser(data.role === "agent" ? "Agent" : "Customer");
        } else {
          setTypingUser(null);
        }
        return;
      }


      const loggedInUsername = localStorage.getItem("username");
      if (data.sender === loggedInUsername) return;

      const newMessage: Message = {
        id: Date.now().toString(),
        content: data.message,
        sender: data.role,
        time: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, newMessage]);
    };

    socket.onclose = () => {
      console.log("Agent socket closed");
    };

    return () => socket.close();
  }, [activeChat]);


  const handleSelectChat = async (chat: ChatSession) => {
    setActiveChat(chat);
    setIsLoadingMessages(true);

    try {
      const res = await api.get(`/chat/history/${chat.id}/`);

      const formatted: Message[] = res.data.map((msg: any) => ({
        id: msg.id.toString(),
        content: msg.content,
        sender: msg.role === "agent" ? "agent" : "customer",
        time: new Date(msg.created_at).toLocaleTimeString(),
      }));

      setMessages(formatted);
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setIsLoadingMessages(false);
    }

    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };


  useEffect(() => {
    const loadChats = async () => {
      try {
        setIsLoadingChats(true);

        const res = await api.get("/chat/agent/chats/");
        console.log("AGENT CHAT LIST RESPONSE:", res.data);

        const formatted: ChatSession[] = res.data.map((chat: any) => ({
          id: String(chat.chat_id),
          customerName: chat.customer_name,
          customerEmail: chat.customer_email,
          lastMessage: chat.last_message ?? "",
          lastMessageTime: new Date(chat.last_message_time),
          unreadCount: chat.unread_count ?? 0,
          isResolved: false,
        }));

        setChats(formatted);
      } catch (err) {
        console.error("Failed to load chats", err);
      } finally {
        setIsLoadingChats(false);
      }
    };

    loadChats();
  }, []);



  const handleSendMessage = (content: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    // const userId = Number(localStorage.getItem("userId"));

    // send to backend
    socketRef.current.send(
      JSON.stringify({
        message: content,
        // sender_id: userId,
      })
    );


  };

  const handleResolveChat = async () => {
    if (!activeChat) return;

    try {
      await api.post(`/chat/resolve/${activeChat.id}/`);

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat.id
            ? { ...chat, isResolved: true }
            : chat
        )
      );

      setActiveChat({ ...activeChat, isResolved: true });
    } catch (err) {
      console.error("Failed to resolve chat", err);
    }
  };


  const handleReopenChat = () => {
    if (!activeChat) return;

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat.id ? { ...chat, isResolved: false } : chat
      )
    );
    setActiveChat({ ...activeChat, isResolved: false });

  };

  const filteredChats = chats.filter((chat) => {
    const matchesSearch = chat.customerName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !chat.isResolved) ||
      (filter === "resolved" && chat.isResolved);
    return matchesSearch && matchesFilter;
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="h-screen flex flex-col bg-white text-gray-900 overflow-hidden">

      <header className=" bg-white  border-b border-gray-200 shadow-sm  px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className=" h-8 w-8 rounded-lg bg-teal-500 flex items-center justify-center">
            <div className="h-10 w-10 rounded-xl text-white  flex items-center justify-center">
              <MessageSquare className="h-5 w-5 " />
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-2xl text-teal-900">Agent Dashboard</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">

          <button title="Logout" onClick={handleLogout} className="inline-flex items-center gap-2 py-2 px-2 rounded-2xl  font-medium text-teal-700 shadow hover:bg-teal-100  transition">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden bg-white">
        <aside
          className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 fixed md:relative inset-y-0 left-0  md:top-0 w-80  flex flex-col z-10 transition-transform duration-300`}
        >

          <div className="p-4 space-y-3 shadow-sm mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 " />
              <input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-gray-100  w-full shadow-sm rounded-lg text-sm focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "active", "resolved"] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 capitalize shadow-sm  py-2 rounded-lg text-sm  hover:bg-teal-100  transition  text-center  font-medium  text-teal-700 ${filter === f
                    ? "bg-teal-500 text-white"
                    : "bg-gray-100"
                    }`}
                >
                  {f === "all" ? "All" : f === "active" ? "Active" : "Resolved"}
                </button>
              ))}
            </div>
          </div>


          <div className="flex-1 overflow-y-auto">
            {isLoadingChats ? (
              <p className="p-4 text-sm text-gray-500">Loading chats...</p>
            ) : filteredChats.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No conversations found</p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {filteredChats.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeChat?.id === chat.id}
                    onClick={() => handleSelectChat(chat)}
                  />
                ))}
              </div>
            )}
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm  md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 flex flex-col min-w-0">
          {activeChat ? (
            <>

              <div className="bg-card shadow-lg px-3  flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-teal-500 flex items-center justify-center text-primary-foreground font-medium">
                      {activeChat.customerName.charAt(0)}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5">
                    </div>
                  </div>
                  <div>
                    <h2 className="font-semibold ">
                      {activeChat.customerName}
                    </h2>
                    <p className="text-sm ">
                      {activeChat.customerEmail}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activeChat.isResolved ? (
                    <button
                      onClick={handleReopenChat}
                      className="gap-2 "
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reopen
                    </button>
                  ) : (
                    <button
                      onClick={handleResolveChat}
                      className="gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Resolve
                    </button>
                  )}
                </div>
              </div>


              <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-100">
                <ChatMessages
                  messages={messages}
                  currentUserId="agent"
                  isLoading={isLoadingMessages}
                />
                {typingUser && (
                <div className="px-4 py-1 text-sm italic text-gray-500">
                  {typingUser} is typing...
                </div>
              )}
              </div>
              


              {!activeChat.isResolved && (
                
                <ChatInput
                  onSend={handleSendMessage}
                  onTyping={() => {
                    if (!socketRef.current) return;

                    socketRef.current.send(
                      JSON.stringify({
                        type: "typing",
                        is_typing: true,
                        // sender_id: Number(localStorage.getItem("userId")),
                        // role: "agent",
                      })
                    );

                    clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = setTimeout(() => {
                      socketRef.current?.send(
                        JSON.stringify({
                          type: "typing",
                          is_typing: false,
                          // sender_id: Number(localStorage.getItem("userId")),
                          // role: "agent",
                        })
                      );
                    }, 1000);
                  }}
                />

              )}

              {activeChat.isResolved && (
                <div className="p-4 bg-muted/50 text-center text-sm  border-t border-border">
                  This conversation has been resolved. Reopen to continue chatting.
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-100">
              <div className="text-center ">
                <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-teal-100 flex items-center justify-center">
                  <MessageSquare className="h-10 w-10 text-teal-900" />
                </div>
                <h3 className="font-medium  mb-1">
                  Select a conversation
                </h3>
                <p className="text-sm">
                  Choose a chat from the sidebar to start helping customers
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
