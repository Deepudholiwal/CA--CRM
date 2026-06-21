"use client";

import React, { useState } from "react";
import { useDatabase, ROLE_PERMISSIONS } from "../../context/DatabaseContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/Table";
import {
  Settings as SettingsIcon,
  Building,
  Shield,
  Bell,
  Lock,
  CheckCircle,
  FileCheck,
  Save,
  Palette
} from "lucide-react";

export default function SettingsPage() {
  const { tenant, setTenant, branches } = useDatabase();
  const [firmName, setFirmName] = useState(tenant.name);
  const [selectedPlan, setSelectedPlan] = useState(tenant.plan);
  const [brandingColor, setBrandingColor] = useState(tenant.brandingColor);
  const [saved, setSaved] = useState(false);

  // Settings Toggles State
  const [waAlerts, setWaAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [ipRestriction, setIpRestriction] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setTenant({
      name: firmName,
      slug: firmName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      plan: selectedPlan,
      status: tenant.status,
      brandingColor
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center">
          <SettingsIcon className="w-6 h-6 mr-2 text-primary animate-spin" /> Workspace Configurations & Settings
        </h2>
        <p className="text-xs text-muted-foreground">
          Update practice firm profiles, manage regional branch identifiers, toggle auto reminders, and audit RBAC system access control lists.
        </p>
      </div>

      {/* Settings Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left panel: Firm profile form & Branch registry */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile Form */}
          <Card>
            <CardHeader className="pb-2 border-b border-border/40 mb-4">
              <CardTitle className="text-sm font-bold flex items-center"><Building className="w-4.5 h-4.5 mr-2 text-primary" /> Practice Profile & SaaS Subscriptions</CardTitle>
              <CardDescription>Configure firm details and branding style tokens.</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <form onSubmit={handleSaveProfile} className="space-y-4">
                {saved && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-semibold">
                    ✔ Firm settings updated successfully!
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Corporate Firm Name</label>
                    <input
                      type="text"
                      required
                      value={firmName}
                      onChange={(e) => setFirmName(e.target.value)}
                      className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary bg-card"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">SaaS Tier Plan</label>
                    <select
                      value={selectedPlan}
                      onChange={(e) => setSelectedPlan(e.target.value as any)}
                      className="w-full text-xs p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="STARTER">Starter Workspace</option>
                      <option value="PROFESSIONAL">Professional Retainer</option>
                      <option value="ENTERPRISE">Enterprise Multi-tenant</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">HSL Brand Accent</label>
                    <select
                      value={brandingColor}
                      onChange={(e) => setBrandingColor(e.target.value)}
                      className="w-full text-xs p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="indigo">Vibrant Indigo</option>
                      <option value="emerald">Emerald Teal</option>
                      <option value="sky">Ocean Sky</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary hover:bg-primary/95 text-white font-semibold text-xs rounded-lg flex items-center justify-center cursor-pointer shadow-sm"
                    >
                      <Save className="w-4 h-4 mr-1.5" /> Save Workspace Settings
                    </button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Regional Branch list */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold">Regional Hub Branches</CardTitle>
              <CardDescription>Audited branch office codes, GSTIN locations, and addresses.</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Branch Name</TableHead>
                    <TableHead>Branch Code</TableHead>
                    <TableHead>State / City</TableHead>
                    <TableHead>GSTIN reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branches.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-semibold text-xs">{b.name}</TableCell>
                      <TableCell className="text-xs font-mono text-primary font-bold">{b.code}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{b.city}, {b.state}</TableCell>
                      <TableCell className="text-xs font-mono">{b.gstin}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </div>

        {/* Right panel: Alerts settings & RBAC summary info */}
        <div className="space-y-6">
          
          {/* Notifications toggles */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center text-primary"><Bell className="w-4.5 h-4.5 mr-2" /> Auto Reminders Settings</CardTitle>
              <CardDescription>Dispatch events configuration controls.</CardDescription>
            </CardHeader>
            <CardContent className="pt-2 text-xs space-y-3">
              <div className="flex items-center justify-between p-2.5 bg-muted/20 border border-border/40 rounded-lg">
                <span className="font-semibold">WhatsApp Due Alert campaigns</span>
                <input
                  type="checkbox"
                  checked={waAlerts}
                  onChange={(e) => setWaAlerts(e.target.checked)}
                  className="w-4 h-4 text-primary bg-slate-900 border-slate-800 rounded focus:ring-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 bg-muted/20 border border-border/40 rounded-lg">
                <span className="font-semibold">Email PDF Retainers challans</span>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 text-primary bg-slate-900 border-slate-800 rounded focus:ring-primary cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Profiles toggles */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center text-primary"><Lock className="w-4.5 h-4.5 mr-2" /> Security profile & MFA</CardTitle>
              <CardDescription>Enforce corporate login security controls.</CardDescription>
            </CardHeader>
            <CardContent className="pt-2 text-xs space-y-3">
              <div className="flex items-center justify-between p-2.5 bg-muted/20 border border-border/40 rounded-lg">
                <span className="font-semibold">Enforce MFA (Google Auth)</span>
                <input
                  type="checkbox"
                  checked={twoFactor}
                  onChange={(e) => setTwoFactor(e.target.checked)}
                  className="w-4 h-4 text-primary bg-slate-900 border-slate-800 rounded focus:ring-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 bg-muted/20 border border-border/40 rounded-lg">
                <span className="font-semibold">Restrict IP logins (Delhi HQ only)</span>
                <input
                  type="checkbox"
                  checked={ipRestriction}
                  onChange={(e) => setIpRestriction(e.target.checked)}
                  className="w-4 h-4 text-primary bg-slate-900 border-slate-800 rounded focus:ring-primary cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

      {/* RBAC permissions audit table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center text-primary"><Shield className="w-4.5 h-4.5 mr-2" /> RBAC Permission Scope Audits</CardTitle>
          <CardDescription>Audited access control matrix mapped dynamically across all 7 user profiles.</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Role Profile</TableHead>
                <TableHead>Permissions Array Key</TableHead>
                <TableHead>Description profile scope</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROLE_PERMISSIONS.map((rp, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-bold text-xs text-foreground">{rp.role}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded border border-border/40 text-primary">
                      {rp.permissions.join(", ")}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{rp.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
