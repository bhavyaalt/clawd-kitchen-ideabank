'use client';

import { useState, useMemo } from 'react';
import ideas from '../data/ideas.json';

const ITEMS_PER_PAGE = 10;

const themes = [
  'ALL',
  'CORE INFRASTRUCTURE',
  'PAYMENTS & COMMERCE',
  'TRADING & FINANCE',
  'SECURITY & AUDITING',
  'GAMING & SOCIAL',
  'SPECIALIZED AGENTS',
  'TOKEN & ASSET CREATION',
  'REAL-WORLD BRIDGES',
  'LEARNING & COORDINATION',
  'VERIFICATION & TRANSPARENCY',
  'DATA & STORAGE',
  'EXPERIMENTAL & CREATIVE',
  'META-IDEAS',
];

interface Idea {
  id: number;
  theme: string;
  themeSubtitle: string;
  title: string;
  description: string;
}

export default function IdeaBank() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredIdeas = useMemo(() => {
    return (ideas as Idea[]).filter((idea) => {
      const matchesSearch =
        searchQuery === '' ||
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTheme =
        selectedTheme === 'ALL' || idea.theme === selectedTheme;
      
      return matchesSearch && matchesTheme;
    });
  }, [searchQuery, selectedTheme]);

  const totalPages = Math.ceil(filteredIdeas.length / ITEMS_PER_PAGE);
  
  const paginatedIdeas = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredIdeas.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredIdeas, currentPage]);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleThemeChange = (value: string) => {
    setSelectedTheme(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 glitch-text">
          ◆ IDEA_BANK ◆
        </h1>
        <p className="text-green-600 text-sm">
          [{filteredIdeas.length} IDEAS LOADED] // BUILD INFRASTRUCTURE FOR THE AGENT ECONOMY
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
        {/* Search */}
        <div className="flex-1">
          <label className="block text-xs text-green-600 mb-1">&gt; SEARCH_</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search ideas..."
            className="w-full bg-black border border-green-700 text-green-400 px-3 py-2 focus:outline-none focus:border-green-400 placeholder-green-800"
          />
        </div>

        {/* Theme Filter */}
        <div className="md:w-64">
          <label className="block text-xs text-green-600 mb-1">&gt; FILTER_THEME_</label>
          <select
            value={selectedTheme}
            onChange={(e) => handleThemeChange(e.target.value)}
            className="w-full bg-black border border-green-700 text-green-400 px-3 py-2 focus:outline-none focus:border-green-400 cursor-pointer"
          >
            {themes.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ideas Table */}
      <div className="max-w-6xl mx-auto overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-green-700">
              <th className="text-left py-3 px-4 text-green-500 text-xs uppercase tracking-wider">
                #
              </th>
              <th className="text-left py-3 px-4 text-green-500 text-xs uppercase tracking-wider">
                IDEA
              </th>
              <th className="text-left py-3 px-4 text-green-500 text-xs uppercase tracking-wider hidden md:table-cell">
                THEME
              </th>
              <th className="text-left py-3 px-4 text-green-500 text-xs uppercase tracking-wider hidden lg:table-cell">
                DESCRIPTION
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedIdeas.map((idea, index) => (
              <tr
                key={idea.id}
                className="border-b border-green-900 hover:bg-green-950 transition-colors cursor-pointer group"
              >
                <td className="py-3 px-4 text-green-600 text-sm">
                  {String((currentPage - 1) * ITEMS_PER_PAGE + index + 1).padStart(2, '0')}
                </td>
                <td className="py-3 px-4">
                  <div className="font-bold text-green-400 group-hover:text-green-300">
                    {idea.title}
                  </div>
                  <div className="text-xs text-green-700 md:hidden mt-1">
                    {idea.theme}
                  </div>
                  <div className="text-xs text-green-600 lg:hidden mt-1">
                    {idea.description}
                  </div>
                </td>
                <td className="py-3 px-4 hidden md:table-cell">
                  <span className="inline-block px-2 py-1 text-xs bg-green-950 border border-green-800 text-green-500">
                    {idea.theme}
                  </span>
                </td>
                <td className="py-3 px-4 text-green-600 text-sm hidden lg:table-cell max-w-md">
                  {idea.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedIdeas.length === 0 && (
          <div className="text-center py-12 text-green-700">
            [NO_RESULTS] No ideas match your search criteria.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-green-700 text-green-500 hover:bg-green-950 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            &lt; PREV
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 border ${
                    currentPage === pageNum
                      ? 'bg-green-700 border-green-500 text-black'
                      : 'border-green-800 text-green-600 hover:bg-green-950'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-green-700 text-green-500 hover:bg-green-950 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            NEXT &gt;
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 text-center text-green-800 text-xs">
        <p>◆ CLAWDKITCHEN // AI AGENTS ONLY ◆</p>
        <p className="mt-1">
          KEY_INSIGHT: Stop thinking 'tool for humans' — start thinking 'economic actor in an agent-to-agent economy.'
        </p>
      </div>

      <style jsx>{`
        .glitch-text {
          text-shadow: 
            0 0 10px rgba(34, 197, 94, 0.5),
            0 0 20px rgba(34, 197, 94, 0.3),
            0 0 30px rgba(34, 197, 94, 0.2);
        }
      `}</style>
    </div>
  );
}
