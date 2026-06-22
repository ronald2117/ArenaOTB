import React, { useState } from "react";
import { X, Mail, Lock, ShieldAlert, User } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (username: string, token: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (authMode === "signin") {
      if (!email || !password) {
        setError("Please fill in all fields.");
        return;
      }
      try {
        const response = await fetch("http://localhost:5195/api/Auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errMsg = await response.text();
          setError(errMsg || "Login failed. Invalid credentials.");
          return;
        }

        const data = await response.json();
        const token = data.token;

        const username = email.split("@")[0];
        const capitalized = username.charAt(0).toUpperCase() + username.slice(1);
        onLoginSuccess(capitalized || "Organizer Admin", token);
        onClose();
      } catch (err) {
        setError("Network error. Could not connect to the backend server.");
      }
    } else {
      // Sign Up Mode
      if (!name || !email || !password || !confirmPassword) {
        setError("Please fill in all registration fields.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      try {
        const response = await fetch("http://localhost:5195/api/Auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errMsg = await response.text();
          setError(errMsg || "Registration failed.");
          return;
        }

        const data = await response.json();
        const token = data.token;

        onLoginSuccess(name.trim(), token);
        onClose();
      } catch (err) {
        setError("Network error. Could not connect to the backend server.");
      }
    }
  };

  const handleGoogleLogin = () => {
    setError("");
    onLoginSuccess("GM Magnus (Google)");
    onClose();
  };

  const handleDemoLogin = () => {
    setError("");
    onLoginSuccess("Organizer Demo");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900/95 glow-cyan">
        {/* Header decoration */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand/Title */}
        <div className="mb-4 text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">
            Organizer <span className="text-cyan-500 dark:text-cyan-400">Portal</span>
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {authMode === "signin" 
              ? "Sign in to create, run, and referee Chess Arenas"
              : "Register a new organizer account to manage local events"}
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 mb-5 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => {
              setAuthMode("signin");
              setError("");
            }}
            className={`flex-1 pb-3 text-center transition-colors ${
              authMode === "signin"
                ? "border-b-2 border-cyan-500 text-cyan-600 dark:text-cyan-400"
                : "text-slate-450 dark:text-slate-500 hover:text-slate-700"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthMode("signup");
              setError("");
            }}
            className={`flex-1 pb-3 text-center transition-colors ${
              authMode === "signup"
                ? "border-b-2 border-cyan-500 text-cyan-600 dark:text-cyan-400"
                : "text-slate-450 dark:text-slate-500 hover:text-slate-700"
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600 dark:border-red-950 dark:bg-red-950/20 dark:text-red-400">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login/Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authMode === "signup" && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Display Name / Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. TD Ronald"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-cyan-400 transition-all font-semibold"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                placeholder="organizer@arenaotb.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-cyan-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-cyan-400 transition-all"
              />
            </div>
          </div>

          {authMode === "signup" && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-cyan-600 py-2.5 text-sm font-bold uppercase tracking-wider text-white shadow-md shadow-cyan-600/10 hover:bg-cyan-500 hover:shadow-cyan-600/20 active:scale-[0.98] transition-all dark:bg-cyan-700 dark:hover:bg-cyan-600"
          >
            {authMode === "signin" ? "Sign In As Organizer" : "Register Organizer Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-4 flex items-center justify-between">
          <span className="w-1/5 border-b border-slate-200 dark:border-slate-800" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">
            Or Connect With
          </span>
          <span className="w-1/5 border-b border-slate-200 dark:border-slate-800" />
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-1.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 transition-all active:scale-[0.98]"
          >
            {/* Simple SVG Google Logo */}
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.35 1 3.37 3.65 1.42 7.54l3.87 3C6.24 7.62 8.87 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.42 3.57v2.97h3.89c2.28-2.1 3.56-5.19 3.56-8.69z"
              />
              <path
                fill="#FBBC05"
                d="M5.29 14.54c-.24-.72-.37-1.49-.37-2.27s.13-1.55.37-2.27l-3.87-3C.52 8.88 0 10.38 0 12s.52 3.12 1.42 5l3.87-3.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.89-2.97c-1.09.73-2.5 1.16-4.07 1.16-3.13 0-5.76-2.58-6.71-5.5l-3.87 3C3.37 20.35 7.35 23 12 23z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            onClick={handleDemoLogin}
            className="w-full rounded-lg border border-dashed border-cyan-500/50 bg-cyan-500/5 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-600 hover:bg-cyan-500/10 dark:text-cyan-400 dark:hover:bg-cyan-500/20 transition-all text-center"
          >
            Sign in as Demo Organizer (Bypass)
          </button>
        </div>
      </div>
    </div>
  );
};
