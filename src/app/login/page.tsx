"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDatabase } from "../../context/DatabaseContext";
import { Shield, Key, Mail, ArrowRight, UserCheck } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const { setActiveRole, setActiveBranch } = useDatabase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    // Simulate Login, redirect to Dashboard
    router.push("/dashboard");
  };

  // Quick Switch logins for testing
  const triggerDemoLogin = (role: string, branchId: string) => {
    setActiveRole(role);
    setActiveBranch(branchId);
    if (role === "Client") {
      router.push("/client-portal");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090D1A] px-4 select-none relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl shadow-2xl p-8 z-10">
        
        {/* Title logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-extrabold text-2xl mx-auto shadow-lg shadow-primary/20">
            D
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-white tracking-tight">Deepak Yadav & Associates</h2>
          <p className="mt-2 text-xs text-slate-400">CA CRM & Compliance Management Suite</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Corporate Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="rajesh@cafirm.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900/60 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">Password</label>
              <Link href="/forgot-password" className="text-[10px] font-semibold text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Key className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900/60 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white font-semibold rounded-lg text-sm flex items-center justify-center transition-all duration-200 shadow shadow-primary/10 mt-6 cursor-pointer"
          >
            Login to Workspace <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </form>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">Demo Access Shortcuts</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Demo profiles shortcut */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => triggerDemoLogin("CA Partner", "br-delhi")}
            className="flex items-center justify-start p-2 bg-slate-900/40 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-lg transition-all text-[11px] text-slate-300 font-semibold cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-400 mr-2 flex-shrink-0" />
            <div className="text-left truncate">
              <div>Partner View</div>
              <div className="text-[9px] text-slate-500">Delhi Head Office</div>
            </div>
          </button>
          <button
            onClick={() => triggerDemoLogin("Tax Consultant", "br-mumbai")}
            className="flex items-center justify-start p-2 bg-slate-900/40 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-lg transition-all text-[11px] text-slate-300 font-semibold cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-400 mr-2 flex-shrink-0" />
            <div className="text-left truncate">
              <div>Consultant View</div>
              <div className="text-[9px] text-slate-500">Mumbai Office</div>
            </div>
          </button>
          <button
            onClick={() => triggerDemoLogin("Data Entry Operator", "br-delhi")}
            className="flex items-center justify-start p-2 bg-slate-900/40 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-lg transition-all text-[11px] text-slate-300 font-semibold cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-sky-400 mr-2 flex-shrink-0" />
            <div className="text-left truncate">
              <div>Operator View</div>
              <div className="text-[9px] text-slate-500">Full Uploads</div>
            </div>
          </button>
          <button
            onClick={() => triggerDemoLogin("Client", "br-delhi")}
            className="flex items-center justify-start p-2 bg-slate-900/40 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-lg transition-all text-[11px] text-slate-300 font-semibold cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-400 mr-2 flex-shrink-0" />
            <div className="text-left truncate">
              <div>Client Portal</div>
              <div className="text-[9px] text-slate-500">Acme Tech Portal</div>
            </div>
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Don't have a firm account?{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Register Firm
          </Link>
        </p>

      </div>
    </div>
  );
}
