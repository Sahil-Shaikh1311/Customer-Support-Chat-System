import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function RegisterPage() {
  const [role, setRole] = useState<"customer" | "agent" | null>(null);
  const [username, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !mobile || !email || !password || !confirmPassword || !role) {
      setError("Please fill all fields and select a role.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    try {
    setIsLoading(true);

    await api.post("/auth/register/", {
      username,
      email,
      password,
      role,
    });

    navigate("/login");
  } catch (err: any) {
    setError(err.response?.data?.message || "Registration failed");
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
            Create your account
          </h2>

          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3 text-left">I am a</h4>
            <select
              value={role || ""}
              onChange={e => setRole(e.target.value as "customer" | "agent")}
              className="w-full rounded-xl border-2 border-teal-200 px-4 py-2 bg-teal-100 text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <option value="" disabled>Select role</option>
              <option value="customer">Customer</option>
              <option value="agent">Agent</option>
            </select>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <input
                type="text"
                placeholder="Your Name"
                value={username}
                onChange={e => setName(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Mobile No.</label>
              <input
                type="tel"
                placeholder="Mobile Number"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Password</label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Set Password</label>
              <input
                type="password"
                placeholder="Re-enter Password"
                value={confirmPassword}
                onChange={e => setconfirmPassword(e.target.value)}
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
                "Register"
              )}
            </button>
            <p className="text-sm text-center text-gray-500">
              Already have an account? <span className="text-teal-600 cursor-pointer" onClick={() => navigate("/login")}>Login</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
