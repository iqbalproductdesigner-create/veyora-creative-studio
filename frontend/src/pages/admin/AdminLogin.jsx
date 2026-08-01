import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.ok) navigate("/admin");
    else setError(res.error);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-[#080D10] px-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <span className="font-head font-bold text-2xl tracking-[0.18em] text-white">VEYORA</span>
          <span className="font-body text-[10px] uppercase tracking-[0.35em] text-[#A3AAB4] mt-1">Admin Panel</span>
        </div>

        <form onSubmit={submit} className="surface-card p-8" data-testid="admin-login-form">
          <h1 className="font-head text-white text-xl mb-6">Masuk ke Dashboard</h1>

          {error && (
            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 font-body" data-testid="login-error">
              {error}
            </div>
          )}

          <label className="block mb-4">
            <span className="font-body text-sm text-[#A3AAB4] mb-2 block">Email</span>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A3AAB4] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                data-testid="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#080D10] border border-[#23262B] rounded-xl pl-11 pr-4 py-3 text-white font-body text-sm focus:border-[#5C6773] outline-none transition-colors"
                placeholder="admin@veyora.studio"
              />
            </div>
          </label>

          <label className="block mb-6">
            <span className="font-body text-sm text-[#A3AAB4] mb-2 block">Password</span>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A3AAB4] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                data-testid="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#080D10] border border-[#23262B] rounded-xl pl-11 pr-4 py-3 text-white font-body text-sm focus:border-[#5C6773] outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
          </label>

          <button type="submit" disabled={loading} data-testid="login-submit" className="btn-primary w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
