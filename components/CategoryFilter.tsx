"use client";

import React from "react";
import { Search, Sparkles, Sprout, Flower2, TreePine, Carrot, ShieldCheck } from "lucide-react";

export const CATEGORIES = [
  "All",
  "Indoor Plants",
  "Outdoor Plants",
  "Flowers",
  "Vegetables",
  "Plant Care",
] as const;

export type Category = (typeof CATEGORIES)[number];

interface CategoryFilterProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeTab: "all" | "myTips";
  onTabChange: (tab: "all" | "myTips") => void;
  totalTipsCount: number;
  myTipsCount: number;
  filteredCount: number;
}

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  totalTipsCount,
  myTipsCount,
  filteredCount,
}: CategoryFilterProps) {
  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case "Indoor Plants":
        return <Sprout className="w-3.5 h-3.5" />;
      case "Outdoor Plants":
        return <TreePine className="w-3.5 h-3.5" />;
      case "Flowers":
        return <Flower2 className="w-3.5 h-3.5" />;
      case "Vegetables":
        return <Carrot className="w-3.5 h-3.5" />;
      case "Plant Care":
        return <ShieldCheck className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top row: Tab Switcher & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tab Switcher: Explore Tips vs My Tips */}
        <div className="inline-flex p-1 rounded-xl bg-botanical-card border border-botanical-cardBorder w-full sm:w-auto">
          <button
            onClick={() => onTabChange("all")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "all"
                ? "bg-botanical-accent text-botanical-bg shadow-sm"
                : "text-botanical-subtext hover:text-botanical-text"
            }`}
          >
            <span>Explore All Tips</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                activeTab === "all"
                  ? "bg-botanical-bg/20 text-botanical-bg"
                  : "bg-[#253628] text-botanical-subtext"
              }`}
            >
              {totalTipsCount}
            </span>
          </button>

          <button
            onClick={() => onTabChange("myTips")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "myTips"
                ? "bg-botanical-accent text-botanical-bg shadow-sm"
                : "text-botanical-subtext hover:text-botanical-text"
            }`}
          >
            <span>My Tips</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                activeTab === "myTips"
                  ? "bg-botanical-bg/20 text-botanical-bg"
                  : "bg-[#253628] text-botanical-subtext"
              }`}
            >
              {myTipsCount}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-botanical-subtext absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search plant, tip, keyword..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-botanical-card border border-botanical-cardBorder text-botanical-text placeholder:text-botanical-muted text-xs sm:text-sm focus:outline-none focus:border-botanical-accent transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-botanical-subtext hover:text-botanical-text"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all border ${
                isSelected
                  ? "bg-botanical-accent/15 border-botanical-accent text-botanical-accent shadow-sm"
                  : "bg-botanical-card border-botanical-cardBorder text-botanical-subtext hover:border-botanical-accent/40 hover:text-botanical-text"
              }`}
            >
              {getCategoryIcon(cat)}
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Results Subtitle */}
      <div className="flex items-center justify-between text-xs text-botanical-subtext pt-1">
        <p>
          Showing <span className="text-botanical-accent font-semibold">{filteredCount}</span> {filteredCount === 1 ? "gardening tip" : "gardening tips"}
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>
    </div>
  );
}

