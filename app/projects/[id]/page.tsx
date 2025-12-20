"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { IconBuilding, IconCalendar, IconCash, IconMapPin, IconUser, IconProgress, IconCircleCheck, IconClock, IconAlertTriangle, IconChevronLeft } from '@tabler/icons-react';

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

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium gap-1.5";
    switch (status) {
      case "Completed":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800 border border-green-200`}>
            <IconCircleCheck size={16} />
            Completed
          </span>
        );
      case "Ongoing":
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`}>
            <IconProgress size={16} />
            Ongoing
          </span>
        );
      case "Planned":
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`}>
            <IconClock size={16} />
            Planned
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`}>
            <IconAlertTriangle size={16} />
            {status}
          </span>
        );
    }
  };

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "from-green-500 to-green-600";
      case "Ongoing":
        return "from-blue-500 to-blue-600";
      case "Planned":
        return "from-yellow-500 to-yellow-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getProjectIcon = (title: string) => {
    if (title.includes("Ring Road") || title.includes("Highway")) return <IconBuilding size={32} className="text-blue-600" />;
    if (title.includes("Drinking Water") || title.includes("Water")) return <IconBuilding size={32} className="text-blue-600" />;
    if (title.includes("Green") || title.includes("City")) return <IconBuilding size={32} className="text-green-600" />;
    if (title.includes("Education") || title.includes("Digital")) return <IconBuilding size={32} className="text-purple-600" />;
    if (title.includes("Healthcare") || title.includes("Health")) return <IconBuilding size={32} className="text-red-600" />;
    if (title.includes("Solar") || title.includes("Power") || title.includes("Energy")) return <IconBuilding size={32} className="text-yellow-600" />;
    if (title.includes("Technology") || title.includes("Center")) return <IconBuilding size={32} className="text-indigo-600" />;
    return <IconBuilding size={32} className="text-gray-600" />;
  };

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-lg border p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconAlertTriangle size={32} className="text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm"
            >
              <IconChevronLeft size={18} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Project Details */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <div className="mb-1">
          <Link
            href="/"
            className="inline-flex text-sm items-center gap-2 text-gray-600 hover:text-back font-medium transition-colors"
          >
            <IconChevronLeft size={18} />
            Back to Projects
          </Link>
        </div>

        {/* Project Details Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Project Header */}
          <div className="flex items-start gap-6 mb-8">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center border border-blue-200">
                {getProjectIcon(project.title)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">{project.title}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                {getStatusBadge(project.status)}
                <span className="text-gray-600 font-medium">{project.ministry}</span>
              </div>
            </div>
          </div>

          {project.description && (
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-8">
              <p className="text-gray-700 leading-relaxed text-base">{project.description}</p>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-200 mb-8"></div>

          {/* Project Information Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <IconBuilding size={24} className="text-blue-600" />
              Project Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <IconBuilding size={20} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-700 block">Ministry</span>
                    <span className="text-gray-900">{project.ministry}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <IconCash size={20} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-700 block">Budget</span>
                    <span className="text-gray-900 text-base font-semibold">{project.budget}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <IconCalendar size={20} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-700 block">Timeline</span>
                    <span className="text-gray-900">{project.timeline}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {project.location && (
                  <div className="flex items-start gap-3">
                    <IconMapPin size={20} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-700 block">Location</span>
                      <span className="text-gray-900">{project.location}</span>
                    </div>
                  </div>
                )}
                {project.contractor && (
                  <div className="flex items-start gap-3">
                    <IconUser size={20} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-700 block">Contractor</span>
                      <span className="text-gray-900">{project.contractor}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mb-8"></div>

          {/* Progress Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <IconProgress size={24} className="text-blue-600" />
              Project Progress
            </h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                  <span className="text-xl font-bold text-gray-900">{project.progress}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-4 overflow-hidden border border-gray-300">
                  <div
                    className={`h-full bg-gradient-to-r ${getProgressBarColor(project.status)} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {project.status === 'Completed' ? 'Project completed successfully' :
                   project.status === 'Ongoing' ? 'Project is currently in progress' :
                   'Project is in planning phase'}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <span className="font-semibold text-gray-900">{project.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mb-8"></div>

          {/* Timeline Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <IconCalendar size={24} className="text-blue-600" />
              Project Timeline
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span className="font-semibold text-blue-900">Created</span>
                </div>
                <p className="text-blue-800 font-medium">{new Date(project.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="font-semibold text-green-900">Last Updated</span>
                </div>
                <p className="text-green-800 font-medium">{new Date(project.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}