// GunaasoNepal Dashboard Page
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white text-primary h-screen p-6 flex flex-col shadow-lg">
        <h1 className="mb-10 text-2xl font-bold">GunaasoNepal</h1>
        <nav className="flex flex-col gap-4">
          <Link href="/dashboard" className="hover:text-secondary">Dashboard</Link>
          <Link href="/complaint" className="hover:text-secondary">Submit Complaint</Link>
          <Link href="/track" className="hover:text-secondary">Track Complaint</Link>
          <Link href="/categories" className="hover:text-secondary">Categories</Link>
          <Link href="/settings" className="hover:text-secondary">Settings</Link>
        </nav>
        <div className="mt-auto text-sm text-gray-400">
          © 2025 GunaasoNepal
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
          <Button size="sm" className="bg-primary text-white hover:bg-primary/90">New Complaint</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm text-center">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-semibold text-gray-700">Total Complaints</h3>
            <p className="text-gray-500">1,245</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm text-center">
            <div className="text-3xl mb-2">✅</div>
            <h3 className="font-semibold text-gray-700">Resolved</h3>
            <p className="text-gray-500">830</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm text-center">
            <div className="text-3xl mb-2">⌛</div>
            <h3 className="font-semibold text-gray-700">Pending</h3>
            <p className="text-gray-500">415</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm text-center">
            <div className="text-3xl mb-2">🔍</div>
            <h3 className="font-semibold text-gray-700">In Review</h3>
            <p className="text-gray-500">50</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="flex-1 sm:flex-auto bg-primary text-white hover:bg-primary/90">Submit Complaint</Button>
            <Button size="lg" variant="outline" className="flex-1 sm:flex-auto border-primary text-primary hover:bg-primary/10">Track Complaint</Button>
            <Button size="lg" variant="secondary" className="flex-1 sm:flex-auto bg-secondary text-white hover:bg-secondary/90">Upload Evidence</Button>
          </div>
        </div>

        {/* Recent Complaints Table */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-800">Recent Complaints</h3>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-gray-600">ID</th>
                  <th className="px-4 py-2 text-gray-600">Category</th>
                  <th className="px-4 py-2 text-gray-600">Status</th>
                  <th className="px-4 py-2 text-gray-600">Submitted By</th>
                  <th className="px-4 py-2 text-gray-600">Date</th>
                  <th className="px-4 py-2 text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-gray-100">
                    <td className="px-4 py-2 text-gray-700">{c.id}</td>
                    <td className="px-4 py-2 text-gray-700">{c.category}</td>
                    <td className="px-4 py-2 text-gray-700">{c.status}</td>
                    <td className="px-4 py-2 text-gray-700">{c.user}</td>
                    <td className="px-4 py-2 text-gray-700">{c.date}</td>
                    <td className="px-4 py-2">
                      <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/10">View</Button>
                    </td>
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

const recentComplaints = [
  { id: 'C1021', category: 'Corruption', status: 'Pending', user: 'Anonymous', date: '2025-12-18' },
  { id: 'C1022', category: 'Infrastructure', status: 'Resolved', user: 'Ram K.', date: '2025-12-17' },
  { id: 'C1023', category: 'Health Services', status: 'In Review', user: 'Sita P.', date: '2025-12-16' },
  { id: 'C1024', category: 'Education', status: 'Pending', user: 'Anonymous', date: '2025-12-15' },
  { id: 'C1025', category: 'RTI Request', status: 'Resolved', user: 'Hari B.', date: '2025-12-14' },
];
