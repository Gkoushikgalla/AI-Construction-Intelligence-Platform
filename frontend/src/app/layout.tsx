import "@/styles/globals.css";
import React from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

export const metadata = {
  title: "SiteMind AI — Construction Intelligence Platform",
  description: "AI-powered construction project monitoring, progress verification, risk detection, and truth layer management for Hyderabad & Telangana.",
  keywords: "construction intelligence, AI monitoring, progress verification, risk management, Hyderabad",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col" style={{ background: "var(--canvas)", color: "var(--ink)" }}>
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-5 md:p-7 overflow-y-auto max-w-[1400px] mx-auto w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
