import { MessageSquare, User, Headphones } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";


export default function LoginPage() {
  const [role, setRole] = useState<"customer" | "agent" | null>(null);
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("Please select a role.");
      return;
    }

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.post("/auth/login/", {
        username,
        password,
        role,
      });

      console.log(response.data);

      const { access, refresh , role: userRole, user_id } = response.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("role", userRole); 
      localStorage.setItem("userId", user_id.toString());

       if (userRole === "agent") {
        navigate("/agent-dashboard");
      } else {
        navigate("/customer-chat");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-200 text-gray-900">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-teal-400 mb-4 shadow-lg">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold">SupportHub</h2>
          <p className="mt-2 text-gray-600">Customer support platform</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-300">
          <h2 className="text-xl font-semibold text-center mb-6">
            Sign into your account
          </h2>

          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3 text-left">I am a</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition ${
                  role === "customer"
                    ? "bg-teal-500 text-white border-teal-500"
                    : "bg-teal-100 text-teal-800 border-teal-200"
                }`}
              >
                <User className="h-5 w-5" />
                <span className="font-medium">Customer</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("agent")}
                className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition ${
                  role === "agent"
                    ? "bg-teal-500 text-white border-teal-500"
                    : "bg-teal-100 text-teal-800 border-teal-200"
                }`}
              >
                <Headphones className="h-5 w-5" />
                <span className="font-medium">Agent</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Username</label>
              <input
                type="name"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setusername(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Password
              </label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>

            <p className="text-sm text-center text-gray-500">
              If you don't have an account, please register first.            
                <span
                  className="text-teal-600 cursor-pointer ml-1"
                  onClick={() => navigate("/register")}
                >
                  Register
                </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
