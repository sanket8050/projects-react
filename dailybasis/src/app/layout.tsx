import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daily Basis - Mess Management",
  description: "A simple mess management system for tracking daily attendance and meals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Run as early as possible so any extension-injected CSS custom properties
            on <html> are removed before React hydrates. This reduces hydration
            mismatch noise during development. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{(function(){var d=document.documentElement;d.style.removeProperty('--vsc-domain');if(d.getAttribute('style')==='')d.removeAttribute('style');})();}catch(e){};`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
