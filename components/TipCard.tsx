"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, User, Calendar, Trash2, ArrowUpRight, Leaf } from "lucide-react";
import { RawTip } from "@/lib/contract";

interface TipCardProps {
  tip: RawTip;
  currentAddress?: string;
  hasLiked: boolean;
  onLike: (tipId: bigint, isCurrentlyLiked: boolean) => void;
  onSelect: (tip: RawTip) => void;
  onDelete: (tipId: bigint) => void;
  isLiking?: boolean;
}

export function TipCard({
  tip,
  currentAddress,
  hasLiked,
  onLike,
  onSelect,
  onDelete,
  isLiking,
}: TipCardProps) {
  const [imgError, setImgError] = useState(false);

  const isAuthor =
    currentAddress &&
    tip.author.toLowerCase() === currentAddress.toLowerCase();

  const formattedDate = new Date(Number(tip.timestamp) * 1000).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Fallback botanical placeholder if no image provided or link broken
  const fallbackImg =
    "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80";

  return (
    <article className="botanical-card rounded-2xl overflow-hidden flex flex-col group border border-botanical-cardBorder hover:border-botanical-accent/40 bg-botanical-card transition-all duration-300">
      {/* Plant Image Thumbnail */}
      <div
        onClick={() => onSelect(tip)}
        className="relative w-full h-48 bg-[#152317] overflow-hidden cursor-pointer"
      >
        <Image
          src={!imgError && tip.imageUrl ? tip.imageUrl : fallbackImg}
          alt={tip.plantName || "Botanical specimen"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-botanical-card via-transparent to-transparent opacity-80" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-botanical-bg/85 backdrop-blur-md text-botanical-accent border border-botanical-accent/30 shadow-md">
            {tip.category}
          </span>
        </div>

        {/* Like Button on Image */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike(tip.id, hasLiked);
          }}
          disabled={isLiking}
          className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md transition-all shadow-md active:scale-90 ${
            hasLiked
              ? "bg-rose-500/90 text-white"
              : "bg-botanical-bg/80 text-botanical-subtext hover:text-rose-400 hover:bg-botanical-bg/95"
          }`}
          title={hasLiked ? "Unlike tip" : "Like tip"}
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              hasLiked ? "fill-white text-white" : ""
            } ${isLiking ? "animate-pulse" : ""}`}
          />
          <span className="font-mono text-xs">{tip.likesCount.toString()}</span>
        </button>

        {/* Plant Botanical Name Banner */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs">
          <span className="text-botanical-text/90 italic font-serif flex items-center gap-1 drop-shadow-md">
            <Leaf className="w-3 h-3 text-botanical-accent" />
            <span className="truncate">{tip.plantName}</span>
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Tip Title */}
          <h3
            onClick={() => onSelect(tip)}
            className="text-base sm:text-lg font-serif font-bold text-botanical-text group-hover:text-botanical-accent transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {tip.title}
          </h3>

          {/* Description Preview */}
          <p
            onClick={() => onSelect(tip)}
            className="text-xs sm:text-sm text-botanical-subtext line-clamp-3 leading-relaxed cursor-pointer"
          >
            {tip.description}
          </p>
        </div>

        {/* Card Footer: Author, Date, Actions */}
        <div className="pt-3 border-t border-botanical-cardBorder/60 flex items-center justify-between text-xs text-botanical-subtext">
          {/* Author link */}
          <a
            href={`https://scan.bohr.life/address/${tip.author}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 hover:text-botanical-accent font-mono transition-colors"
            title={`View author on BohrScan: ${tip.author}`}
          >
            <div className="w-5 h-5 rounded-full bg-[#152317] border border-botanical-accent/30 flex items-center justify-center text-botanical-accent">
              <User className="w-3 h-3" />
            </div>
            <span>{formatAddress(tip.author)}</span>
          </a>

          {/* Date & Actions */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1 text-[11px] text-botanical-muted">
              <Calendar className="w-3 h-3" />
              <span>{formattedDate}</span>
            </span>

            {/* If Author: Delete Button */}
            {isAuthor && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(tip.id);
                }}
                className="text-red-400 hover:text-red-300 p-1 rounded-md hover:bg-red-500/10 transition-colors"
                title="Remove your tip from Botchain"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Read full tip button */}
            <button
              onClick={() => onSelect(tip)}
              className="text-botanical-accent hover:text-botanical-accentHover flex items-center gap-0.5 text-xs font-medium transition-colors"
            >
              <span>Read</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

