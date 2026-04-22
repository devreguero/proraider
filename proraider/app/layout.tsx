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
  metadataBase: new URL('https://proraider.vercel.app'),
  title: {
    default: 'ProRaider - Guías de ARC Raiders',
    template: '%s | ProRaider',
  },
  description: 'Meta, builds y guías actualizadas de ARC Raiders. Encuentra las mejores estrategias, armas y builds para dominar ARC Raiders.',
  keywords: ['ARC Raiders', 'guías ARC Raiders', 'builds ARC Raiders', 'meta ARC Raiders', 'armas ARC Raiders', 'estrategias ARC Raiders'],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://proraider.vercel.app',
    siteName: 'ProRaider',
    title: 'ProRaider - Guías de ARC Raiders',
    description: 'Meta, builds y guías actualizadas de ARC Raiders. Encuentra las mejores estrategias, armas y builds para dominar ARC Raiders.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProRaider - Guías de ARC Raiders',
    description: 'Meta, builds y guías actualizadas de ARC Raiders.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://proraider.vercel.app' },
  verification: { google: 'TWo2MtHKyoAhEdGuehADLLh_khYV7aFmII_7e6e0BFc' },
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
