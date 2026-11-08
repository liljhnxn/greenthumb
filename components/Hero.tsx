"use client";

import React from "react";
import { Sparkles, Heart, BookOpen, Leaf, Compass } from "lucide-react";

interface HeroProps {
  totalTips: number;
  totalLikes: number;
  onOpenShareModal: () => void;
  onScrollToExplore: () => void;
}

export function Hero({
  totalTips,
  totalLikes,
  onOpenShareModal,
  onScrollToExplore,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 border-b border-botanical-cardBorder">
      {/* Decorative botanical glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-botanical-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-emerald-800/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Editorial Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-botanical-card border border-botanical-accent/30 text-xs text-botanical-accent font-medium">
              <Leaf className="w-3.5 h-3.5 animate-pulse" />
              <span>Decentralized Botanical Knowledge on Botchain</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif font-bold text-botanical-text tracking-tight leading-[1.15]">
              Grow Something <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-botanical-accent via-[#D7F58E] to-botanical-highlight italic">
                Beautiful.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-botanical-subtext max-w-2xl leading-relaxed">
              Welcome to <strong className="text-botanical-text font-semibold">GreenThumb</strong>. A decentralized haven where plant lovers, master gardeners, and balcony growers publish authentic gardening tips, care rituals, and horticultural wisdom on-chain.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenShareModal}
                className="px-6 py-3.5 rounded-xl bg-botanical-accent text-botanical-bg font-semibold text-sm hover:bg-botanical-accentHover transition-all shadow-lg shadow-botanical-accent/25 flex items-center gap-2 group cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
                <span>Share a Gardening Tip</span>
              </button>

              <button
                onClick={onScrollToExplore}
                className="px-6 py-3.5 rounded-xl bg-botanical-card border border-botanical-cardBorder hover:border-botanical-accent/40 text-botanical-text font-medium text-sm transition-all flex items-center gap-2 cursor-pointer hover:bg-botanical-cardHover"
              >
                <Compass className="w-4 h-4 text-botanical-accent" />
                <span>Explore Community Tips</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live On-Chain Statistics Cards */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-4">
            {/* Total Tips Card */}
            <div className="flex-1 p-6 rounded-2xl bg-botanical-card border border-botanical-cardBorder relative overflow-hidden group hover:border-botanical-accent/40 transition-all shadow-xl">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <BookOpen className="w-24 h-24 text-botanical-accent" />
              </div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#152317] border border-botanical-accent/30 flex items-center justify-center text-botanical-accent shadow-inner">
                  <BookOpen className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-botanical-subtext font-medium">
                    Published Tips
                  </p>
                  <p className="text-3xl sm:text-4xl font-serif font-bold text-botanical-text mt-0.5">
                    {totalTips}
                  </p>
                  <p className="text-[11px] text-botanical-accent mt-0.5 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-botanical-accent" />
                    Verified On-Chain
                  </p>
                </div>
              </div>
            </div>

            {/* Total Likes Card */}
            <div className="flex-1 p-6 rounded-2xl bg-botanical-card border border-botanical-cardBorder relative overflow-hidden group hover:border-botanical-accent/40 transition-all shadow-xl">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Heart className="w-24 h-24 text-rose-400" />
              </div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#28181B] border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
                  <Heart className="w-7 h-7 fill-rose-500/20" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-botanical-subtext font-medium">
                    Total Community Likes
                  </p>
                  <p className="text-3xl sm:text-4xl font-serif font-bold text-botanical-text mt-0.5">
                    {totalLikes}
                  </p>
                  <p className="text-[11px] text-rose-400 mt-0.5 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    Botanical Appreciation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

