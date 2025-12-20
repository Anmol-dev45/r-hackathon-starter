"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { IconClipboard, IconCheck, IconClock, IconBuilding, IconRoad, IconHome, IconLeaf, IconBook, IconHeartbeat, IconBolt, IconTools, IconChevronLeft, IconChevronRight, IconShield, IconUsers, IconMail, IconPhone, IconMapPin, IconHeart, IconChevronDown } from '@tabler/icons-react';

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 3;
  const [currentComment, setCurrentComment] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Auto-slide comments
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentComment((prev) => (prev >= 2 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (icon: string) => {
    switch (icon) {
      case "📋": return <IconClipboard size={24} />;
      case "✅": return <IconCheck size={24} />;
      case "⏱️": return <IconClock size={24} />;
      case "🏛️": return <IconBuilding size={24} />;
      default: return <span>{icon}</span>;
    }
  };

  const getProjectIcon = (title: string) => {
    if (title.includes("Ring Road") || title.includes("Highway")) return <IconRoad size={24} className="text-black font-semibold stroke-[1.5]" />;
    if (title.includes("Drinking Water") || title.includes("Water")) return <IconHome size={24} className="text-black font-semibold stroke-[1.5]" />;
    if (title.includes("Green") || title.includes("City")) return <IconLeaf size={24} className="text-black font-semibold stroke-[1.5]" />;
    if (title.includes("Education") || title.includes("Digital")) return <IconBook size={24} className="text-black font-semibold stroke-[1.5]" />;
    if (title.includes("Healthcare") || title.includes("Health")) return <IconHeartbeat size={24} className="text-black font-semibold stroke-[1.5]" />;
    if (title.includes("Solar") || title.includes("Power") || title.includes("Energy")) return <IconBolt size={24} className="text-black font-semibold stroke-[1.5]" />;
    if (title.includes("Technology") || title.includes("Center")) return <IconTools size={24} className="text-black font-semibold stroke-[1.5]" />;
    return <IconBuilding size={24} className="text-black font-semibold stroke-[1.5]" />;
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

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case "Completed":
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Completed</span>;
      case "Ongoing":
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Ongoing</span>;
      case "Planned":
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Planned</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const allProjects = [
    {
      id: 1,
      title: "Kathmandu Ring Road Expansion",
      ministry: "Ministry of Infrastructure",
      budget: "NPR 1.2 Billion",
      timeline: "2019 – 2022",
      status: "Completed",
      progress: "100%",
      description: "Major infrastructure project to expand the ring road around Kathmandu, improving traffic flow and connectivity across the city.",
      location: "Kathmandu Valley",
      contractor: "Nepal Infrastructure Development Company",
    },
    {
      id: 2,
      title: "Smart Drinking Water Supply",
      ministry: "Ministry of Water Supply",
      budget: "NPR 2.5 Billion",
      timeline: "2023 – 2025",
      status: "Ongoing",
      progress: "65%",
      description: "Implementation of smart water supply systems with real-time monitoring and automated distribution to ensure clean water access for urban residents.",
      location: "Kathmandu, Pokhara, Lalitpur",
      contractor: "Water Engineering Solutions Ltd.",
    },
    {
      id: 3,
      title: "Green City Initiative",
      ministry: "Ministry of Urban Development",
      budget: "NPR 3.8 Billion",
      timeline: "2026 – 2029",
      status: "Planned",
      progress: "0%",
      description: "Comprehensive urban greening project including parks, green roofs, and sustainable transportation to make cities more environmentally friendly.",
      location: "Major Urban Centers",
      contractor: "Green Urban Development Corp.",
    },
    {
      id: 4,
      title: "Digital Education Platform",
      ministry: "Ministry of Education",
      budget: "NPR 950 Million",
      timeline: "2024 – 2026",
      status: "Ongoing",
      progress: "30%",
      description: "Development of a nationwide digital education platform providing online courses, virtual classrooms, and educational resources for students across Nepal.",
      location: "Nationwide",
      contractor: "EduTech Nepal",
    },
    {
      id: 5,
      title: "Rural Healthcare Network",
      ministry: "Ministry of Health",
      budget: "NPR 2.1 Billion",
      timeline: "2023 – 2027",
      status: "Ongoing",
      progress: "45%",
      description: "Establishment of healthcare centers in rural areas with telemedicine capabilities, medical equipment, and trained healthcare professionals.",
      location: "Rural Districts",
      contractor: "HealthCare Rural Initiative",
    },
    {
      id: 6,
      title: "Solar Power Expansion",
      ministry: "Ministry of Energy",
      budget: "NPR 4.2 Billion",
      timeline: "2025 – 2030",
      status: "Planned",
      progress: "10%",
      description: "Large-scale solar power plant development to increase renewable energy capacity and reduce dependence on imported fossil fuels.",
      location: "Terai Region",
      contractor: "Solar Energy Nepal Ltd.",
    },
    {
      id: 7,
      title: "National Highway Upgrade",
      ministry: "Ministry of Infrastructure",
      budget: "NPR 5.5 Billion",
      timeline: "2024 – 2028",
      status: "Ongoing",
      progress: "25%",
      description: "Upgradation and maintenance of national highways to improve safety, reduce travel time, and boost economic connectivity.",
      location: "East-West Highway",
      contractor: "National Road Construction Co.",
    },
    {
      id: 8,
      title: "Agricultural Technology Center",
      ministry: "Ministry of Agriculture",
      budget: "NPR 780 Million",
      timeline: "2025 – 2027",
      status: "Planned",
      progress: "0%",
      description: "Establishment of technology centers to introduce modern farming techniques, provide training, and develop climate-resilient crop varieties.",
      location: "Agricultural Districts",
      contractor: "AgriTech Innovation Nepal",
    },
    {
      id: 9,
      title: "Cultural Heritage Preservation",
      ministry: "Ministry of Culture",
      budget: "NPR 650 Million",
      timeline: "2024 – 2026",
      status: "Ongoing",
      progress: "20%",
      description: "Restoration and preservation of historical monuments, temples, and cultural sites to protect Nepal's rich cultural heritage.",
      location: "Kathmandu Valley, Lumbini",
      contractor: "Heritage Conservation Society",
    },
  ];

  const totalPages = Math.ceil(allProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const currentProjects = allProjects.slice(startIndex, startIndex + projectsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">



      {/* Hero */}
      <section
        className="relative h-screen flex items-center bg-gray-100"
      >
        <div className="relative z-10 w-full px-6 py-10 text-gray-900">
          <div className="max-w-7xl mx-auto">
            {/* Main content aligned with logo */}
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-blue-600 bg-clip-text text-transparent">
                  Citizen Grievance & <br />
                  Transparency Portal
                </h2>

                <p className="text-xl text-gray-700 mb-8 max-w-3xl leading-relaxed font-medium">
                  Report issues, track government projects, and hold authorities
                  accountable — all in one place.
                </p>
              </div>

              <div className="flex gap-4 flex-wrap">
                <Link
                  href="/complaint"
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold text-sm transition transform hover:scale-105 text-white"
                >
                  File a Complaint
                </Link>

                <Link
                  href="/track"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-2 rounded-lg font-semibold text-sm transition transform hover:scale-105"
                >
                  Track Complaint
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16 -mt-16 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Impact</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Real-time statistics showing our commitment to transparent and efficient governance</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Complaints Received",
                value: "1,245",
                icon: "📋",
                color: "from-blue-500 to-blue-600",
                bgColor: "from-blue-50 to-blue-100"
              },
              {
                label: "Resolved",
                value: "830",
                icon: "✅",
                color: "from-green-500 to-green-600",
                bgColor: "from-green-50 to-green-100"
              },
              {
                label: "Avg Resolution Time",
                value: "14 Days",
                icon: "⏱️",
                color: "from-purple-500 to-purple-600",
                bgColor: "from-purple-50 to-purple-100"
              },
              {
                label: "Ministries Connected",
                value: "18",
                icon: "🏛️",
                color: "from-orange-500 to-orange-600",
                bgColor: "from-orange-50 to-orange-100"
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group bg-white/80 backdrop-blur-sm shadow-sm border border-white/50 rounded-3xl p-6 text-center hover:-translate-y-1 transition-all duration-300 transform"
              >
                <div className={`w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${item.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  {getIcon(item.icon)}
                </div>
                <p className={`text-4xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-2`}>
                  {item.value}
                </p>
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* Additional visual element */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/50">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live updates every 5 minutes</span>
            </div>
          </div>
        </div>
      </section>

      

      {/* Government Projects */}
      <section>
        <div className="max-w-7xl mx-auto px-6 py-14">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            National Development Projects
          </h3>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {currentProjects.map((p, i) => (
              <Link key={p.id} href={`/projects/${p.id}`} className="block">
                <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-sm hover:-translate-y-1 transition-all duration-300 transform h-60 flex flex-col">
                  <div className="flex items-start justify-between mb-4 h-16">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 mt-1">
                        {getProjectIcon(p.title)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-base text-gray-900 leading-tight line-clamp-2">
                          {p.title}
                        </h4>
                        <p className="text-xs text-blue-600 font-medium mt-1">{p.ministry}</p>
                      </div>
                    </div>
                    {getStatusBadge(p.status)}
                  </div>

                  <div className="space-y-3 mb-4 flex-grow flex flex-col justify-center">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 font-medium">Budget:</span>
                      <span className="font-semibold text-gray-900">{p.budget}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 font-medium">Timeline:</span>
                      <span className="font-semibold text-gray-900">{p.timeline}</span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 font-medium">Progress</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden border border-gray-300/50">
                        <div
                          className={`h-full bg-gradient-to-r ${getProgressBarColor(p.status)} rounded-full transition-all duration-700 ease-out`}
                          style={{ width: p.progress }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 min-w-[3rem] text-right">{p.progress}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-blue-700 text-blue-700 rounded-lg font-medium text-sm hover:bg-blue-50 disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <IconChevronLeft size={16} />
              </button>
              <span className="text-gray-700 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-blue-700 text-blue-700 rounded-lg font-medium text-sm hover:bg-blue-50 disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <IconChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Services */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Citizen Services</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">Access a wide range of government services and report issues affecting your community. Your voice matters in building a better Nepal.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Infrastructure Issues",
                description: "Report problems with roads, bridges, water supply, electricity, and public facilities",
                icon: <IconTools size={24} stroke={1.5} className="text-black" />,
                category: "infrastructure",
                color: "from-blue-500 to-blue-600"
              },
              {
                title: "Corruption & Bribery",
                description: "Report corruption, bribery, or unethical practices in government services",
                icon: <IconShield size={24} stroke={1.5} className="text-black" />,
                category: "corruption",
                color: "from-red-500 to-red-600"
              },
              {
                title: "Public Health Services",
                description: "Issues related to hospitals, medical facilities, and healthcare delivery",
                icon: <IconHeartbeat size={24} stroke={1.5} className="text-black" />,
                category: "health_services",
                color: "from-green-500 to-green-600"
              },
              {
                title: "Education System",
                description: "Problems with schools, teachers, curriculum, and educational resources",
                icon: <IconBook size={24} stroke={1.5} className="text-black" />,
                category: "education",
                color: "from-purple-500 to-purple-600"
              },
              {
                title: "Land & Property",
                description: "Land disputes, property rights, and administrative land-related issues",
                icon: <IconHome size={24} stroke={1.5} className="text-black" />,
                category: "land_administration",
                color: "from-orange-500 to-orange-600"
              },
              {
                title: "Environmental Concerns",
                description: "Pollution, deforestation, waste management, and environmental protection",
                icon: <IconLeaf size={24} stroke={1.5} className="text-black" />,
                category: "other",
                color: "from-emerald-500 to-emerald-600"
              },
              {
                title: "Public Transportation",
                description: "Issues with buses, roads, traffic management, and transportation services",
                icon: <IconRoad size={24} stroke={1.5} className="text-black" />,
                category: "infrastructure",
                color: "from-indigo-500 to-indigo-600"
              },
              {
                title: "Law Enforcement",
                description: "Police services, security concerns, and law enforcement related issues",
                icon: <IconUsers size={24} stroke={1.5} className="text-black" />,
                category: "police_misconduct",
                color: "from-slate-500 to-slate-600"
              },
              {
                title: "Administrative Services",
                description: "Citizenship, passport, license, and other government administrative services",
                icon: <IconClipboard size={24} stroke={1.5} className="text-black" />,
                category: "service_delivery",
                color: "from-cyan-500 to-cyan-600"
              }
            ].map((service, i) => (
              <Link key={i} href={`/complaint?category=${service.category}`} className="block group">
                <div className="bg-white/80 backdrop-blur-sm shadow-sm border border-white/50 rounded-3xl p-6 hover:-translate-y-1 transition-all duration-300 transform">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 p-2 rounded-xl bg-gray-100 group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                        {service.title}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end mt-4">
                    <div className="w-8 h-8 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <IconChevronRight size={16} stroke={1.5} className="text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/complaint"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition transform hover:scale-105"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">Find answers to common questions about our complaint system and how to get help with government services.</p>
        </div>

        <div className="space-y-6">
          {[
            {
              question: "Is my complaint anonymous?",
              answer: "Yes, you can submit complaints anonymously. However, providing contact information allows us to follow up with you for clarifications and updates on your complaint's progress. Your privacy is protected under Nepal's data protection laws."
            },
            {
              question: "How long does it take to resolve a complaint?",
              answer: "Resolution time varies depending on the complexity and nature of the issue. Simple complaints are typically resolved within 14 days, while more complex cases involving multiple ministries may take 30-60 days. You'll receive regular updates on your complaint status."
            },
            {
              question: "Which authority handles my complaint?",
              answer: "Complaints are automatically routed to the appropriate ministry or local government authority based on the category you select. For example, infrastructure issues go to the Ministry of Infrastructure, while education concerns are directed to the Ministry of Education."
            },
            {
              question: "Can I track my complaint progress?",
              answer: "Yes, once you submit a complaint, you'll receive a unique tracking ID. You can use this ID on our tracking page to monitor the status, view updates, and see which authority is handling your case. We also send email notifications for major updates."
            },
            {
              question: "What types of issues can I report?",
              answer: "You can report a wide range of issues including corruption, infrastructure problems, public service failures, environmental concerns, land disputes, and administrative inefficiencies. Our system covers all major government services and civic issues."
            },
            {
              question: "Is the service free to use?",
              answer: "Yes, our complaint filing and tracking services are completely free. We believe in transparent governance and want to ensure that every citizen has easy access to report issues and hold authorities accountable without any financial barriers."
            }
          ].map((faq, i) => (
            <div key={i} className="border-b border-gray-200 pb-6 last:border-b-0">
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full text-left flex items-center justify-between py-4 hover:text-blue-600 transition-colors duration-200 group"
              >
                <span className="font-semibold text-gray-900 group-hover:text-blue-600 pr-4">{faq.question}</span>
                <IconChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform duration-300 flex-shrink-0 ${expandedFaq === i ? 'rotate-180' : ''}`}
                />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pb-4">
                  <p className="text-gray-600 leading-relaxed pl-0">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comments */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Testimonials
          </h3>

          <div className="relative max-w-7xl mx-auto overflow-hidden">
            <div className="flex animate-scroll">
              {/* Duplicate the entire array twice for seamless infinite scroll */}
              {[
                {
                  name: "Ram Prasad",
                  comment: "This portal has made it so easy to report issues in my community. Great initiative!",
                  date: "December 15, 2025",
                },
                {
                  name: "Sita Sharma",
                  comment: "I was able to track my complaint and see real progress. Transparency at its best.",
                  date: "December 12, 2025",
                },
                {
                  name: "Hari Bahadur",
                  comment: "The government should promote this more. It's helping citizens like me a lot.",
                  date: "December 10, 2025",
                },
                {
                  name: "Gita Thapa",
                  comment: "Quick response and resolution. Much better than the old system.",
                  date: "December 8, 2025",
                },
                {
                  name: "Bikash Gurung",
                  comment: "I appreciate the anonymity option. Makes people more willing to speak up.",
                  date: "December 5, 2025",
                },
                {
                  name: "Maya Rai",
                  comment: "The project tracking feature is excellent. I can see how my tax money is being used.",
                  date: "December 3, 2025",
                },
                // First duplicate
                {
                  name: "Ram Prasad",
                  comment: "This portal has made it so easy to report issues in my community. Great initiative!",
                  date: "December 15, 2025",
                },
                {
                  name: "Sita Sharma",
                  comment: "I was able to track my complaint and see real progress. Transparency at its best.",
                  date: "December 12, 2025",
                },
                {
                  name: "Hari Bahadur",
                  comment: "The government should promote this more. It's helping citizens like me a lot.",
                  date: "December 10, 2025",
                },
                {
                  name: "Gita Thapa",
                  comment: "Quick response and resolution. Much better than the old system.",
                  date: "December 8, 2025",
                },
                {
                  name: "Bikash Gurung",
                  comment: "I appreciate the anonymity option. Makes people more willing to speak up.",
                  date: "December 5, 2025",
                },
                {
                  name: "Maya Rai",
                  comment: "The project tracking feature is excellent. I can see how my tax money is being used.",
                  date: "December 3, 2025",
                },
              ].map((comment, i) => (
                <div key={i} className="w-1/4 flex-shrink-0 px-3">
                  <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-3xl p-6 shadow-sm h-full">
                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">"{comment.comment}"</p>
                    <div className="border-t border-gray-200 pt-3">
                      <span className="font-semibold text-blue-700 text-sm">{comment.name}</span>
                      <p className="text-xs text-gray-500 mt-1">{comment.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Government Notice */}
        <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-800">
          <strong>Notice:</strong> False or misleading complaints are punishable under
          prevailing laws of Nepal.
        </div>
      </section>

      {/* Want to Make a Difference */}
      {/* <section className="bg-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Want to make a difference?
          </h3>
          <p className="text-base mb-8 max-w-3xl mx-auto">
            Join thousands of citizens who are actively participating in governance.
            Your voice matters in building a better Nepal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <Link
                  href="/complaint"
                  className="bg-white hover:bg-blue-700 hover:text-white px-6 py-2 rounded-lg font-semibold text-sm transition transform hover:scale-105 text-blue-600"
                >
                  File a Complaint
                </Link>

                <Link
                  href="/login"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-2 rounded-lg font-semibold text-sm transition transform hover:scale-105"
                >
                  Join the Community
                </Link>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-[#0b1c2d] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-4 gap-8 mb-6">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-xl font-bold">GunaasoNepal</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Committed to transparency, accountability, and citizen empowerment through innovative digital governance solutions.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <IconBuilding size={18} className="text-white stroke-[1.5]" />
                Services
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Complaint Filing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Project Tracking</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Government Schemes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Citizen Services</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <IconUsers size={18} className="text-white stroke-[1.5]" />
                Connect
              </h4>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <IconMail size={16} className="text-white flex-shrink-0 stroke-[1.5]" />
                  <span>info@gov.np</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconPhone size={16} className="text-white flex-shrink-0 stroke-[1.5]" />
                  <span>+977-1-1234567</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconMapPin size={16} className="text-white flex-shrink-0 stroke-[1.5]" />
                  <span>Singha Durbar, Kathmandu</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span>© 2025 GunaasoNepal. All rights reserved.</span>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Accessibility</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}