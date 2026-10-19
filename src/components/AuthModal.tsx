import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { X, Lock, Mail, User, ShieldCheck } from "lucide-react";

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginUser, showToast } = useStore();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("+91 98765 43210");

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast("Email required", "Please enter a valid email address.", "error");
      return;
    }
    const role = email.toLowerCase().includes("admin") ? "admin" : "customer";
    loginUser(email, name || undefined, role);
  };

  const handleDemoCustomer = () => {
    loginUser("anchalyadav092006@gmail.com", "Anchal Yadav", "customer");
  };

  const handleDemoAdmin = () => {
    loginUser("concierge-admin@luxewear.in", "Head Atelier Administrator", "admin");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="relative bg-[#FAF9F5] border border-[#E8E2D7] w-full max-w-md rounded-sm p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-[#71717A] hover:text-[#18181B]"
        >
          <X size={18} />
        </button>

        <div className="text-center space-y-2 mb-6">
          <span className="font-serif text-2xl font-bold tracking-[0.2em] text-[#18181B] uppercase">
            LUXE WEAR
          </span>
          <p className="text-xs text-[#71717A] tracking-wider uppercase">
            {isSignUp ? "Create a Patron Account" : "Access Your Patron Account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isSignUp && (
            <div>
              <label className="block text-[#71717A] mb-1 font-medium uppercase tracking-wider text-[10px]">
                Full Name *
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-3 text-[#A1A1AA]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anchal Yadav"
                  className="w-full pl-9 pr-3 py-2.5 border border-[#E8E2D7] bg-white rounded-xs focus:outline-none focus:border-[#18181B]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[#71717A] mb-1 font-medium uppercase tracking-wider text-[10px]">
              Email Address *
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-3 text-[#A1A1AA]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 border border-[#E8E2D7] bg-white rounded-xs focus:outline-none focus:border-[#18181B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#71717A] mb-1 font-medium uppercase tracking-wider text-[10px]">
              Password *
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-3 text-[#A1A1AA]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 border border-[#E8E2D7] bg-white rounded-xs focus:outline-none focus:border-[#18181B]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#18181B] hover:bg-[#27272A] text-white py-3 rounded-xs uppercase tracking-widest font-semibold transition-colors mt-2"
          >
            {isSignUp ? "Register Account" : "Sign In to LUXE WEAR"}
          </button>
        </form>

        {/* Demo Fast Login Buttons */}
        <div className="pt-6 mt-6 border-t border-[#E8E2D7] space-y-2">
          <p className="text-[10px] text-center text-[#71717A] uppercase tracking-wider font-semibold">
            Quick One-Click Demo Access
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={handleDemoCustomer}
              className="py-2 px-3 border border-[#E8E2D7] hover:border-[#18181B] bg-white text-[#18181B] rounded-xs font-medium text-center"
            >
              Demo Patron
            </button>
            <button
              onClick={handleDemoAdmin}
              className="py-2 px-3 border border-[#8C7355] hover:bg-[#8C7355] hover:text-white bg-white text-[#8C7355] rounded-xs font-medium text-center flex items-center justify-center gap-1"
            >
              <ShieldCheck size={13} />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-[#8C7355] hover:underline"
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account yet? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
};
