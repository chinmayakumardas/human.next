

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Human.Next",
  description:
    "Self improvement and productivity app for personal growth and development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} min-h-screen font-sans antialiased`}
      >
        <Toaster richColors position="top-right" />
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}