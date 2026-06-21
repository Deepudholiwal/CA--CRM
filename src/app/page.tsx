"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Check, Shield, Users, Calendar, MessageSquare, Zap, BarChart } from "lucide-react";

export default function LandingPage() {
  const plans = [
    {
      name: "Starter",
      price: "₹2,499",
      period: "/month",
      desc: "Perfect for sole proprietors and newly established GST practitioners.",
      features: [
        "Up to 100 Clients",
        "GST & Income Tax Filings",
        "Basic Task Management",
        "Document Storage (10 GB)",
        "WhatsApp Reminders (Standard)",
        "1 Branch Support",
      ],
      buttonText: "Start Free Trial",
      href: "/register?plan=starter",
      popular: false,
    },
    {
      name: "Professional",
      price: "₹6,999",
      period: "/month",
      desc: "For growing CA and tax firms handling corporate clients and audits.",
      features: [
        "Up to 1000 Clients",
        "GST, ITR, TDS & ROC Filing",
        "Advanced Kanban & Calendars",
        "Document Storage (100 GB)",
        "Auto-WhatsApp Campaigns",
        "AI Notice Analyzer (50/mo)",
        "E-Signatures & Partner approvals",
        "Up to 3 Branches Support",
      ],
      buttonText: "Get Started",
      href: "/register?plan=professional",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "For large corporate financial consulting firms with multiple regional hubs.",
      features: [
        "Unlimited Clients",
        "Full Compliance Suites",
        "Custom Workflow Automations",
        "Unlimited Storage",
        "Dedicated Server & DB",
        "Unlimited AI noticed analysis",
        "All Branches (Unlimited)",
        "API Integration & Webhooks",
        "24/7 SLA Partner Support",
      ],
      buttonText: "Contact Sales",
      href: "/register?plan=enterprise",
      popular: false,
    },
  ];

  return (
    <div className="bg-[#030712] text-white min-h-screen selection:bg-primary selection:text-white flex flex-col justify-between overflow-x-hidden">
      
      {/* Header Navigation */}
      <header className="max-w-7xl mx-auto w-full px-6 h-20 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-extrabold text-xl text-white">
            K
          </div>
          <span className="font-bold text-lg tracking-tight">AethelGard CA CRM</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Login
          </Link>
          <Link
            href="/register"
            className="text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg shadow transition-all duration-200"
          >
            Start Free Trial
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto w-full px-6 py-20 text-center flex flex-col items-center">
        <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 text-primary px-3.5 py-1 rounded-full text-xs font-semibold mb-6 animate-pulse">
          <span>🚀 Introducing AethelGard CRM 2.0</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          The ₹50 Lakh Enterprise Compliance & CRM SaaS for Modern CA Firms
        </h1>
        <p className="mt-6 text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Manage 10,000+ clients, automate WhatsApp due-date reminders, scan tax notices with AI, track e-signatures, and delegate audits across multiple branches in a unified portal.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-primary hover:bg-primary/95 text-white font-semibold text-sm flex items-center justify-center shadow-lg transition-all duration-200"
          >
            Launch Live Demo <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <a
            href="#pricing"
            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold text-sm flex items-center justify-center transition-all duration-200"
          >
            View Pricing plans
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto w-full px-6 py-16 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col items-start hover:border-primary/20 transition-all duration-300">
            <div className="p-3 bg-primary/10 rounded-xl text-primary mb-5">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Full RBAC & Compliance Suite</h3>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Separate dashboards for Partners, Managers, Tax Specialists, and Clients. Integrated GST, ITR, TDS, and ROC due-date monitors.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col items-start hover:border-primary/20 transition-all duration-300">
            <div className="p-3 bg-primary/10 rounded-xl text-primary mb-5">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">AI Notice Analyzer & OCR</h3>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Paste tax notice text or upload files to extract critical demand sums, section codes, response deadlines, and mitigation suggestions instantly.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col items-start hover:border-primary/20 transition-all duration-300">
            <div className="p-3 bg-primary/10 rounded-xl text-primary mb-5">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Meta WhatsApp Integration</h3>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Automated document requests, overdue billing reminders, and bulk campaign filings logs synced directly via the official WhatsApp Cloud API.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto w-full px-6 py-20 border-t border-white/5 scroll-mt-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">SaaS Tiers & Branch Pricing</h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto text-sm">
            Empower your CA practitioners with high-speed filing pipelines. Try any plan free for 14 days.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((p, i) => (
            <div
              key={i}
              className={`rounded-2xl p-8 flex flex-col justify-between border relative transition-all duration-300 ${
                p.popular
                  ? "bg-gradient-to-b from-[#111827] to-[#030712] border-primary shadow-xl shadow-primary/5"
                  : "bg-white/5 border-white/10"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 right-8 bg-primary text-primary-foreground font-semibold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <div>
                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed min-h-[40px]">{p.desc}</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">{p.price}</span>
                  <span className="ml-1 text-sm text-slate-400">{p.period}</span>
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
                  href="/login"
                  className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center transition-all duration-200 ${
                    p.popular
                      ? "bg-primary hover:bg-primary/95 text-white"
                      : "bg-white/10 hover:bg-white/15 text-white border border-white/10"
                  }`}
                >
                  {p.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500">
        <p>© 2026 AethelGard SaaS Technologies Private Limited. All Rights Reserved.</p>
        <div className="mt-2 space-x-4">
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
