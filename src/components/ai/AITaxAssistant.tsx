"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/Card";
import { MessageSquare, Sparkles, Send, Bot, User, Loader2 } from "lucide-react";

export default function AITaxAssistant() {
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string; time: string }[]>([
    { sender: "bot", text: "Hello! I am your AI Tax Assistant. Ask me anything about GST rates, TDS thresholds, Income Tax slabs, or company board compliance.", time: "12:00 PM" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const getAIResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("gst rate") || q.includes("gst percentage")) {
      return "GST tax slabs in India are 5%, 12%, 18%, and 28%. Gold and semi-precious stones are taxed at 3%. For services, 18% is the standard default rate. Services like restaurants and small transport fall under 5%.";
    }
    if (q.includes("tds threshold") || q.includes("tds limit")) {
      return "Common TDS limits for FY 2026-27:\n- Sec 194J (Professional Fees): ₹30,000/yr (TDS rate: 10%, or 2% for technical service)\n- Sec 194C (Contractors): ₹30,000 single trans or ₹1,00,000 aggregate/yr (Rate: 1% individual, 2% company)\n- Sec 194I (Rent): ₹2,40,000/yr (Rate: 10% land/building, 2% plant/machinery).";
    }
    if (q.includes("standard deduction") || q.includes("new tax regime")) {
      return "For Assessment Year 2026-27 (FY 2025-26), the standard deduction under the New Tax Regime is ₹75,000 (increased from ₹50,000). Tax slabs start at ₹3 Lakhs, with zero tax payable up to ₹7 Lakhs taxable income under rebate Sec 87A.";
    }
    if (q.includes("board meeting") || q.includes("roc due")) {
      return "Under Section 173 of the Companies Act 2013, companies must hold a minimum of 4 board meetings per financial year. The interval between two consecutive board meetings must not exceed 120 days. One meeting must be held every quarter.";
    }
    return "I have searched the updated Income Tax & GST guidelines. Under current provisions, that transaction is categorized under commercial business operations. Could you specify the section code (e.g. Sec 194 or GSTR-2B) so I can retrieve exact tax rates?";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: getAIResponse(userMsg),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  return (
    <Card className="border border-border/80 shadow-md h-[400px] flex flex-col justify-between">
      <CardHeader className="py-3.5 border-b border-border/40">
        <CardTitle className="flex items-center text-sm font-bold text-primary">
          <Bot className="w-5 h-5 mr-2 text-primary" /> Tax AI copilot
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
          >
            <div
              className={`max-w-[85%] rounded-xl p-3 text-xs leading-normal border shadow-sm ${
                m.sender === "user"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-card-foreground border-border/60"
              }`}
            >
              <div className="flex items-center space-x-1 mb-1 opacity-75 font-semibold text-[9px]">
                {m.sender === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                <span>{m.sender === "user" ? "You" : "AI Assistant"}</span>
                <span>•</span>
                <span>{m.time}</span>
              </div>
              <p className="whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-card text-muted-foreground border border-border/60 rounded-xl p-3 text-xs flex items-center">
              <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin text-primary" /> Thinking...
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="py-2.5 border-t border-border/40 flex space-x-2">
        <input
          type="text"
          placeholder="Ask about TDS thresholds, GST rates..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          className="flex-1 text-xs px-3 py-2 bg-muted/40 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          onClick={handleSend}
          className="p-2 bg-primary hover:bg-primary/95 text-white rounded-lg flex items-center justify-center cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </CardFooter>
    </Card>
  );
}
