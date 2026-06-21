"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Cpu, Zap, Plus, Settings, Play, ArrowRight, ToggleLeft, ToggleRight, Sparkles } from "lucide-react";

interface WorkflowRule {
  id: string;
  name: string;
  triggerName: string;
  condition: string;
  actionType: string;
  actionDetails: string;
  isActive: boolean;
}

export default function WorkflowEngine() {
  const [rules, setRules] = useState<WorkflowRule[]>([
    {
      id: "wf-1",
      name: "GST Onboarding Checklist Generation",
      triggerName: "New Client Created",
      condition: "Client Category = 'PLATINUM' or 'GOLD'",
      actionType: "CREATE_TASK",
      actionDetails: "Assign GSTR-2B ITC Scrutiny Task to GST Specialist Sunita Rao",
      isActive: true
    },
    {
      id: "wf-2",
      name: "Late GST Filing WhatsApp Warning",
      triggerName: "Filing Status = OVERDUE",
      condition: "Filing Type = 'GSTR-3B'",
      actionType: "SEND_WHATSAPP",
      actionDetails: "Send GSTR-3B Late Warning Template with dynamic due date parameter",
      isActive: true
    },
    {
      id: "wf-3",
      name: "High Severity Notice Partner Escalation",
      triggerName: "Notice Received",
      condition: "Severity = 'HIGH'",
      actionType: "ESCALATE",
      actionDetails: "Assign Notice response task to CA Partner Deepak Yadav & send SMS alert",
      isActive: true
    },
    {
      id: "wf-4",
      name: "Auto Invoice Reminders",
      triggerName: "Invoice Unpaid 3 Days Before Due",
      condition: "Outstanding Balance > ₹5,000",
      actionType: "SEND_WHATSAPP",
      actionDetails: "Send payment link template with unpaid balance amount",
      isActive: false
    }
  ]);

  const [showAddRule, setShowAddRule] = useState(false);
  const [name, setName] = useState("");
  const [triggerName, setTriggerName] = useState("New Client Onboarded");
  const [condition, setCondition] = useState("Category = 'GST'");
  const [actionType, setActionType] = useState("CREATE_TASK");
  const [actionDetails, setActionDetails] = useState("");

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !actionDetails) return;

    const newRule: WorkflowRule = {
      id: `wf-${Date.now()}`,
      name,
      triggerName,
      condition,
      actionType,
      actionDetails,
      isActive: true
    };

    setRules((prev) => [...prev, newRule]);
    setName("");
    setActionDetails("");
    setShowAddRule(false);
  };

  return (
    <Card className="border border-border/80 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
        <div>
          <CardTitle className="flex items-center text-primary">
            <Cpu className="w-5 h-5 mr-2 text-primary animate-pulse" /> Automation engine
          </CardTitle>
          <CardDescription>
            Configure triggers, conditions, and actions to streamline CA firm operations.
          </CardDescription>
        </div>
        <button
          onClick={() => setShowAddRule(true)}
          className="bg-primary hover:bg-primary/95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1" /> New Rule
        </button>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        
        {/* Rules Grid */}
        <div className="grid grid-cols-1 gap-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                rule.isActive
                  ? "bg-primary/5 border-primary/20 shadow-sm"
                  : "bg-muted/10 border-border/60 opacity-70"
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2">
                  <Zap className={`w-4 h-4 ${rule.isActive ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
                  <span className="font-bold text-xs text-foreground">{rule.name}</span>
                  <Badge variant={rule.isActive ? "success" : "secondary"}>
                    {rule.isActive ? "ACTIVE" : "DISABLED"}
                  </Badge>
                </div>

                {/* Flow steps */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground pt-1">
                  <span className="font-semibold text-slate-500 uppercase">Trigger:</span>
                  <span className="bg-card px-2 py-0.5 rounded border border-border/40 text-foreground font-medium">{rule.triggerName}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="font-semibold text-slate-500 uppercase">Condition:</span>
                  <span className="bg-card px-2 py-0.5 rounded border border-border/40 text-foreground font-medium">{rule.condition}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="font-semibold text-slate-500 uppercase">Action:</span>
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-semibold">{rule.actionType}</span>
                </div>

                <p className="text-[10px] text-muted-foreground mt-1 leading-snug italic">
                  "{rule.actionDetails}"
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-3 self-end md:self-center border-t md:border-t-0 border-border/20 pt-2.5 md:pt-0 w-full md:w-auto justify-end">
                <button
                  onClick={() => toggleRule(rule.id)}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title={rule.isActive ? "Deactivate Rule" : "Activate Rule"}
                >
                  {rule.isActive ? (
                    <ToggleRight className="w-8 h-8 text-primary" />
                  ) : (
                    <ToggleLeft className="w-8 h-8" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Rule Dialog */}
        {showAddRule && (
          <div className="mt-6 border-t border-border/60 pt-6 animate-fade-in">
            <h4 className="font-bold text-xs text-foreground uppercase tracking-wider mb-4 flex items-center">
              <Settings className="w-4 h-4 mr-1.5 text-primary" /> Workflow Automation Builder
            </h4>
            
            <form onSubmit={handleAddRule} className="space-y-4 bg-muted/20 p-4 rounded-xl border border-border/40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Rule Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Auto GSTR-1 Request Document Task"
                    className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary bg-card"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Trigger Event</label>
                  <select
                    value={triggerName}
                    onChange={(e) => setTriggerName(e.target.value)}
                    className="w-full text-xs p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="New Client Onboarded">New Client Onboarded</option>
                    <option value="Filing Status Overdue">Filing Status Overdue</option>
                    <option value="Invoice Unpaid 3 Days">Invoice Unpaid 3 Days Before Due</option>
                    <option value="Notice Received">Tax Scrutiny Notice Received</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Filter Conditions</label>
                  <input
                    type="text"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    placeholder="Category = 'GST' and BusinessType = 'PRIVATE_LIMITED'"
                    className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary bg-card"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Action Type</label>
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value)}
                    className="w-full text-xs p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="CREATE_TASK">CREATE_TASK (Generate Checklist)</option>
                    <option value="SEND_WHATSAPP">SEND_WHATSAPP (Send SMS Alert)</option>
                    <option value="SEND_EMAIL">SEND_EMAIL (Dispatched Email Template)</option>
                    <option value="ESCALATE">ESCALATE (Escalate noticed tasks to Partner)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Action Execution Parameters</label>
                <input
                  type="text"
                  required
                  value={actionDetails}
                  onChange={(e) => setActionDetails(e.target.value)}
                  placeholder="Assign task: 'Request Bank Statements for GSTR-1 Filing' to DEO Vikram"
                  className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary bg-card"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRule(false)}
                  className="px-3 py-1.5 border border-border/60 text-muted-foreground text-xs font-semibold rounded-lg hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-lg flex items-center cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> Compile Rule
                </button>
              </div>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
