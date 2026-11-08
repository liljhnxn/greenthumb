"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Sparkles, Image as ImageIcon, Loader2, Sprout, Wand2 } from "lucide-react";
import { CATEGORIES } from "./CategoryFilter";

interface ShareTipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    plantName: string;
    category: string;
    description: string;
    imageUrl: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

const PRESET_TIPS = [
  {
    title: "How to Avoid Yellow Leaves on Monstera",
    plantName: "Monstera Deliciosa",
    category: "Indoor Plants",
    description:
      "Yellowing leaves are usually a sign of overwatering or inconsistent moisture. Allow the top 2-3 inches of chunky aerated soil (mix coco coir, perlite, orchid bark) to dry out. Provide bright indirect light and wipe leaves monthly.",
    imageUrl:
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Pruning Tomato Suckers for Heavy Harvests",
    plantName: "Solanum lycopersicum",
    category: "Vegetables",
    description:
      "Pinch off the diagonal side shoots (suckers) growing between the main stem and leaf branches while they are 2-4 inches long. This channels energy directly into fruit clusters and increases airflow, preventing fungal blight.",
    imageUrl:
      "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Reviving Dehydrated Succulents with Bottom Watering",
    plantName: "Echeveria Elegans",
    category: "Indoor Plants",
    description:
      "If succulent leaves are wrinkled and soil is hydrophobic, place the potted succulent in a tray with 2 inches of water for 45 minutes. The roots will draw moisture upward through capillary action without rotting the crown.",
    imageUrl:
      "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Reblooming Phalaenopsis Orchids",
    plantName: "Phalaenopsis Orchid",
    category: "Flowers",
    description:
      "Once blooms fade, cut the flower spike just above the second node if still green. Move the orchid to a spot with a 10°F nighttime temperature drop for 3-4 weeks to trigger a fresh flower spike.",
    imageUrl:
      "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=1000&q=80",
  },
];

export function ShareTipModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: ShareTipModalProps) {
  const [title, setTitle] = useState("");
  const [plantName, setPlantName] = useState("");
  const [category, setCategory] = useState<string>("Indoor Plants");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imgPreviewError, setImgPreviewError] = useState(false);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof PRESET_TIPS[0]) => {
    setTitle(preset.title);
    setPlantName(preset.plantName);
    setCategory(preset.category);
    setDescription(preset.description);
    setImageUrl(preset.imageUrl);
    setImgPreviewError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !plantName.trim() || !category || !description.trim()) {
      return;
    }
    await onSubmit({
      title: title.trim(),
      plantName: plantName.trim(),
      category,
      description: description.trim(),
      imageUrl: imageUrl.trim(),
    });
  };

  const validCategories = CATEGORIES.filter((c) => c !== "All");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-botanical-card border border-botanical-accent/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-botanical-cardBorder flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#152317] border border-botanical-accent/40 flex items-center justify-center text-botanical-accent">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-botanical-text">
                Share a Gardening Tip
              </h2>
              <p className="text-xs text-botanical-subtext">
                Publish your plant knowledge permanently on Botchain Testnet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-botanical-subtext hover:text-botanical-text p-2 rounded-lg hover:bg-[#253628] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Presets / Inspiration Pills */}
        <div className="px-6 py-3 bg-[#152317]/80 border-b border-botanical-cardBorder/60 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs text-botanical-accent font-medium whitespace-nowrap shrink-0">
            <Wand2 className="w-3.5 h-3.5" />
            <span>Need inspiration?</span>
          </div>
          <div className="flex items-center gap-2">
            {PRESET_TIPS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="px-2.5 py-1 rounded-lg text-xs bg-botanical-card border border-botanical-cardBorder hover:border-botanical-accent/50 text-botanical-subtext hover:text-botanical-text whitespace-nowrap transition-colors"
              >
                {preset.plantName}
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Plant Botanical Name */}
            <div>
              <label className="block text-xs font-semibold text-botanical-subtext uppercase tracking-wider mb-1.5">
                Plant Name <span className="text-botanical-accent">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Monstera Deliciosa, Basil"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-botanical-bg border border-botanical-cardBorder text-botanical-text text-sm focus:outline-none focus:border-botanical-accent"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-botanical-subtext uppercase tracking-wider mb-1.5">
                Category <span className="text-botanical-accent">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-botanical-bg border border-botanical-cardBorder text-botanical-text text-sm focus:outline-none focus:border-botanical-accent"
              >
                {validCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tip Title */}
          <div>
            <label className="block text-xs font-semibold text-botanical-subtext uppercase tracking-wider mb-1.5">
              Tip Title <span className="text-botanical-accent">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Proper Drainage & Soil Mix for Healthy Roots"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-botanical-bg border border-botanical-cardBorder text-botanical-text text-sm focus:outline-none focus:border-botanical-accent"
            />
          </div>

          {/* Detailed Experience / Description */}
          <div>
            <label className="block text-xs font-semibold text-botanical-subtext uppercase tracking-wider mb-1.5">
              Gardening Experience & Instructions <span className="text-botanical-accent">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe your practical advice, watering frequency, sunlight requirements, pruning techniques, or soil composition..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-botanical-bg border border-botanical-cardBorder text-botanical-text text-sm focus:outline-none focus:border-botanical-accent resize-none leading-relaxed"
            />
          </div>

          {/* Image URL (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-botanical-subtext uppercase tracking-wider mb-1.5">
              Plant Image URL (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImgPreviewError(false);
                }}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-botanical-bg border border-botanical-cardBorder text-botanical-text text-sm focus:outline-none focus:border-botanical-accent"
              />
            </div>
            <p className="text-[11px] text-botanical-muted mt-1">
              Provide a direct image URL (Unsplash, Imgur, or direct plant photo link).
            </p>

            {/* Live Image Thumbnail Preview */}
            {imageUrl && !imgPreviewError && (
              <div className="mt-3 relative w-full h-32 rounded-xl overflow-hidden border border-botanical-cardBorder bg-[#152317]">
                <Image
                  src={imageUrl}
                  alt="Plant preview"
                  fill
                  className="object-cover"
                  onError={() => setImgPreviewError(true)}
                  unoptimized
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] bg-black/70 text-botanical-accent flex items-center gap-1 font-mono">
                  <ImageIcon className="w-3 h-3" />
                  <span>Preview</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-botanical-cardBorder/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-botanical-card border border-botanical-cardBorder text-botanical-subtext hover:text-botanical-text text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-botanical-accent text-botanical-bg font-semibold text-sm hover:bg-botanical-accentHover transition-all shadow-lg shadow-botanical-accent/20 flex items-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing on Botchain...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Publish Tip</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

