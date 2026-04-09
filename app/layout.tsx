import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "ComplAI — EU AI Act Compliance Tool",
  description:
    "Assess your AI project against the EU AI Act. Instantly discover your risk level, compliance gaps, and recommended actions.",
  keywords: ["EU AI Act", "AI compliance", "AI risk", "GPAI", "high risk AI", "startup compliance"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <Header />
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
