import type { Metadata } from "next";

import "@/styles/globals.css";

import { Analytics } from "@vercel/analytics/react";
import { Inter as FontSans } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';

import { Sidebar } from "@/components/Layout/Sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/toaster";

import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Crocosoft Internal Tools",
  description: "Crocosoft Internal Tools",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <NextTopLoader />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen relative">
            <Sidebar />
            <div className="flex-1">
              <main className="flex-1 p-4 md:p-6 lg:p-8">
                {children}
                <Analytics />
              </main>
              <div className="fixed bottom-4 right-4">
                <ThemeToggle />
              </div>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
