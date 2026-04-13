import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { BottomNav } from "@/components/bottom-nav";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "No Beta",
  description: "find your own way up",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-dvh`}
    >
      <body className="flex min-h-dvh flex-col bg-[#f5f4f0] font-sans antialiased text-[#1a1a1a]">
        {/* 预留底栏高度：图标+双行文案+安全区（约 5.5rem + safe-area） */}
        <div className="flex min-h-0 flex-1 flex-col pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))]">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
