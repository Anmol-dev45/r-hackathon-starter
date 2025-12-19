"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 3;

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
        className="relative min-h-[80vh] flex items-center"
        style={{
          backgroundImage: "url('/bg.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 text-white">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Citizen Grievance & <br /> Transparency Portal
            </h2>

            <p className="text-lg text-gray-200 mb-8 max-w-xl">
              Report issues, track government projects, and hold authorities
              accountable — all in one place.
            </p>

            <div className="flex gap-4 flex-wrap">
              <Link
                href="/complaint"
                className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-md font-semibold transition"
              >
                Submit Complaint
              </Link>

              <Link
                href="/track"
                className="border border-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-700 transition"
              >
                Track Complaint
              </Link>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: "Complaints Received", value: "1,245" },
              { label: "Resolved", value: "830" },
              { label: "Avg Time", value: "14 Days" },
              { label: "Ministries", value: "18" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center"
              >
                <p className="text-3xl font-bold">{item.value}</p>
                <p className="text-sm text-gray-200 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Citizen Services
        </h3>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            "Infrastructure Issues",
            "Corruption Reporting",
            "Health & Education",
            "Local Government Services",
          ].map((service, i) => (
            <div key={i} className="bg-white border rounded-lg p-6">
              <h4 className="font-semibold text-blue-700 mb-2">{service}</h4>
              <p className="text-sm text-gray-600">
                Submit grievances related to {service.toLowerCase()} and track progress online.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Government Projects */}
      <section className="bg-white border-t border-b">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            National Development Projects
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {currentProjects.map((p, i) => (
              <Link key={p.id} href={`/projects/${p.id}`} className="block">
                <div className="border rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <h4 className="font-semibold text-lg text-blue-700 mb-2">
                    {p.title}
                  </h4>
                  <p className="text-sm text-gray-700 mb-1"><strong>Ministry:</strong> {p.ministry}</p>
                  <p className="text-sm text-gray-700 mb-1"><strong>Budget:</strong> {p.budget}</p>
                  <p className="text-sm text-gray-700 mb-1"><strong>Timeline:</strong> {p.timeline}</p>
                  <p className="text-sm text-gray-700 mb-3"><strong>Status:</strong> {p.status}</p>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-700 h-2 rounded-full"
                      style={{ width: p.progress }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Progress: {p.progress}</p>
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
                className="px-3 py-1.5 bg-blue-700 text-white rounded-md font-medium text-sm hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-gray-700 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-blue-700 text-white rounded-md font-medium text-sm hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Frequently Asked Questions
        </h3>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            "Is my complaint anonymous?",
            "How long does resolution take?",
            "Which authority handles my issue?",
          ].map((q, i) => (
            <div key={i} className="bg-white border rounded-lg p-5">
              <p className="font-semibold text-gray-800">{q}</p>
              <p className="text-sm text-gray-600 mt-2">
                Detailed information is provided after submission and tracking.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Comments */}
      <section className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            User Comments
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            ].map((comment, i) => (
              <div key={i} className="bg-white border rounded-lg p-6 shadow-sm">
                <p className="text-gray-700 mb-4">"{comment.comment}"</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-blue-700">{comment.name}</span>
                  <span className="text-sm text-gray-500">{comment.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Want to Make a Difference */}
      <section className="bg-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Want to make a difference?
          </h3>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of citizens who are actively participating in governance.
            Your voice matters in building a better Nepal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/complaint"
              className="bg-white text-blue-700 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              Report an Issue
            </Link>
            <Link
              href="/dashboard"
              className="border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-700 transition-colors"
            >

              Join the Community
            </Link>
          </div>
        </div>
      </section>

      {/* Government Notice */}
      <section className="bg-yellow-50 border-t border-yellow-200">
        <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-gray-800">
          <strong>Notice:</strong> False or misleading complaints are punishable under
          prevailing laws of Nepal.
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-[#0b1c2d] text-gray-300 text-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between gap-2">
          <span>© 2025 Government of Nepal</span>
          <span>Transparency • Accountability • Citizen Empowerment</span>
        </div>
      </footer>

    </div>
  );
}