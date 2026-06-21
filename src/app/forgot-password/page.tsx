"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, KeyRound } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090D1A] px-4 relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/40 rounded-2xl shadow-2xl p-8 z-10">
        
        {sent ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto mb-4 border border-emerald-500/20">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Reset Link Dispatched</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              We have dispatched a secure password verification link to <span className="text-slate-200 font-semibold">{email}</span>.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center text-xs font-semibold text-primary hover:underline"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-white tracking-tight">Recover Password</h2>
            <p className="text-xs text-slate-400 mt-1">We will send a secure validation link to your corporate inbox.</p>

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Corporate Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="rajesh@cafirm.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900/60 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white font-semibold rounded-lg text-sm flex items-center justify-center transition-all duration-200 shadow shadow-primary/10 mt-6 cursor-pointer"
              >
                Send Reset Link
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Login
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
