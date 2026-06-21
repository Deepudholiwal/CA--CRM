"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { FileText, Cpu, AlertCircle, Calendar, Send, Sparkles, Loader2, Check } from "lucide-react";
import { useDatabase } from "../../context/DatabaseContext";

export default function AINoticeAnalyzer() {
  const { activeBranch, clients, notices, resolveNotice } = useDatabase();
  const [noticeText, setNoticeText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [saved, setSaved] = useState(false);

  const sampleNoticeText = `INCOME TAX DEPARTMENT
Office of the Assistant Commissioner of Income Tax, Circle 4(1), New Delhi.
Notice under Section 143(1) of the Income Tax Act, 1961.
PAN: AABCA1234F
Assessment Year: 2025-26
Sub: Discrepancy in Tax Return - Mismatch in Income from Other Sources.
This is to inform you that upon processing of your return of income for the Assessment Year 2025-26, it is observed that Interest Income from Fixed Deposits amounting to Rs. 65,450 reported in Form 26AS/AIS has not been disclosed in the income schedules.
Differential tax payable of Rs. 12,450 plus interest under Sec 234B is computed. 
You are hereby required to file a correction return or submit clarification explanation on or before 15th July 2026. Failure to do so will result in formal demand order.`;

  const handleAnalyze = () => {
    if (!noticeText || !selectedClient) return;
    setAnalyzing(true);
    setResult(null);
    setSaved(false);

    // Simulate AI notice scanning
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        issuingAuthority: noticeText.includes("GST") ? "GST AUTHORITY" : "INCOME TAX DEPARTMENT",
        noticeSection: noticeText.includes("GST") ? "Section 61 (ASMT-10)" : "Section 143(1) Adjustment",
        noticeNumber: `DIN/2026/IT-${Math.floor(100000 + Math.random() * 900000)}`,
        discrepancyAmount: noticeText.includes("GST") ? 142000 : 12450,
        discrepancyDetails: noticeText.includes("GST") 
          ? "Input Tax Credit claimed in GSTR-3B exceeds details uploaded by suppliers in GSTR-1 (GSTR-2B mismatch)." 
          : "Fixed Deposit Interest of Rs. 65,450 disclosed in AIS but omitted from income returns.",
        dueDate: "2026-07-15",
        riskLevel: noticeText.includes("GST") ? "HIGH" : "MEDIUM",
        aiSopSuggestions: [
          "Cross-verify bank reconciliation interest certificates with TDS certificates (Form 16A).",
          "File revised return under Section 139(5) declaring the omitted interest income to avoid further scrutiny.",
          "Pay the tax demand of Rs. 12,450 under Challan 280 (Self-Assessment tax) to stop interest accumulation."
        ],
        draftResponse: `To,\nThe Assistant Commissioner of Income Tax,\nCircle 4(1), New Delhi.\n\nSubject: Response to Notice under Section 143(1) for AY 2025-26 - PAN: AABCA1234F\n\nRespected Sir/Madam,\nWith reference to notice number DIN/2026/IT-XXXX, we hereby submit that the interest income mismatch of Rs. 65,450 was due to clerical omission of savings bank interest. We have accepted the discrepancy and filed a revised return under Section 139(5) on 22nd June 2026, paying the differential tax of Rs. 12,450. Copy of Challan is attached for your kind records. We request you to withdraw the demand calculation.\n\nYours faithfully,\nFor Acme Tech Solutions Private Limited`
      });
    }, 2000);
  };

  const handleSaveToNotices = () => {
    if (!result) return;
    setSaved(true);
    // In real app, we would add this notice to database state
  };

  return (
    <Card className="border border-border/80 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center text-primary">
          <Cpu className="w-5 h-5 mr-2 text-primary" /> AI-Powered Notice Analyzer
        </CardTitle>
        <CardDescription>
          Paste official communication text (Income Tax, GST, MCA) to extract compliance terms and draft legal replies.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Configuration inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Select Client</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full text-xs p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">-- Choose Client --</option>
              {clients
                .filter((c) => activeBranch === "all" || c.branchId === activeBranch)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.clientId})
                  </option>
                ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setNoticeText(sampleNoticeText);
                setSelectedClient("cli-1"); // Acme Tech
              }}
              className="text-[10px] font-semibold text-primary hover:bg-primary/10 border border-primary/20 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Load Sample Income Tax Notice
            </button>
          </div>
        </div>

        {/* Input Text Box */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">Paste Notice Text</label>
          <textarea
            rows={6}
            placeholder="Paste raw text copied from GST Portal, Income Tax PDF notice..."
            value={noticeText}
            onChange={(e) => setNoticeText(e.target.value)}
            className="w-full text-xs font-mono p-3 bg-muted/20 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleAnalyze}
          disabled={analyzing || !noticeText || !selectedClient}
          className="w-full py-2 bg-primary hover:bg-primary/95 text-white font-semibold text-xs rounded-lg flex items-center justify-center transition-all disabled:opacity-50 cursor-pointer"
        >
          {analyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing notice structures...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" /> Run AI Parser Scan
            </>
          )}
        </button>

        {/* Results display */}
        {result && (
          <div className="mt-6 border-t border-border/60 pt-6 space-y-4 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/20 p-3 rounded-lg border border-border/40">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-foreground">{result.noticeSection}</span>
                <span className="text-xs text-muted-foreground">({result.noticeNumber})</span>
              </div>
              <div className="flex space-x-2">
                <Badge variant={result.riskLevel === "HIGH" ? "destructive" : "warning"}>
                  {result.riskLevel} RISK
                </Badge>
                <Badge variant="secondary">{result.issuingAuthority}</Badge>
              </div>
            </div>

            {/* Mismatch & due date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                <div className="flex items-center text-xs font-semibold text-red-600 dark:text-red-400 mb-1">
                  <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                  Tax Discrepancy Value
                </div>
                <div className="text-xl font-bold text-red-600 dark:text-red-400">
                  ₹{result.discrepancyAmount.toLocaleString("en-IN")}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 leading-snug">{result.discrepancyDetails}</p>
              </div>

              <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg">
                <div className="flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
                  <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                  Response Due Date
                </div>
                <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
                  {new Date(result.dueDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 leading-snug">Ensure filing response in portal 3 days prior to prevent penalties.</p>
              </div>
            </div>

            {/* Suggestions */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">AI Mitigation Steps</h4>
              <ul className="space-y-1 text-xs text-foreground/90">
                {result.aiSopSuggestions.map((step: string, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-primary font-bold mr-2">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Draft Reply */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">AI Generated Response Draft</h4>
                <button
                  onClick={() => navigator.clipboard.writeText(result.draftResponse)}
                  className="text-[10px] font-semibold text-primary hover:underline"
                >
                  Copy Draft Text
                </button>
              </div>
              <pre className="p-3.5 bg-muted/40 text-[10px] leading-relaxed font-mono rounded-lg border border-border/40 whitespace-pre-wrap max-h-40 overflow-y-auto">
                {result.draftResponse}
              </pre>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleSaveToNotices}
                disabled={saved}
                className={`px-4 py-1.5 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer ${
                  saved
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-primary text-primary-foreground border-primary hover:bg-primary/90 shadow-sm"
                }`}
              >
                {saved ? (
                  <span className="flex items-center">
                    <Check className="w-3.5 h-3.5 mr-1" /> Logged to Notice Tracker
                  </span>
                ) : (
                  "Create Notice & Assign Task"
                )}
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
