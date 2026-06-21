"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Shield,
  Users,
  Calendar,
  MessageSquare,
  Zap,
  BarChart3,
  Sparkles,
  Smartphone,
  Building2,
  Lock,
  CheckCircle2,
  TrendingUp,
  FileText
} from "lucide-react";

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("annually");
  const [activeSandboxTab, setActiveSandboxTab] = useState<"notice" | "whatsapp" | "branch">("notice");
  
  // Interactive Notice Sandbox States
  const [isNoticeAnalyzing, setIsNoticeAnalyzing] = useState(false);
  const [noticeResult, setNoticeResult] = useState(false);
  const [replyDraftText, setReplyDraftText] = useState("");
  
  // Interactive WhatsApp Sandbox States
  const [whatsappStatus, setWhatsappStatus] = useState<Record<string, "idle" | "sending" | "sent">>({
    "1": "idle",
    "2": "idle",
    "3": "idle",
  });
  const [activePhoneMsg, setActivePhoneMsg] = useState("");

  // Interactive Branch Sandbox States
  const [selectedBranchKpi, setSelectedBranchKpi] = useState<"delhi" | "mumbai" | "bangalore">("delhi");

  // Reset states on sandbox tab switch
  useEffect(() => {
    setIsNoticeAnalyzing(false);
    setNoticeResult(false);
    setReplyDraftText("");
    setWhatsappStatus({ "1": "idle", "2": "idle", "3": "idle" });
    setActivePhoneMsg("");
  }, [activeSandboxTab]);

  const runNoticeDemo = () => {
    setIsNoticeAnalyzing(true);
    setNoticeResult(false);
    setReplyDraftText("");
    setTimeout(() => {
      setIsNoticeAnalyzing(false);
      setNoticeResult(true);
      
      // Simulate typewriter effect for drafting reply
      const text = "Dear Sir/Madam, In response to Notice IT-SEC143-2026-9023, we submit that the interest income of ₹12,450 has been correctly reported under Schedule OS. The mismatch is due to a double-accounting entry in the client's Form 26AS generated on June 1st. We request rectifying the assessment accordingly. Regards, Deepak Yadav & Associates.";
      let currentIdx = 0;
      const interval = setInterval(() => {
        setReplyDraftText((prev) => prev + text.charAt(currentIdx));
        currentIdx++;
        if (currentIdx >= text.length) {
          clearInterval(interval);
        }
      }, 10);
    }, 1500);
  };

  const triggerWhatsappDemo = (id: string, name: string, task: string, date: string) => {
    setWhatsappStatus((prev) => ({ ...prev, [id]: "sending" }));
    setTimeout(() => {
      setWhatsappStatus((prev) => ({ ...prev, [id]: "sent" }));
      setActivePhoneMsg(
        `[WhatsApp Alert to ${name}]\nDear Client, your filings for ${task} are due on ${date}. Please share bank logs. - Deepak Yadav & Co.`
      );
    }, 1200);
  };

  const plans = [
    {
      name: "Starter Retainer",
      priceMonthly: 2499,
      priceAnnually: 1999,
      desc: "Perfect for sole practitioners and newly established GST consultants.",
      features: [
        "Up to 100 Active Clients",
        "GST & Income Tax Filings",
        "Interactive Kanban Task Board",
        "Secure Vault (10 GB Storage)",
        "WhatsApp Due Date Alerts (Manual)",
        "Single Branch Office support",
      ],
      buttonText: "Start Retainer Trial",
      href: "/register?plan=starter",
      popular: false,
    },
    {
      name: "Professional Hub",
      priceMonthly: 6999,
      priceAnnually: 5599,
      desc: "For growing CA and tax firms handling corporate clients and regional audits.",
      features: [
        "Up to 1,000 Active Clients",
        "GST, ITR, TDS & ROC Compliance Suite",
        "Advanced Practice Calendars & Timelines",
        "Secure Vault (100 GB Storage)",
        "Auto-WhatsApp Reminders & Templates",
        "AI Tax Notice Analyzer (50 scans/mo)",
        "Partner E-Sign & Digital Signature approvals",
        "Up to 3 Regional Branches support",
      ],
      buttonText: "Get Workspace Access",
      href: "/register?plan=professional",
      popular: true,
    },
    {
      name: "Enterprise Grid",
      priceMonthly: 12999,
      priceAnnually: 9999,
      desc: "For multi-city corporate tax advisory firms with massive team matrices.",
      features: [
        "Unlimited Clients & Active Portals",
        "Full Practice & Legal Compliance Matrices",
        "Custom Automated Workflows & APIs",
        "Dedicated Database & Storage",
        "Bulk WhatsApp Blast & Campaigns Engine",
        "Unlimited AI Notice Analyzer Scans",
        "Unlimited Branch Office Hubs",
        "24/7 Priority Partner SLA Support",
      ],
      buttonText: "Request Enterprise Pilot",
      href: "/register?plan=enterprise",
      popular: false,
    },
  ];

  return (
    <div className="bg-[#030712] text-white min-h-screen selection:bg-primary selection:text-white flex flex-col justify-between overflow-x-hidden font-sans">
      
      {/* Header Navigation */}
      <header className="max-w-7xl mx-auto w-full px-6 h-20 flex items-center justify-between border-b border-white/5 bg-[#030712]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center font-extrabold text-xl text-white shadow-lg shadow-primary/20">
            D
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base leading-tight tracking-tight text-white">Deepak Yadav & Associates</span>
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">AethelGard CA CRM</span>
          </div>
        </div>
        <div className="flex items-center space-x-5">
          <Link href="/login" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer">
            Access Portal
          </Link>
          <Link
            href="/register"
            className="text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground px-4.5 py-2.5 rounded-lg shadow-lg shadow-primary/10 transition-all duration-200 cursor-pointer"
          >
            Create Workspace
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto w-full px-6 pt-16 pb-12 text-center flex flex-col items-center">
        <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/25 text-primary px-4 py-1.5 rounded-full text-xs font-bold mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 mr-1" />
          <span>Next-Gen CA Practice CRM v2.4</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-5xl leading-tight bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          The ₹50 Lakh Enterprise Compliance & CRM SaaS for Modern CA Firms
        </h1>
        <p className="mt-6 text-sm sm:text-base md:text-lg text-slate-400 max-w-3xl leading-relaxed">
          Manage 10,000+ clients, automate WhatsApp due-date reminders, scan tax notices with AI, track e-signatures, and delegate audits across multiple branches in a unified portal.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-3.5 sm:space-y-0 sm:space-x-4 w-full max-w-md">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-primary hover:bg-primary/95 text-white font-semibold text-xs flex items-center justify-center shadow-lg shadow-primary/20 transition-all duration-200 cursor-pointer"
          >
            Launch Live Demo Sandbox <ArrowRight className="w-3.5 h-3.5 ml-2" />
          </Link>
          <a
            href="#pricing"
            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold text-xs flex items-center justify-center transition-all duration-200"
          >
            Compare Retainers
          </a>
        </div>
      </section>

      {/* Interactive Sandbox Dashboard Mock (THE SHOWCASE) */}
      <section className="max-w-6xl mx-auto w-full px-6 py-6 mb-16">
        <div className="bg-[#0b0f19]/80 border border-border/40 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
          
          {/* Mock Header Tab bar */}
          <div className="bg-slate-950/80 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/40">
            <div className="flex items-center space-x-2.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
              <span className="text-[10px] text-muted-foreground font-semibold pl-2">AethelGard Demo Environment</span>
            </div>
            
            <div className="flex bg-[#1f2937]/40 p-1 rounded-lg border border-border/20">
              <button
                onClick={() => setActiveSandboxTab("notice")}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  activeSandboxTab === "notice" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                AI Notice Analyzer
              </button>
              <button
                onClick={() => setActiveSandboxTab("whatsapp")}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  activeSandboxTab === "whatsapp" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                WhatsApp Automation
              </button>
              <button
                onClick={() => setActiveSandboxTab("branch")}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  activeSandboxTab === "branch" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Branch Hub Matrix
              </button>
            </div>
          </div>

          {/* Sandbox Main Area */}
          <div className="p-6 h-auto md:h-[400px] flex items-stretch">
            {activeSandboxTab === "notice" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch">
                {/* Left: Input Notice */}
                <div className="bg-slate-950/40 border border-border/30 rounded-xl p-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[9px] bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full font-bold uppercase">
                      INCOMING PDF NOTICE / RAW TEXT
                    </span>
                    <div className="font-mono text-[10px] text-slate-400 leading-relaxed bg-[#0c101b] p-3 rounded-lg border border-border/20 max-h-48 overflow-y-auto">
                      "Notice under Section 143(1) of the Income Tax Act. Assessment Year: 2026-27. Issue date: 01/06/2026. Discrepancy observed regarding interest income reported on Form 26AS mismatching computed ITR. Assessed demand difference: ₹12,450."
                    </div>
                  </div>
                  <button
                    onClick={runNoticeDemo}
                    disabled={isNoticeAnalyzing}
                    className="w-full py-2 bg-primary hover:bg-primary/95 text-white text-[10px] font-bold rounded-lg transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
                  >
                    {isNoticeAnalyzing ? (
                      <>
                        <span className="animate-spin w-3 h-3 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                        AI Parsing Notice PDF...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 mr-1.5 text-white" />
                        Run AI Analysis Simulation
                      </>
                    )}
                  </button>
                </div>

                {/* Right: AI Output */}
                <div className="bg-slate-950/40 border border-border/30 rounded-xl p-4 flex flex-col justify-between overflow-y-auto max-h-full">
                  {!isNoticeAnalyzing && !noticeResult ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                      <Sparkles className="w-8 h-8 mb-2 text-slate-700" />
                      <p className="text-[10px]">Click the simulator button to parse the notice text with AethelGard AI.</p>
                    </div>
                  ) : isNoticeAnalyzing ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="text-[10px] font-semibold">Generating Risk Mapping & Reply Drafts...</p>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fade-in text-left">
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="bg-[#1f2937]/20 p-2 rounded border border-border/10">
                          <span className="text-slate-500 block">Filing Section</span>
                          <span className="font-bold text-foreground">Section 143(1)</span>
                        </div>
                        <div className="bg-[#1f2937]/20 p-2 rounded border border-border/10">
                          <span className="text-slate-500 block">Computed Demand</span>
                          <span className="font-bold text-red-400">₹12,450</span>
                        </div>
                        <div className="bg-[#1f2937]/20 p-2 rounded border border-border/10">
                          <span className="text-slate-500 block">Authority</span>
                          <span className="font-bold text-foreground">Income Tax Dept</span>
                        </div>
                        <div className="bg-[#1f2937]/20 p-2 rounded border border-border/10">
                          <span className="text-slate-500 block">Risk Level</span>
                          <span className="font-bold text-yellow-500">MEDIUM RISK</span>
                        </div>
                      </div>
                      
                      <div className="border-t border-border/20 pt-3">
                        <span className="text-[9px] text-muted-foreground font-bold uppercase block mb-1">AI Generated Reply Retainer Letter:</span>
                        <div className="font-mono text-[9px] bg-slate-950 p-2.5 rounded border border-border/30 text-emerald-400 max-h-24 overflow-y-auto leading-relaxed">
                          {replyDraftText}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSandboxTab === "whatsapp" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch">
                {/* Left: Client List */}
                <div className="bg-slate-950/40 border border-border/30 rounded-xl p-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold uppercase">
                      Client Compliance Reminders
                    </span>
                    <div className="space-y-2.5">
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-border/10 flex justify-between items-center text-[10px]">
                        <div>
                          <div className="font-bold text-foreground">Siddharth Mehta (Acme Tech)</div>
                          <div className="text-slate-500 text-[9px]">GSTR-3B Retainer • Due: 25-Jun-2026</div>
                        </div>
                        <button
                          onClick={() => triggerWhatsappDemo("1", "Siddharth Mehta", "GSTR-3B Filing", "25-Jun-2026")}
                          disabled={whatsappStatus["1"] !== "idle"}
                          className="px-2.5 py-1 bg-primary text-white font-bold rounded text-[9px] cursor-pointer disabled:opacity-50"
                        >
                          {whatsappStatus["1"] === "idle" && "Queue Alert"}
                          {whatsappStatus["1"] === "sending" && "Sending..."}
                          {whatsappStatus["1"] === "sent" && "Dispatched ✓"}
                        </button>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-border/10 flex justify-between items-center text-[10px]">
                        <div>
                          <div className="font-bold text-foreground">Ria Sengupta (Art House)</div>
                          <div className="text-slate-500 text-[9px]">ITR Retainer Retrospective • Due: 31-Jul-2026</div>
                        </div>
                        <button
                          onClick={() => triggerWhatsappDemo("2", "Ria Sengupta", "ITR Filing", "31-Jul-2026")}
                          disabled={whatsappStatus["2"] !== "idle"}
                          className="px-2.5 py-1 bg-primary text-white font-bold rounded text-[9px] cursor-pointer disabled:opacity-50"
                        >
                          {whatsappStatus["2"] === "idle" && "Queue Alert"}
                          {whatsappStatus["2"] === "sending" && "Sending..."}
                          {whatsappStatus["2"] === "sent" && "Dispatched ✓"}
                        </button>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-border/10 flex justify-between items-center text-[10px]">
                        <div>
                          <div className="font-bold text-foreground">Dr. Alok Verma (Dental Clinic)</div>
                          <div className="text-slate-500 text-[9px]">TDS quarterly • Due: 15-Jul-2026</div>
                        </div>
                        <button
                          onClick={() => triggerWhatsappDemo("3", "Dr. Alok Verma", "TDS Returns", "15-Jul-2026")}
                          disabled={whatsappStatus["3"] !== "idle"}
                          className="px-2.5 py-1 bg-primary text-white font-bold rounded text-[9px] cursor-pointer disabled:opacity-50"
                        >
                          {whatsappStatus["3"] === "idle" && "Queue Alert"}
                          {whatsappStatus["3"] === "sending" && "Sending..."}
                          {whatsappStatus["3"] === "sent" && "Dispatched ✓"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Phone Simulation */}
                <div className="bg-slate-950/40 border border-border/30 rounded-xl p-4 flex flex-col items-center justify-center">
                  <div className="w-[180px] h-[320px] bg-slate-900 border-4 border-slate-700 rounded-3xl p-3 shadow-xl relative overflow-hidden flex flex-col justify-between">
                    {/* Top Speaker & Camera */}
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-3 bg-slate-700 rounded-full"></div>
                    
                    {/* Phone Header */}
                    <div className="text-[8px] text-slate-500 border-b border-border/20 pb-1.5 mt-2.5 flex justify-between">
                      <span>9:41 AM</span>
                      <span>WhatsApp Cloud API</span>
                    </div>

                    {/* Chat Bubble Container */}
                    <div className="flex-1 py-4 overflow-y-auto flex flex-col justify-end space-y-2">
                      {activePhoneMsg ? (
                        <div className="bg-emerald-600/30 text-[8px] text-slate-300 p-2 rounded-lg border border-emerald-500/20 max-w-[140px] self-end animate-fade-in leading-relaxed font-sans shadow-sm">
                          {activePhoneMsg}
                        </div>
                      ) : (
                        <div className="text-[8px] text-slate-500 text-center italic py-10">
                          Queue a WhatsApp alert on the left to see simulator message output.
                        </div>
                      )}
                    </div>
                    
                    {/* Bottom Line */}
                    <div className="w-16 h-1 bg-slate-600 rounded-full mx-auto mt-1"></div>
                  </div>
                </div>
              </div>
            )}

            {activeSandboxTab === "branch" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch">
                {/* Left: Branch Toggle */}
                <div className="bg-slate-950/40 border border-border/30 rounded-xl p-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase">
                      Select Practice Branch Hub
                    </span>
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedBranchKpi("delhi")}
                        className={`w-full p-2.5 text-left text-[10px] rounded-lg border transition-all cursor-pointer flex justify-between items-center ${
                          selectedBranchKpi === "delhi"
                            ? "bg-primary/10 border-primary text-white"
                            : "bg-slate-900/60 border-border/10 text-slate-400 hover:border-border/30"
                        }`}
                      >
                        <span className="font-bold">Delhi NCR Head Office</span>
                        <span className="px-2 py-0.5 rounded-full bg-primary/25 text-primary border border-primary/30 text-[8px] font-bold">DEL-01</span>
                      </button>
                      <button
                        onClick={() => setSelectedBranchKpi("mumbai")}
                        className={`w-full p-2.5 text-left text-[10px] rounded-lg border transition-all cursor-pointer flex justify-between items-center ${
                          selectedBranchKpi === "mumbai"
                            ? "bg-primary/10 border-primary text-white"
                            : "bg-slate-900/60 border-border/10 text-slate-400 hover:border-border/30"
                        }`}
                      >
                        <span className="font-bold">Mumbai Corporate Branch</span>
                        <span className="px-2 py-0.5 rounded-full bg-primary/25 text-primary border border-primary/30 text-[8px] font-bold">MUM-02</span>
                      </button>
                      <button
                        onClick={() => setSelectedBranchKpi("bangalore")}
                        className={`w-full p-2.5 text-left text-[10px] rounded-lg border transition-all cursor-pointer flex justify-between items-center ${
                          selectedBranchKpi === "bangalore"
                            ? "bg-primary/10 border-primary text-white"
                            : "bg-slate-900/60 border-border/10 text-slate-400 hover:border-border/30"
                        }`}
                      >
                        <span className="font-bold">Bangalore Technology Branch</span>
                        <span className="px-2 py-0.5 rounded-full bg-primary/25 text-primary border border-primary/30 text-[8px] font-bold">BLR-03</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Branch Metrics */}
                <div className="bg-slate-950/40 border border-border/30 rounded-xl p-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-[9px] text-muted-foreground font-bold uppercase block">
                      Live Performance Matrix • {selectedBranchKpi.toUpperCase()}
                    </span>

                    {selectedBranchKpi === "delhi" && (
                      <div className="space-y-3.5 animate-fade-in text-[10px]">
                        <div className="flex justify-between border-b border-border/10 pb-2">
                          <span className="text-slate-500">Active Retainer Clients:</span>
                          <span className="font-bold text-foreground">324 Companies</span>
                        </div>
                        <div className="flex justify-between border-b border-border/10 pb-2">
                          <span className="text-slate-500">Branch Revenue (Monthly):</span>
                          <span className="font-bold text-primary">₹3,45,000 / mo</span>
                        </div>
                        <div className="flex justify-between border-b border-border/10 pb-2">
                          <span className="text-slate-500">Assigned Team Partners:</span>
                          <span className="font-bold text-foreground">8 Senior CAs</span>
                        </div>
                        <div className="flex justify-between border-b border-border/10 pb-2">
                          <span className="text-slate-500">Average Compliance SLA:</span>
                          <span className="font-bold text-emerald-500">97.8% (HIGH SLA)</span>
                        </div>
                      </div>
                    )}

                    {selectedBranchKpi === "mumbai" && (
                      <div className="space-y-3.5 animate-fade-in text-[10px]">
                        <div className="flex justify-between border-b border-border/10 pb-2">
                          <span className="text-slate-500">Active Retainer Clients:</span>
                          <span className="font-bold text-foreground">182 Companies</span>
                        </div>
                        <div className="flex justify-between border-b border-border/10 pb-2">
                          <span className="text-slate-500">Branch Revenue (Monthly):</span>
                          <span className="font-bold text-primary">₹2,10,000 / mo</span>
                        </div>
                        <div className="flex justify-between border-b border-border/10 pb-2">
                          <span className="text-slate-500">Assigned Team Partners:</span>
                          <span className="font-bold text-foreground">5 Senior CAs</span>
                        </div>
                        <div className="flex justify-between border-b border-border/10 pb-2">
                          <span className="text-slate-500">Average Compliance SLA:</span>
                          <span className="font-bold text-emerald-500">95.2% (HIGH SLA)</span>
                        </div>
                      </div>
                    )}

                    {selectedBranchKpi === "bangalore" && (
                      <div className="space-y-3.5 animate-fade-in text-[10px]">
                        <div className="flex justify-between border-b border-border/10 pb-2">
                          <span className="text-slate-500">Active Retainer Clients:</span>
                          <span className="font-bold text-foreground">145 Companies</span>
                        </div>
                        <div className="flex justify-between border-b border-border/10 pb-2">
                          <span className="text-slate-500">Branch Revenue (Monthly):</span>
                          <span className="font-bold text-primary">₹1,85,000 / mo</span>
                        </div>
                        <div className="flex justify-between border-b border-border/10 pb-2">
                          <span className="text-slate-500">Assigned Team Partners:</span>
                          <span className="font-bold text-foreground">4 Senior CAs</span>
                        </div>
                        <div className="flex justify-between border-b border-border/10 pb-2">
                          <span className="text-slate-500">Average Compliance SLA:</span>
                          <span className="font-bold text-emerald-500">99.1% (MAX SLA)</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto w-full px-6 py-20 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Built for Scale, Configured for Compliance</h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto text-xs sm:text-sm">
            Everything your practitioners need to deliver world-class client representation in one platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col items-start hover:border-primary/20 hover:bg-slate-900/10 transition-all duration-300 shadow-sm">
            <div className="p-3 bg-primary/10 text-primary rounded-xl mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Full Role-Based Workspaces</h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
              Separate portals for Partners, Audit Managers, Accountants, and Tax Specialists. Keep data isolated and secure with professional access matrices.
            </p>
          </div>
          
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col items-start hover:border-primary/20 hover:bg-slate-900/10 transition-all duration-300 shadow-sm">
            <div className="p-3 bg-primary/10 text-primary rounded-xl mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">AI Notice Scanner & Parser</h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
              Scan PDF files or paste raw notice strings. Instantly index the section code, calculate tax demand differences, and generate professional response drafts.
            </p>
          </div>
          
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col items-start hover:border-primary/20 hover:bg-slate-900/10 transition-all duration-300 shadow-sm">
            <div className="p-3 bg-primary/10 text-primary rounded-xl mb-6">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">WhatsApp & SMS Campaigns</h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
              Send automated due date reminders to clients. Dispatch bulk return logs, payment receipts, and balance summaries directly to their mobile chat screens.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Retainers Section */}
      <section id="pricing" className="max-w-7xl mx-auto w-full px-6 py-12 border-t border-white/5 scroll-mt-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">SaaS Tiers & Pricing Retainers</h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto text-xs sm:text-sm">
            Empower your CA practitioners with high-speed filing pipelines. Try any plan free for 14 days.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 flex items-center justify-center space-x-3">
            <span className={`text-xs font-semibold ${billingCycle === "monthly" ? "text-white" : "text-slate-500"}`}>
              Billed Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")}
              className="w-10 h-6 bg-primary/20 border border-primary/40 rounded-full p-0.5 flex items-center transition-all cursor-pointer focus:outline-none"
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-primary transition-all shadow-md ${
                  billingCycle === "annually" ? "translate-x-4" : ""
                }`}
              ></div>
            </button>
            <span className={`text-xs font-semibold flex items-center ${billingCycle === "annually" ? "text-white" : "text-slate-500"}`}>
              Billed Annually
              <span className="ml-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((p, i) => {
            const price = billingCycle === "annually" ? p.priceAnnually : p.priceMonthly;
            return (
              <div
                key={i}
                className={`rounded-2xl p-8 flex flex-col justify-between border relative transition-all duration-300 ${
                  p.popular
                    ? "bg-gradient-to-b from-[#111827] to-[#030712] border-primary shadow-xl shadow-primary/5"
                    : "bg-white/5 border-white/10"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 right-8 bg-primary text-primary-foreground font-semibold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                    Recommended
                  </span>
                )}
                <div>
                  <h3 className="text-base font-bold text-white">{p.name}</h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed min-h-[40px]">{p.desc}</p>
                  <div className="mt-6 flex items-baseline">
                    <span className="text-4xl font-extrabold text-white">
                      {p.priceMonthly === 12999 && price === 9999 ? "Custom" : `₹${price.toLocaleString("en-IN")}`}
                    </span>
                    {!(p.priceMonthly === 12999 && price === 9999) && (
                      <span className="ml-1 text-sm text-slate-400">/month</span>
                    )}
                  </div>
                  <ul className="mt-8 space-y-3.5 border-t border-white/5 pt-8">
                    {p.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-500 mr-2.5 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8">
                  <Link
                    href="/register"
                    className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center transition-all duration-200 cursor-pointer ${
                      p.popular
                        ? "bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/20"
                        : "bg-white/10 hover:bg-white/15 text-white border border-white/10"
                    }`}
                  >
                    {p.buttonText}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-xs text-slate-500">
        <p>© 2026 AethelGard SaaS Technologies Private Limited. All Rights Reserved.</p>
        <div className="mt-3.5 space-x-4">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <span>•</span>
          <a href="#" className="hover:text-white transition-colors">Contact Support</a>
        </div>
      </footer>
      
    </div>
  );
}
