"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  CheckCircle2,
  Clock,
  Search,
} from "lucide-react";

/* ================= DASHBOARD ================= */

import { ProfileDropdown } from "@/components/profile-dropdown";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-[#f5f6f8]">
      {/* ================= Sidebar ================= */}
      <aside className="w-64 bg-[#1f2933] text-gray-200 p-6 flex flex-col">
        <h1 className="mb-10 text-2xl font-semibold text-white">
          Gunaaso<span className="text-[#7aa2ff]">Nepal</span>
        </h1>

        <nav className="flex flex-col gap-4 text-sm">
          <Link href="/dashboard" className="hover:text-white">
            Dashboard
          </Link>
          <Link href="/complaint" className="hover:text-white">
            File a Complaint
          </Link>
          <Link href="/track" className="hover:text-white">
            Track Complaint
          </Link>
          <a href="#complaints-list" className="hover:text-white">
            Complaints List
          </a>
        </nav>

        <div className="mt-auto text-xs text-gray-400">
          © 2025 GunaasoNepal
        </div>
      </aside>

      {/* ================= Main ================= */}
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-semibold text-gray-800">
            Dashboard Overview
          </h2>
          <ProfileDropdown />
        </div>

        {/* ================= Stats ================= */}
        <div className="grid gap-6 md:grid-cols-4 mb-12">
          {stats.map((item) => (
            <div
              key={item.title}
              className="rounded-xl bg-white p-6 border border-gray-200 shadow-sm"
            >
              <div className="mb-3">{item.icon}</div>
              <p className="text-sm text-gray-500">{item.title}</p>
              <p className="text-2xl font-semibold text-gray-800">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* ================= Quick Actions ================= */}
        <div className="mb-14">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">
            Quick Actions
          </h3>

          <div className="flex gap-4">
            <button
              onClick={() => {
                router.push("/complaint");
                router.refresh();
              }}
              className="rounded-xl bg-[#4366d0] px-8 py-4 text-lg font-semibold text-white hover:bg-[#1e40af] transition-all w-64"
            >
              File a Complaint
            </button>

            <button
              onClick={() => {
                router.push("/track");
                router.refresh();
              }}
              className="rounded-xl px-8 py-4 text-lg font-semibold border border-black text-black hover:bg-[#1e40af] hover:text-white transition-all w-64"
            >
              Track Complaint
            </button>
          </div>
        </div>

        {/* ================= Recent Complaints ================= */}

        {/* ================= Tasks Section ================= */}
        <div id="complaints-list">
          <h3 className="text-xl font-semibold text-gray-800 mb-1">
            Complaints List
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Here's a list of your complaints for this month.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <input
              placeholder="Filter complaints..."
              className="h-10 w-64 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4366d0]"
            />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">Complaints</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Priority</th>
                </tr>
              </thead>

              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-mono text-xs">
                      {task.id}
                    </td>
                    <td className="px-4 py-3">
                      <span className="mr-2 rounded-full border px-2 py-0.5 text-xs">
                        {task.type}
                      </span>
                      {task.title}
                    </td>
                    <td className="px-4 py-3">
                      <TaskStatus status={task.status} />
                    </td>
                    <td className="px-4 py-3">{task.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ================= Components ================= */

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Resolved: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    "In Review": "bg-purple-100 text-purple-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        map[status] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

function TaskStatus({ status }: { status: string }) {
  const map: Record<string, string> = {
    "In Progress": "text-blue-600",
    Backlog: "text-gray-500",
    Todo: "text-yellow-600",
    Done: "text-green-600",
    Canceled: "text-red-600",
  };

  return (
    <span className={`font-medium ${map[status]}`}>
      {status}
    </span>
  );
}

/* ================= Data ================= */

const stats = [
  {
    title: "Total Complaints",
    value: "1,245",
    icon: <FileText className="h-7 w-7 text-blue-700" />,
  },
  {
    title: "Resolved",
    value: "830",
    icon: <CheckCircle2 className="h-7 w-7 text-green-600" />,
  },
  {
    title: "Pending",
    value: "415",
    icon: <Clock className="h-7 w-7 text-yellow-500" />,
  },
  {
    title: "In Review",
    value: "50",
    icon: <Search className="h-7 w-7 text-purple-600" />,
  },
];

const recentComplaints = [
  {
    id: "C1021",
    category: "Corruption",
    status: "Pending",
    user: "Anonymous",
    date: "2025-12-18",
  },
  {
    id: "C1022",
    category: "Infrastructure",
    status: "Resolved",
    user: "Ram K.",
    date: "2025-12-17",
  },
  {
    id: "C1023",
    category: "Health Services",
    status: "In Review",
    user: "Sita P.",
    date: "2025-12-16",
  },
];

const tasks = [
  {
    id: "TASK-8782",
    type: "Documentation",
    title: "You can't compress the program without quantifying the SSD",
    status: "In Progress",
    priority: "High",
  },
  {
    id: "TASK-7878",
    type: "Documentation",
    title: "Try to calculate the EXE feed",
    status: "Backlog",
    priority: "Medium",
  },
  {
    id: "TASK-7839",
    type: "Bug",
    title: "We need to bypass the neural TCP card!",
    status: "Todo",
    priority: "High",
  },
  {
    id: "TASK-5562",
    type: "Feature",
    title: "The SAS interface is down",
    status: "Backlog",
    priority: "Medium",
  },
  {
    id: "TASK-1280",
    type: "Bug",
    title: "Use the digital TLS panel",
    status: "Done",
    priority: "High",
  },
];
