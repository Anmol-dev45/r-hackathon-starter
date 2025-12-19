"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FileText,
  CheckCircle2,
  Clock,
  Search,
  AlertCircle,
} from "lucide-react";

/* ================= DASHBOARD ================= */

import { ProfileDropdown } from "@/components/profile-dropdown";

interface Complaint {
  id: string;
  tracking_id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: number;
  created_at: string;
  updated_at: string;
  location_province: string | null;
  location_district: string | null;
  location_municipality: string | null;
  forwarded_to?: {
    office_id: string;
    office_name: string;
  };
}

interface Stats {
  total: number;
  resolved: number;
  pending: number;
  underReview: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    resolved: 0,
    pending: 0,
    underReview: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "status" | "category">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch user's complaints
  useEffect(() => {
    async function fetchComplaints() {
      try {
        setLoading(true);
        const response = await fetch("/api/complaints/my-complaints?limit=100");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch complaints");
        }

        if (data.success) {
          // Fetch forwarding information for each complaint
          const complaintsWithForwarding = await Promise.all(
            data.complaints.map(async (complaint: Complaint) => {
              try {
                const forwardingRes = await fetch(`/api/complaints/forwarding?complaint_id=${complaint.id}`);
                const forwardingData = await forwardingRes.json();

                if (forwardingData.success) {
                  return {
                    ...complaint,
                    forwarded_to: {
                      office_id: forwardingData.forwarding.office_id,
                      office_name: forwardingData.forwarding.office_name,
                    },
                  };
                }
                return complaint;
              } catch (err) {
                console.error('Error fetching forwarding info:', err);
                return complaint;
              }
            })
          );

          setComplaints(complaintsWithForwarding);

          // Calculate stats
          const total = data.complaints.length;
          const resolved = data.complaints.filter(
            (c: Complaint) => c.status === "resolved"
          ).length;
          const pending = data.complaints.filter(
            (c: Complaint) => c.status === "submitted" || c.status === "forwarded"
          ).length;
          const underReview = data.complaints.filter(
            (c: Complaint) => c.status === "under_review"
          ).length;

          setStats({ total, resolved, pending, underReview });
        }
      } catch (err) {
        console.error("Error fetching complaints:", err);
        setError(err instanceof Error ? err.message : "Failed to load complaints");
      } finally {
        setLoading(false);
      }
    }

    fetchComplaints();
  }, []);

  // Filter and sort complaints
  const filteredComplaints = complaints
    .filter((complaint) => {
      // Search filter
      const searchTerm = searchFilter.toLowerCase().trim();
      const matchesSearch = !searchTerm || (
        complaint.tracking_id.toLowerCase().includes(searchTerm) ||
        complaint.title.toLowerCase().includes(searchTerm) ||
        complaint.category.toLowerCase().includes(searchTerm) ||
        complaint.description.toLowerCase().includes(searchTerm) ||
        (complaint.location_district?.toLowerCase().includes(searchTerm)) ||
        (complaint.location_province?.toLowerCase().includes(searchTerm))
      );

      // Status filter
      const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Format category for display
  const formatCategory = (category: string) => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statsData = [
    {
      title: "Total Complaints",
      value: stats.total.toString(),
      icon: <FileText className="h-7 w-7 text-blue-700" />,
    },
    {
      title: "Resolved",
      value: stats.resolved.toString(),
      icon: <CheckCircle2 className="h-7 w-7 text-green-600" />,
    },
    {
      title: "Pending",
      value: stats.pending.toString(),
      icon: <Clock className="h-7 w-7 text-yellow-500" />,
    },
    {
      title: "In Review",
      value: stats.underReview.toString(),
      icon: <Search className="h-7 w-7 text-purple-600" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f5f6f8]">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1f2933] text-white rounded-lg shadow-lg touch-manipulation"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= Sidebar ================= */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#1f2933] text-gray-200 p-6 flex flex-col transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <h1 className="mb-10 text-xl sm:text-2xl font-semibold text-white">
          Gunaaso<span className="text-[#7aa2ff]">Nepal</span>
        </h1>

        <nav className="flex flex-col gap-4 text-sm">
          <Link href="/dashboard" className="hover:text-white" onClick={() => setSidebarOpen(false)}>
            Dashboard
          </Link>
          <Link href="/complaint" className="hover:text-white" onClick={() => setSidebarOpen(false)}>
            File a Complaint
          </Link>
          <Link href="/track" className="hover:text-white" onClick={() => setSidebarOpen(false)}>
            Track Complaint
          </Link>
          <a href="#complaints-list" className="hover:text-white" onClick={() => setSidebarOpen(false)}>
            Complaints List
          </a>
        </nav>

        <div className="mt-auto text-xs text-gray-400">
          © 2025 GunaasoNepal
        </div>
      </aside>

      {/* ================= Main ================= */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8 lg:mb-10">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800">
            Dashboard Overview
          </h2>
          <ProfileDropdown />
        </div>

        {/* ================= Stats ================= */}
        <div className="grid gap-6 md:grid-cols-4 mb-12">
          {statsData.map((item) => (
            <div
              key={item.title}
              className="rounded-xl bg-white p-6 border border-gray-200 shadow-sm"
            >
              <div className="mb-3">{item.icon}</div>
              <p className="text-sm text-gray-500">{item.title}</p>
              <p className="text-2xl font-semibold text-gray-800">
                {loading ? "..." : item.value}
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
            My Complaints
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Here's a list of your submitted complaints.
          </p>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-full sm:min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                placeholder="Search complaints..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="h-10 w-full rounded-md border border-gray-300 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#4366d0]"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4366d0]"
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="forwarded">Forwarded</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "status" | "category")}
              className="h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4366d0]"
            >
              <option value="date">Sort by Date</option>
              <option value="status">Sort by Status</option>
              <option value="category">Sort by Category</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="h-10 w-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              title={sortOrder === "asc" ? "Ascending" : "Descending"}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>

            {(searchFilter || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchFilter("");
                  setStatusFilter("all");
                }}
                className="h-10 px-4 rounded-md text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>

          {(searchFilter || statusFilter !== "all") && (
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredComplaints.length} of {complaints.length} complaints
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          )}

          <div className="rounded-xl border border-gray-200 bg-white overflow-x-auto">
            {loading ? (
              <div className="p-6 sm:p-8 text-center text-gray-500 text-sm sm:text-base">
                Loading your complaints...
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="p-6 sm:p-8 text-center text-gray-500 text-sm sm:text-base">
                {searchFilter || statusFilter !== "all"
                  ? "No complaints match your filters. Try adjusting your search criteria."
                  : "You haven't submitted any complaints yet."}
              </div>
            ) : (
              <table className="w-full text-xs sm:text-sm">
                <thead className="border-b bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left whitespace-nowrap">Tracking ID</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">Title</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left hidden md:table-cell">Category</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">Status</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left hidden lg:table-cell">Forwarded To</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left hidden xl:table-cell">Location</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left hidden sm:table-cell">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredComplaints.map((complaint) => (
                    <tr
                      key={complaint.id}
                      className="border-b last:border-0 hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
                      onClick={() => router.push(`/track?id=${complaint.tracking_id}`)}
                    >
                      <td className="px-2 sm:px-4 py-2 sm:py-3 font-mono text-[10px] sm:text-xs font-semibold text-blue-600">
                        <div className="max-w-[100px] truncate">{complaint.tracking_id}</div>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <div className="max-w-[150px] sm:max-w-xs truncate text-xs sm:text-sm">
                          {complaint.title}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 hidden md:table-cell">
                        <span className="rounded-full border border-gray-300 px-2 py-0.5 text-[10px] sm:text-xs whitespace-nowrap">
                          {formatCategory(complaint.category)}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <ComplaintStatus status={complaint.status} />
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 hidden lg:table-cell">
                        {complaint.forwarded_to ? (
                          <div className="text-xs">
                            <div className="font-medium text-gray-900 truncate max-w-[150px]" title={complaint.forwarded_to.office_name}>
                              {complaint.forwarded_to.office_name}
                            </div>
                            <div className="text-gray-500 font-mono text-[10px]">
                              {complaint.forwarded_to.office_id}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Processing...</span>
                        )}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs text-gray-600 hidden xl:table-cell">
                        {complaint.location_district || complaint.location_province || "N/A"}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs text-gray-600 hidden sm:table-cell">
                        {formatDate(complaint.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ================= Components ================= */

function ComplaintStatus({ status }: { status: string }) {
  const statusMap: Record<string, { label: string; className: string }> = {
    submitted: { label: "Submitted", className: "bg-blue-100 text-blue-700" },
    under_review: { label: "Under Review", className: "bg-purple-100 text-purple-700" },
    forwarded: { label: "Forwarded", className: "bg-yellow-100 text-yellow-700" },
    resolved: { label: "Resolved", className: "bg-green-100 text-green-700" },
    rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
    closed: { label: "Closed", className: "bg-gray-100 text-gray-700" },
  };

  const statusInfo = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-700" };

  return (
    <span className={`rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium whitespace-nowrap ${statusInfo.className}`}>
      {statusInfo.label}
    </span>
  );
}

