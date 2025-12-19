"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      <header className="w-full bg-blue-900 text-white shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center py-5 px-6">
          <div className="text-2xl font-bold tracking-tight">Gunaaso<span className="text-blue-300">Nepal</span></div>
          <nav className="flex gap-8 text-lg">
            <Link href="/" className="hover:text-blue-200 font-semibold">Home</Link>
            <Link href="/dashboard" className="hover:text-blue-200">Dashboard</Link>
            <Link href="/complaint" className="hover:text-blue-200">File Complaint</Link>
            <Link href="/track" className="hover:text-blue-200">Track Complaint</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4 text-center">Welcome to GunaasoNepal</h1>
        <p className="text-lg md:text-xl text-blue-800 mb-8 text-center max-w-2xl">
          Your trusted platform for submitting, tracking, and resolving public complaints in Nepal. Empowering citizens and improving governance, one complaint at a time.
        </p>
        <div className="flex flex-wrap gap-6 justify-center">
          <Link href="/complaint" className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-4 rounded-xl shadow transition-all text-lg">File a Complaint</Link>
          <Link href="/track" className="bg-white border border-blue-700 text-blue-900 hover:bg-blue-50 font-semibold px-8 py-4 rounded-xl shadow transition-all text-lg">Track Complaint</Link>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3 w-full max-w-5xl">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-bold text-blue-900 mb-2">Easy Submission</h3>
            <p className="text-blue-800 text-center">Submit complaints online in a few simple steps, anytime and from anywhere in Nepal.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <div className="text-3xl mb-2">🔎</div>
            <h3 className="font-bold text-blue-900 mb-2">Transparent Tracking</h3>
            <p className="text-blue-800 text-center">Track the status of your complaints and get real-time updates on progress and resolution.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <div className="text-3xl mb-2">🤝</div>
            <h3 className="font-bold text-blue-900 mb-2">Accountability</h3>
            <p className="text-blue-800 text-center">Promoting accountability and better governance by connecting citizens and authorities.</p>
          </div>
        </div>
      </main>

      <footer className="w-full bg-blue-900 text-white text-center py-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 gap-4">
          <span>© {new Date().getFullYear()} GunaasoNepal. All Rights Reserved.</span>
          <span className="text-blue-200">Empowering Citizens, Improving Governance</span>
        </div>
      </footer>
    </div>
  );
}
