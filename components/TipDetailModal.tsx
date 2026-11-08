"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Heart, User, Calendar, ExternalLink, Trash2, Leaf, ShieldCheck } from "lucide-react";
import { RawTip } from "@/lib/contract";

interface TipDetailModalProps {
  tip: RawTip | null;
  onClose: () => void;
  currentAddress?: string;
  hasLiked: boolean;
  onLike: (tipId: bigint, isCurrentlyLiked: boolean) => void;
  onDelete: (tipId: bigint) => void;
  isLiking?: boolean;
}

export function TipDetailModal({
  tip,
  onClose,
  currentAddress,
  hasLiked,
  onLike,
  onDelete,
  isLiking,
}: TipDetailModalProps) {
  const [imgError, setImgError] = useState(false);

  if (!tip) return null;

  const isAuthor =
    currentAddress &&
    tip.author.toLowerCase() === currentAddress.toLowerCase();

  const formattedDate = new Date(Number(tip.timestamp) * 1000).toLocaleDateString(
    undefined,
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const fallbackImg =
    "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-botanical-card border border-botanical-accent/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Plant Image Header */}
        <div className="relative w-full h-64 sm:h-80 bg-[#152317] shrink-0">
          <Image
            src={!imgError && tip.imageUrl ? tip.imageUrl : fallbackImg}
            alt={tip.plantName || "Plant"}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-botanical-card via-botanical-card/40 to-transparent" />

          {/* Category Badge & Verified Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-botanical-bg/90 backdrop-blur-md text-botanical-accent border border-botanical-accent/30 shadow-lg">
              {tip.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#152317]/90 backdrop-blur-md text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>On-Chain Record</span>
            </span>
          </div>

          {/* Plant Botanical Title on Image */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-1.5 text-botanical-accent text-xs font-semibold uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5" />
              <span>Botanical Variety</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif italic text-white drop-shadow-md">
              {tip.plantName}
            </h3>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Tip Title */}
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-botanical-text leading-tight">
            {tip.title}
          </h2>

          {/* Author & Timestamp Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-botanical-bg/60 border border-botanical-cardBorder text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#152317] border border-botanical-accent/30 flex items-center justify-center text-botanical-accent">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-botanical-subtext uppercase tracking-wider">
                  Gardener / Author
                </p>
                <a
                  href={`https://scan.bohr.life/address/${tip.author}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-botanical-accent hover:underline flex items-center gap-1"
                >
                  <span>{tip.author}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 text-botanical-subtext">
              <Calendar className="w-4 h-4 text-botanical-accent" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Advice / Experience text */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-semibold text-botanical-accent tracking-wider">
              Gardening Experience & Advice
            </h4>
            <div className="p-5 rounded-2xl bg-[#162419] border border-botanical-cardBorder/70 text-botanical-text text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans">
              {tip.description}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-botanical-cardBorder/60 flex items-center justify-between gap-4">
            {/* Like Button */}
            <button
              onClick={() => onLike(tip.id, hasLiked)}
              disabled={isLiking}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                hasLiked
                  ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                  : "bg-botanical-card border border-botanical-cardBorder hover:border-rose-400 text-botanical-text hover:text-rose-400"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${hasLiked ? "fill-white" : ""} ${
                  isLiking ? "animate-pulse" : ""
                }`}
              />
              <span>{hasLiked ? "Liked" : "Like Tip"}</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-black/20">
                {tip.likesCount.toString()}
              </span>
            </button>

            {/* Author Delete button */}
            {isAuthor && (
              <button
                onClick={() => {
                  onDelete(tip.id);
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs sm:text-sm font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove Tip from Botchain</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

