import type { Metadata } from "next";
import { Barlow, Prompt, Urbanist } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";
import Navbar from "@/components/Navbar";
import ChatPanel from "@/components/ChatPanel";
import { getSession } from "@/lib/session";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  display: "swap",
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ProRaider - Guías de ARC Raiders",
  description: "Meta, builds y guías actualizadas de ARC Raiders",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession()

  return (
    <html
      lang="es"
      className={`${urbanist.variable} ${barlow.variable} ${prompt.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex bg-transparent text-[var(--app-text)]">
        <Navbar />
        <main className="flex flex-1 flex-col pl-16">
          {children}
        </main>
        {session && <ChatPanel session={session} />}
      </body>
    </html>
  );
}
