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
  BarChart3,
  TrendingUp,
  Filter,
  RefreshCw,
  Menu,
  X,
  Settings,
  HelpCircle,
} from "lucide-react";

import { ProfileDropdown } from "@/components/profile-dropdown";
import { StatCard } from "@/components/dashboard/stat-card";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { NotificationBadge } from "@/components/dashboard/notification-badge";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { CategoryDistribution } from "@/components/dashboard/category-distribution";
import { InsightsCard } from "@/components/dashboard/insights-card";
import { SavedFilters } from "@/components/dashboard/saved-filters";
import { ExportMenu } from "@/components/dashboard/export-menu";

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
  trends: {
    total: number;
    resolved: number;
    pending: number;
    underReview: number;
  };
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
    trends: { total: 12, resolved: 8, pending: -5, underReview: 15 },
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "status" | "category">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch user's complaints
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/complaints/my-complaints?limit=100");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch complaints");
      }

      if (data.success) {
        const complaintsWithForwarding = await Promise.all(
          data.complaints.map(async (complaint: Complaint) => {
            try {
              const forwardingRes = await fetch(
                `/api/complaints/forwarding?complaint_id=${complaint.id}`
              );
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
          (c: Complaint) =>
            c.status === "submitted" || c.status === "forwarded"
        ).length;
        const underReview = data.complaints.filter(
          (c: Complaint) => c.status === "under_review"
        ).length;

        setStats(prev => ({ ...prev, total, resolved, pending, underReview }));
      }
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load complaints"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
  };

  // Filter and sort complaints
  const filteredComplaints = complaints
    .filter((complaint) => {
      const searchTerm = searchFilter.toLowerCase().trim();
      const matchesSearch =
        !searchTerm ||
        complaint.tracking_id.toLowerCase().includes(searchTerm) ||
        complaint.title.toLowerCase().includes(searchTerm) ||
        complaint.category.toLowerCase().includes(searchTerm) ||
        complaint.description.toLowerCase().includes(searchTerm) ||
        complaint.location_district?.toLowerCase().includes(searchTerm) ||
        complaint.location_province?.toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || complaint.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || complaint.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison =
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime();
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

  // Category data for distribution chart
  const categoryData = [
    { category: "Service Delivery", count: complaints.filter(c => c.category === "service_delivery").length, color: "#3b82f6" },
    { category: "Corruption", count: complaints.filter(c => c.category === "corruption").length, color: "#ef4444" },
    { category: "Public Project", count: complaints.filter(c => c.category === "public_project").length, color: "#10b981" },
    { category: "Infrastructure", count: complaints.filter(c => c.category === "infrastructure").length, color: "#f59e0b" },
    { category: "Education", count: complaints.filter(c => c.category === "education").length, color: "#8b5cf6" },
  ].filter(c => c.count > 0);

  // Mock activity data
  const activities = complaints.slice(0, 5).map(c => ({
    id: c.id,
    type: "status_change" as const,
    title: `Complaint ${c.status === "resolved" ? "Resolved" : "Updated"}`,
    description: c.title,
    timestamp: c.updated_at,
    tracking_id: c.tracking_id,
  }));

  // Mock insights
  const insights = [
    {
      type: "trend" as const,
      title: "Response Time Improving",
      description: "Your complaints are being processed 23% faster than last month",
    },
    {
      type: "tip" as const,
      title: "Add More Details",
      description: "Complaints with evidence get resolved 40% faster on average",
    },
    {
      type: "performance" as const,
      title: "High Resolution Rate",
      description: `${stats.resolved} out of ${stats.total} complaints resolved successfully`,
    },
  ];

  // Bulk actions handlers
  const handleExport = (format: "csv" | "json" | "pdf") => {
    const dataToExport = filteredComplaints;

    if (format === "csv") {
      const csv = convertToCSV(dataToExport);
      downloadFile(csv, "complaints.csv", "text/csv");
    } else if (format === "json") {
      const json = JSON.stringify(dataToExport, null, 2);
      downloadFile(json, "complaints.json", "application/json");
    }
  };

  const convertToCSV = (data: Complaint[]) => {
    const headers = ["Tracking ID", "Title", "Category", "Status", "Date"];
    const rows = data.map(c => [
      c.tracking_id,
      c.title,
      formatCategory(c.category),
      c.status,
      formatDate(c.created_at),
    ]);
    return [headers, ...rows].map(row => row.join(",")).join("\n");
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Get unique categories for filter
  const uniqueCategories = Array.from(new Set(complaints.map(c => c.category)));

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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-gray-900 text-white rounded-xl shadow-2xl hover:bg-gray-800 transition-colors"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= Sidebar ================= */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-200 p-6 flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Gunaaso<span className="text-blue-400">Nepal</span>
          </h1>
          <p className="text-xs text-gray-400">Citizen Complaint Portal</p>
        </div>

        <nav className="flex-1 space-y-2">
          <NavLink
            href="/dashboard"
            icon={<BarChart3 className="h-5 w-5" />}
            label="Dashboard"
            active
            onClick={() => setSidebarOpen(false)}
          />
          <NavLink
            href="/complaint"
            icon={<FileText className="h-5 w-5" />}
            label="File Complaint"
            onClick={() => setSidebarOpen(false)}
          />
          <NavLink
            href="/track"
            icon={<Search className="h-5 w-5" />}
            label="Track Status"
            onClick={() => setSidebarOpen(false)}
          />
          <button
            onClick={() => {
              document.getElementById("complaints-list")?.scrollIntoView({ behavior: "smooth" });
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all"
          >
            <FileText className="h-5 w-5" />
            <span>My Complaints</span>
          </button>

          <div className="pt-4 mt-4 border-t border-gray-700">
            <div className="px-4 py-3 bg-blue-900/30 rounded-xl mb-2">
              <p className="text-xs text-gray-400 mb-1">Need help?</p>
              <p className="text-sm text-white">Click the icons to learn what they do</p>
            </div>
            <NavLink
              href="/settings"
              icon={<Settings className="h-5 w-5" />}
              label="Settings"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-700">
          <div className="text-xs text-gray-500">
            <p>© 2025 GunaasoNepal</p>
            <p className="mt-1">Version 2.0</p>
          </div>
        </div>
      </aside>

      {/* ================= Main Content ================= */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              नमस्ते! Welcome 👋
            </h2>
            <p className="text-gray-600 text-base">
              Track your complaints and see their progress here
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all disabled:opacity-50"
              title="Refresh to see latest updates"
            >
              <RefreshCw
                className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
            <NotificationBadge />
            <ProfileDropdown />
          </div>
        </div>

        {/* Help Banner for first time users */}
        {stats.total === 0 && !loading && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Welcome to GunaasoNepal! 🎉
            </h3>
            <p className="text-gray-700 mb-4">
              This is your personal dashboard. Here you can:
            </p>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Submit complaints about government services or issues</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Track the status of your complaints in real-time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>See which department is handling your issue</span>
              </li>
            </ul>
            <button
              onClick={() => router.push("/complaint")}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              File Your First Complaint →
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
          <StatCard
            title="Total Complaints"
            value={stats.total}
            icon={<FileText className="h-6 w-6" />}
            color="blue"
            trend={{ value: stats.trends.total, isPositive: stats.trends.total >= 0 }}
            loading={loading}
          />
          <StatCard
            title="Resolved"
            value={stats.resolved}
            icon={<CheckCircle2 className="h-6 w-6" />}
            color="green"
            trend={{ value: stats.trends.resolved, isPositive: true }}
            loading={loading}
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<Clock className="h-6 w-6" />}
            color="yellow"
            trend={{ value: stats.trends.pending, isPositive: stats.trends.pending <= 0 }}
            loading={loading}
          />
          <StatCard
            title="Under Review"
            value={stats.underReview}
            icon={<TrendingUp className="h-6 w-6" />}
            color="purple"
            trend={{ value: stats.trends.underReview, isPositive: true }}
            loading={loading}
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            What would you like to do?
          </h3>
          <p className="text-sm text-gray-600 mb-4">Choose an action below to get started</p>
          <QuickActions />
        </div>

        {/* Analytics Section */}
        <div id="analytics" className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Category Distribution */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Your Complaints by Type
            </h3>
            <p className="text-xs text-gray-500 mb-4">See which areas you've reported about</p>
            <CategoryDistribution data={categoryData} loading={loading} />
          </div>

          {/* Activity Timeline */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-200 max-h-[400px] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Recent Updates
            </h3>
            <p className="text-xs text-gray-500 mb-4">Latest changes to your complaints</p>
            <ActivityTimeline activities={activities} loading={loading} />
          </div>

          {/* Insights */}
          <div className="lg:col-span-1 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 shadow-sm border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Helpful Tips
            </h3>
            <p className="text-xs text-gray-600 mb-4">Suggestions to get better results</p>
            <InsightsCard insights={insights} loading={loading} />
          </div>
        </div>
        {/* Complaints List */}
        <div id="complaints-list" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                All My Complaints
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                View and check the status of complaints you've filed
              </p>
            </div>
            <div className="hidden sm:block">
              <ExportMenu onExport={handleExport} />
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  placeholder="Search by ID, title, or location..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-300 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  title="Type to search your complaints"
                />
                {searchFilter && (
                  <button
                    onClick={() => setSearchFilter("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 h-11 rounded-xl border transition-all ${showFilters
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <Filter className="h-4 w-4" />
                Filters
                {(statusFilter !== "all" || categoryFilter !== "all") && (
                  <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                    {(statusFilter !== "all" ? 1 : 0) +
                      (categoryFilter !== "all" ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-xl">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>
                      {formatCategory(cat)}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "date" | "status" | "category")
                  }
                  className="h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date">Sort by Date</option>
                  <option value="status">Sort by Status</option>
                  <option value="category">Sort by Category</option>
                </select>

                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="h-10 px-4 rounded-lg border border-gray-300 flex items-center justify-center gap-2 hover:bg-white transition-colors text-sm font-medium"
                >
                  {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
                </button>
              </div>
            )}

            {/* Saved Filters */}
            <SavedFilters
              onApplyFilter={(filter) => {
                setSearchFilter(filter.searchFilter);
                setStatusFilter(filter.statusFilter);
                setCategoryFilter(filter.categoryFilter);
              }}
            />
          </div>

          {(searchFilter || statusFilter !== "all" || categoryFilter !== "all") && (
            <div className="mb-4 flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-700">
                Showing <span className="font-semibold">{filteredComplaints.length}</span> of{" "}
                <span className="font-semibold">{complaints.length}</span> complaints
              </span>
              <button
                onClick={() => {
                  setSearchFilter("");
                  setStatusFilter("all");
                  setCategoryFilter("all");
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Table */}
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading your complaints...</p>
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {searchFilter || statusFilter !== "all" || categoryFilter !== "all"
                    ? "No complaints found"
                    : "You haven't filed any complaints yet"}
                </p>
                <p className="text-gray-600 mb-6">
                  {searchFilter || statusFilter !== "all" || categoryFilter !== "all"
                    ? "Try changing your search or filters above"
                    : "Click the button below to report your first issue"}
                </p>
                {!(searchFilter || statusFilter !== "all" || categoryFilter !== "all") && (
                  <button
                    onClick={() => router.push("/complaint")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-base"
                  >
                    Submit Your First Complaint
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Complaint ID
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        What's it about?
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                        Type
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Current Status
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                        Sent To
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden xl:table-cell">
                        Location
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                        Date Filed
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {filteredComplaints.map((complaint) => (
                      <tr
                        key={complaint.id}
                        className="hover:bg-blue-50 transition-colors cursor-pointer"
                        onClick={() => router.push(`/track?id=${complaint.tracking_id}`)}
                      >
                        <td className="px-4 py-4">
                          <span className="font-mono text-xs font-semibold text-blue-600">
                            {complaint.tracking_id}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="max-w-xs">
                            <p className="font-medium text-gray-900 truncate">
                              {complaint.title}
                            </p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {complaint.description}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {formatCategory(complaint.category)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <ComplaintStatus status={complaint.status} />
                        </td>
                        <td className="px-4 py-4 hidden lg:table-cell">
                          {complaint.forwarded_to ? (
                            <div className="text-xs">
                              <div
                                className="font-medium text-gray-900 truncate max-w-[180px]"
                                title={complaint.forwarded_to.office_name}
                              >
                                {complaint.forwarded_to.office_name}
                              </div>
                              <div className="text-gray-500 font-mono text-[10px] mt-0.5">
                                {complaint.forwarded_to.office_id}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">
                              Processing...
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-600 hidden xl:table-cell">
                          {complaint.location_district ||
                            complaint.location_province ||
                            "N/A"}
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-600 hidden sm:table-cell whitespace-nowrap">
                          {formatDate(complaint.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ================= Components ================= */

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavLink({ href, icon, label, active, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
        : "text-gray-300 hover:bg-white/10 hover:text-white"
        }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function ComplaintStatus({ status }: { status: string }) {
  const statusMap: Record<
    string,
    { label: string; className: string; dotColor: string }
  > = {
    submitted: {
      label: "Received ✓",
      className: "bg-blue-50 text-blue-700 border-blue-200",
      dotColor: "bg-blue-500",
    },
    under_review: {
      label: "Being Reviewed",
      className: "bg-purple-50 text-purple-700 border-purple-200",
      dotColor: "bg-purple-500",
    },
    forwarded: {
      label: "Sent to Department",
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
      dotColor: "bg-yellow-500",
    },
    resolved: {
      label: "Resolved ✓",
      className: "bg-green-50 text-green-700 border-green-200",
      dotColor: "bg-green-500",
    },
    rejected: {
      label: "Not Accepted",
      className: "bg-red-50 text-red-700 border-red-200",
      dotColor: "bg-red-500",
    },
    closed: {
      label: "Closed",
      className: "bg-gray-50 text-gray-700 border-gray-200",
      dotColor: "bg-gray-500",
    },
  };

  const statusInfo = statusMap[status] || {
    label: status,
    className: "bg-gray-50 text-gray-700 border-gray-200",
    dotColor: "bg-gray-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusInfo.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dotColor} animate-pulse`} />
      {statusInfo.label}
    </span>
  );
}

