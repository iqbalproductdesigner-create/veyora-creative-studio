import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Kamu bisa ganti username & password rahasia kamu di sini
    if (username === 'admin' && password === 'veyora123') {
      localStorage.setItem('admin_token', 'veyora-secret-token-active');
      navigate('/admin/dashboard');
    } else {
      setError('Username atau Password salah!');
    }
  };

  return (
    <div className="min-h-screen bg-[#080D10] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#121417] border border-[#23262B] rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="font-head font-bold text-2xl tracking-[0.18em] text-white">VEYORA</span>
          <p className="text-xs text-[#A3AAB4]">Masuk ke Panel Khusus Admin</p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/40 text-red-300 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#A3AAB4] mb-1">Username Admin</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#A3AAB4] absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#080D10] border border-[#23262B] focus:border-[#5C6773] rounded-xl py-3 pl-10 pr-3 text-white outline-none"
                placeholder="Masukkan username"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#A3AAB4] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A3AAB4] absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#080D10] border border-[#23262B] focus:border-[#5C6773] rounded-xl py-3 pl-10 pr-3 text-white outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#5C6773] hover:bg-[#D9DEE6] hover:text-black text-white font-semibold py-3 rounded-xl transition-all shadow-lg text-xs mt-2"
          >
            Masuk Sekarang
          </button>
        </form>
      </div>
    </div>
  );
}
