import type { Metadata } from "next";
import { inter, merriweather } from "./fonts";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Link from "next/link";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-blue-50`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Navbar */}
          <nav className="bg-[#102a43] border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">
                Gunaaso<span className="text-blue-400">Nepal</span>
              </h1>

              <div className="flex gap-6 text-sm font-medium">
                <Link href="/" className="text-white hover:text-blue-300">Home</Link>
                <Link href="/complaint" className="text-white hover:text-blue-300">File Complaint</Link>
                <Link href="/track" className="text-white hover:text-blue-300">Track</Link>
                <Link href="/dashboard" className="text-white hover:text-blue-300">Dashboard</Link>
                <Link href="/auth/login" className="text-white hover:text-blue-300 text-sm font-medium">Login</Link>
              </div>
            </div>
          </nav>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
