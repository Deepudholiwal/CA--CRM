"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDatabase } from "../../context/DatabaseContext";
import { Building, User, Mail, Lock, CheckCircle, ArrowLeft } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTenant } = useDatabase();

  const [firmName, setFirmName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<"STARTER" | "PROFESSIONAL" | "ENTERPRISE">("PROFESSIONAL");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const planParam = searchParams.get("plan");
    if (planParam === "starter") setSelectedPlan("STARTER");
    if (planParam === "professional") setSelectedPlan("PROFESSIONAL");
    if (planParam === "enterprise") setSelectedPlan("ENTERPRISE");
  }, [searchParams]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firmName || !adminName || !email || !password) return;

    // Simulate multi-tenant registration
    setTenant({
      name: firmName,
      slug: firmName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      plan: selectedPlan,
      status: "ACTIVE",
      brandingColor: "indigo",
    });

    setSuccess(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090D1A] px-4 py-12 relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-lg bg-card/45 backdrop-blur-xl border border-border/40 rounded-2xl shadow-2xl p-8 z-10">
        
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Landing
        </Link>

        {success ? (
          <div className="text-center py-10">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-xl font-bold text-white">Firm Registered Successfully!</h2>
            <p className="text-sm text-slate-400 mt-2">Provisioning database container and workspace folders...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white tracking-tight">Create Firm Workspace</h2>
            <p className="text-xs text-slate-400 mt-1.5">Configure your SaaS subscription and primary branch.</p>

            <form onSubmit={handleRegister} className="space-y-4 mt-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Firm Legal Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Building className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Manoj Verma & Partners CA"
                    value={firmName}
                    onChange={(e) => setFirmName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900/60 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Workspace Plan</label>
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
                  >
                    <option value="STARTER">Starter Tier</option>
                    <option value="PROFESSIONAL">Professional Tier</option>
                    <option value="ENTERPRISE">Enterprise Tier</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Primary Branch</label>
                  <input
                    type="text"
                    disabled
                    value="Head Office (DEL-01)"
                    className="w-full px-3 py-2 bg-slate-800/40 border border-slate-800 rounded-lg text-sm text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Managing Partner Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="CA Manoj Verma"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900/60 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address (Username)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="manoj@verma-ca.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900/60 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Secure Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
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
                Provision Workspace
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400">
              Already registered?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Login here
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#090D1A] text-white text-xs font-semibold">
        Loading workspace setup...
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
