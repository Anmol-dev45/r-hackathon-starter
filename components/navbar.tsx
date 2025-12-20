"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { IconUser, IconUserFilled, IconSearch } from '@tabler/icons-react';

interface SearchResult {
  id: number;
  title: string;
  type: string;
  url: string;
}

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isUserHovered, setIsUserHovered] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname === "/auth/login";
  const isDashboard = pathname === "/dashboard";

  // Sample search data - in a real app, this would come from an API or database
  const searchData: SearchResult[] = [
    { id: 1, title: "Kathmandu Ring Road Expansion", type: "project", url: "/projects/1" },
    { id: 2, title: "Smart Drinking Water Supply", type: "project", url: "/projects/2" },
    { id: 3, title: "Green City Initiative", type: "project", url: "/projects/3" },
    { id: 4, title: "Digital Education Platform", type: "project", url: "/projects/4" },
    { id: 5, title: "File Complaint", type: "service", url: "/complaint" },
    { id: 6, title: "Track Complaint", type: "service", url: "/track" },
    { id: 7, title: "Dashboard", type: "service", url: "/dashboard" },
    { id: 8, title: "Infrastructure Issues", type: "service", url: "/complaint" },
    { id: 9, title: "Corruption Reporting", type: "service", url: "/complaint" },
    { id: 10, title: "Health & Education", type: "service", url: "/complaint" },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filtered = searchData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-container')) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  return (
    <nav id="main-navbar" className="mx-auto max-w-7xl border border-gray-300 bg-white/20 backdrop-blur-xl shadow-2xl rounded-lg mt-2 sticky top-2 z-30">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between relative">
          {/* Left side - Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">
              GunaasoNepal
            </Link>
          </div>

          {/* Center - Navigation Links (absolutely centered) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-10 text-sm font-medium items-center">
            <Link 
              href="/" 
              className="text-black hover:text-blue-600 transition-colors duration-200"
              onClick={(e) => {
                // If we're already on home page, just scroll to top
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                // Otherwise, let the Link handle navigation
              }}
            >
              Home
            </Link>
            <Link href="/complaint" className="text-black hover:text-blue-600 transition-colors duration-200">File Complaint</Link>
            <Link href="/track" className="text-black hover:text-blue-600 transition-colors duration-200">Track</Link>
          </div>

          {/* Right side - Search and User */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <div className="flex-shrink-0">
              <div className="relative search-container">
                {isSearchOpen && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                    <div className="p-3">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => handleSearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 text-sm border-0 focus:outline-none focus:ring-0 bg-transparent"
                          autoFocus
                        />
                        <svg className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      {searchResults.length > 0 && (
                        <div className="mt-2 max-h-48 overflow-y-auto">
                          {searchResults.slice(0, 5).map((result) => (
                            <Link
                              key={result.id}
                              href={result.url}
                              className="block px-3 py-2 text-sm hover:bg-gray-50 rounded transition-colors"
                              onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery("");
                                setSearchResults([]);
                              }}
                            >
                              <span className="text-gray-900">{result.title}</span>
                              <span className="text-xs text-gray-500 ml-2 capitalize">• {result.type}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                      {searchQuery && searchResults.length === 0 && (
                        <div className="mt-2 text-xs text-gray-500 text-center py-2">
                          No results
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Search Icon */}
                <button
                  onClick={toggleSearch}
                  className="text-black hover:text-blue-600 transition-colors duration-200 p-1 rounded-md hover:bg-black/5 flex items-center"
                >
                  <IconSearch size={20} stroke={1.5} />
                </button>
              </div>
            </div>

            {/* User Icon */}
            <Link
              href="/auth/login"
              className="text-black hover:text-blue-600 transition-colors duration-200 p-1 rounded-md hover:bg-black/5 flex items-center"
              onMouseEnter={() => setIsUserHovered(true)}
              onMouseLeave={() => setIsUserHovered(false)}
            >
              {isUserHovered ? <IconUserFilled size={20} stroke={1.5} /> : <IconUser size={20} stroke={1.5} />}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}