import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/header/Header";
import { ThemeProvider } from "@/components/theme-provider/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { Web3Provider } from "@/components/web3-provider/Web3Provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Bitcoin Rune Etcher",
  description: "Etch runes on the Bitcoin blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark:bg-neutral-900 bg-zinc-50`}
      >
        <Web3Provider>
          <Header />
          {children}
          <Toaster />
        </Web3Provider>
      </body>
    </html>
  );
}
