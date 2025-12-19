"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description?: string;
  ministry: string;
  budget: string;
  timeline: string;
  status: string;
  progress: number;
  location?: string;
  contractor?: string;
  created_at: string;
  updated_at: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Demo project data
  const demoProjects: Record<string, Project> = {
    "1": {
      id: "1",
      title: "Kathmandu Ring Road Expansion",
      description: "Major infrastructure project to expand the ring road around Kathmandu, improving traffic flow and connectivity across the city.",
      ministry: "Ministry of Infrastructure",
      budget: "NPR 1.2 Billion",
      timeline: "2019 – 2022",
      status: "Completed",
      progress: 100,
      location: "Kathmandu Valley",
      contractor: "Nepal Infrastructure Development Company",
      created_at: "2019-01-15T00:00:00Z",
      updated_at: "2022-12-31T00:00:00Z",
    },
    "2": {
      id: "2",
      title: "Smart Drinking Water Supply",
      description: "Implementation of smart water supply systems with real-time monitoring and automated distribution to ensure clean water access for urban residents.",
      ministry: "Ministry of Water Supply",
      budget: "NPR 2.5 Billion",
      timeline: "2023 – 2025",
      status: "Ongoing",
      progress: 65,
      location: "Kathmandu, Pokhara, Lalitpur",
      contractor: "Water Engineering Solutions Ltd.",
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2025-12-19T00:00:00Z",
    },
    "3": {
      id: "3",
      title: "Green City Initiative",
      description: "Comprehensive urban greening project including parks, green roofs, and sustainable transportation to make cities more environmentally friendly.",
      ministry: "Ministry of Urban Development",
      budget: "NPR 3.8 Billion",
      timeline: "2026 – 2029",
      status: "Planned",
      progress: 0,
      location: "Major Urban Centers",
      contractor: "Green Urban Development Corp.",
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-12-19T00:00:00Z",
    },
    "4": {
      id: "4",
      title: "Digital Education Platform",
      description: "Development of a nationwide digital education platform providing online courses, virtual classrooms, and educational resources for students across Nepal.",
      ministry: "Ministry of Education",
      budget: "NPR 950 Million",
      timeline: "2024 – 2026",
      status: "Ongoing",
      progress: 30,
      location: "Nationwide",
      contractor: "EduTech Nepal",
      created_at: "2024-03-01T00:00:00Z",
      updated_at: "2025-12-19T00:00:00Z",
    },
    "5": {
      id: "5",
      title: "Rural Healthcare Network",
      description: "Establishment of healthcare centers in rural areas with telemedicine capabilities, medical equipment, and trained healthcare professionals.",
      ministry: "Ministry of Health",
      budget: "NPR 2.1 Billion",
      timeline: "2023 – 2027",
      status: "Ongoing",
      progress: 45,
      location: "Rural Districts",
      contractor: "HealthCare Rural Initiative",
      created_at: "2023-06-01T00:00:00Z",
      updated_at: "2025-12-19T00:00:00Z",
    },
    "6": {
      id: "6",
      title: "Solar Power Expansion",
      description: "Large-scale solar power plant development to increase renewable energy capacity and reduce dependence on imported fossil fuels.",
      ministry: "Ministry of Energy",
      budget: "NPR 4.2 Billion",
      timeline: "2025 – 2030",
      status: "Planned",
      progress: 10,
      location: "Terai Region",
      contractor: "Solar Energy Nepal Ltd.",
      created_at: "2025-02-01T00:00:00Z",
      updated_at: "2025-12-19T00:00:00Z",
    },
    "7": {
      id: "7",
      title: "National Highway Upgrade",
      description: "Upgradation and maintenance of national highways to improve safety, reduce travel time, and boost economic connectivity.",
      ministry: "Ministry of Infrastructure",
      budget: "NPR 5.5 Billion",
      timeline: "2024 – 2028",
      status: "Ongoing",
      progress: 25,
      location: "East-West Highway",
      contractor: "National Road Construction Co.",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2025-12-19T00:00:00Z",
    },
    "8": {
      id: "8",
      title: "Agricultural Technology Center",
      description: "Establishment of technology centers to introduce modern farming techniques, provide training, and develop climate-resilient crop varieties.",
      ministry: "Ministry of Agriculture",
      budget: "NPR 780 Million",
      timeline: "2025 – 2027",
      status: "Planned",
      progress: 0,
      location: "Agricultural Districts",
      contractor: "AgriTech Innovation Nepal",
      created_at: "2025-04-01T00:00:00Z",
      updated_at: "2025-12-19T00:00:00Z",
    },
    "9": {
      id: "9",
      title: "Cultural Heritage Preservation",
      description: "Restoration and preservation of historical monuments, temples, and cultural sites to protect Nepal's rich cultural heritage.",
      ministry: "Ministry of Culture",
      budget: "NPR 650 Million",
      timeline: "2024 – 2026",
      status: "Ongoing",
      progress: 20,
      location: "Kathmandu Valley, Lumbini",
      contractor: "Heritage Conservation Society",
      created_at: "2024-07-01T00:00:00Z",
      updated_at: "2025-12-19T00:00:00Z",
    },
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`);
        const data = await response.json();

        if (data.success) {
          setProject(data.project);
        } else {
          // Fallback to demo data
          const demoProject = demoProjects[id];
          if (demoProject) {
            setProject(demoProject);
          } else {
            setError(data.message || 'Project not found');
          }
        }
      } catch (err) {
        // Fallback to demo data
        const demoProject = demoProjects[id];
        if (demoProject) {
          setProject(demoProject);
        } else {
          setError('Failed to load project details');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="bg-blue-700 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-800"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
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

      {/* Top Government Bar */}
      <div className="bg-[#0b1c2d] text-gray-200 text-sm">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between">
          <span>Government of Nepal</span>
          <span>Public Grievance Redressal System</span>
        </div>
      </div>

      {/* Project Details */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-700 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {project.status}
              </span>
              <span>{project.ministry}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Information</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Ministry:</span>
                  <span className="ml-2 text-gray-900">{project.ministry}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Budget:</span>
                  <span className="ml-2 text-gray-900">{project.budget}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Timeline:</span>
                  <span className="ml-2 text-gray-900">{project.timeline}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className="ml-2 text-gray-900">{project.status}</span>
                </div>
                {project.location && (
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <span className="ml-2 text-gray-900">{project.location}</span>
                  </div>
                )}
                {project.contractor && (
                  <div>
                    <span className="font-medium text-gray-700">Contractor:</span>
                    <span className="ml-2 text-gray-900">{project.contractor}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress</h2>
              <div className="bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-blue-700 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">{project.progress}% Complete</p>
            </div>
          </div>

          {project.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{project.description}</p>
            </div>
          )}

          <div className="border-t pt-6">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
              <span>Last Updated: {new Date(project.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b1c2d] text-gray-300 text-sm mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} Government of Nepal</span>
          <span>Transparency • Accountability • Citizen Empowerment</span>
        </div>
      </footer>
    </div>
  );
}