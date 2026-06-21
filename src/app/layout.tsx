import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import { DatabaseProvider } from "../context/DatabaseContext";
import Shell from "../components/layout/Shell";

export const metadata: Metadata = {
  title: "AethelGard - Enterprise CA CRM & Compliance SaaS",
  description: "Production-ready, multi-tenant compliance CRM for Chartered Accountants, Tax Consultants, and Accounting Firms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Modern font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          body {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
          }
        `}</style>
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <DatabaseProvider>
            <Shell>{children}</Shell>
          </DatabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
