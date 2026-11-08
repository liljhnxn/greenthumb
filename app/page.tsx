"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from "wagmi";
import {
  Sprout,
  PlusCircle,
  Sparkles,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Heart,
  BookOpen,
} from "lucide-react";

import {
  GREEN_THUMB_CONTRACT_ADDRESS,
  GREEN_THUMB_ABI,
  RawTip,
  botchainTestnet,
} from "@/lib/contract";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CategoryFilter, Category } from "@/components/CategoryFilter";
import { TipCard } from "@/components/TipCard";
import { ShareTipModal } from "@/components/ShareTipModal";
import { TipDetailModal } from "@/components/TipDetailModal";
import { NotificationToast, ToastMessage } from "@/components/NotificationToast";

// Initial community tips to display when contract on-chain is brand new / 0 tips
const INITIAL_FEATURED_TIPS: RawTip[] = [
  {
    id: BigInt(1),
    author: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
    title: "Mastering Humidity for Fiddle Leaf Fig",
    plantName: "Ficus Lyrata",
    category: "Indoor Plants",
    description:
      "Fiddle leaf figs thrive at 40-60% ambient humidity. Wipe leaves weekly with room-temperature water and neem oil to clear dust, allowing full photosynthesis. Never rotate frequently once they acclimate to a bright eastern window.",
    imageUrl:
      "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1000&q=80",
    timestamp: BigInt(1710000000),
    likesCount: BigInt(14),
    exists: true,
  },
  {
    id: BigInt(2),
    author: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    title: "Organic Pest Deterrent: Neem & Castile Soap Formula",
    plantName: "General Plant Care",
    category: "Plant Care",
    description:
      "For spider mites and fungus gnats: Mix 1 quart lukewarm water, 1 tsp cold-pressed organic neem oil, and 1/2 tsp pure Castile soap. Spray undersides of leaves at dusk every 5 days for three cycles.",
    imageUrl:
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80",
    timestamp: BigInt(1710086400),
    likesCount: BigInt(28),
    exists: true,
  },
  {
    id: BigInt(3),
    author: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    title: "Pruning Cherry Tomatoes for Maximum Sweetness",
    plantName: "Solanum Lycopersicum",
    category: "Vegetables",
    description:
      "Remove suckers below the first flowering cluster on indeterminate varieties. Mulch with straw to retain steady root moisture; irregular watering causes blossom end rot and split skins.",
    imageUrl:
      "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=1000&q=80",
    timestamp: BigInt(1710172800),
    likesCount: BigInt(19),
    exists: true,
  },
  {
    id: BigInt(4),
    author: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    title: "Orchid Air Root Care & Re-Blooms",
    plantName: "Phalaenopsis Orchid",
    category: "Flowers",
    description:
      "Silver-gray roots indicate thirst; vibrant green roots mean hydrated. Never bury aerial roots in moss. Give a 10-degree cooler nighttime environment in autumn to trigger dormant flower buds.",
    imageUrl:
      "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=1000&q=80",
    timestamp: BigInt(1710259200),
    likesCount: BigInt(35),
    exists: true,
  },
  {
    id: BigInt(5),
    author: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4df",
    title: "Chunky Aroid Soil Recipe for Monsteras & Monster Pothos",
    plantName: "Monstera Deliciosa",
    category: "Indoor Plants",
    description:
      "Combine 40% premium coco coir, 25% medium orchid bark, 20% coarse perlite, 10% worm castings, and 5% horticultural charcoal. Roots breathe freely and never experience root rot.",
    imageUrl:
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1000&q=80",
    timestamp: BigInt(1710345600),
    likesCount: BigInt(42),
    exists: true,
  },
  {
    id: BigInt(6),
    author: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    title: "Hydrangea Color Manipulation Through Soil Chemistry",
    plantName: "Hydrangea Macrophylla",
    category: "Outdoor Plants",
    description:
      "For vivid blue blooms, lower soil pH to 5.2-5.5 by adding aluminum sulfate. For soft pink to red flowers, raise pH to 6.5 or higher with dolomitic garden lime. Keep soil consistently moist.",
    imageUrl:
      "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=1000&q=80",
    timestamp: BigInt(1710432000),
    likesCount: BigInt(22),
    exists: true,
  },
];

export default function GreenThumbApp() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();

  // Navigation & Modals state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedTip, setSelectedTip] = useState<RawTip | null>(null);

  // Filters & Tabs
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "myTips">("all");

  // Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // State for user liked tips cache (tipId -> boolean)
  const [userLikesMap, setUserLikesMap] = useState<Record<string, boolean>>({});
  const [pendingLikeTipId, setPendingLikeTipId] = useState<bigint | null>(null);

  const exploreSectionRef = useRef<HTMLDivElement>(null);

  // 1. Read all active tips on-chain
  const {
    data: onChainTipsData,
    isLoading: isLoadingTips,
    refetch: refetchTips,
  } = useReadContract({
    address: GREEN_THUMB_CONTRACT_ADDRESS,
    abi: GREEN_THUMB_ABI,
    functionName: "getAllTips",
  });

  // 2. Read total tips count on-chain
  const { data: totalTipsOnChain, refetch: refetchTotalTips } = useReadContract({
    address: GREEN_THUMB_CONTRACT_ADDRESS,
    abi: GREEN_THUMB_ABI,
    functionName: "totalTips",
  });

  // 3. Read total likes count on-chain
  const { data: totalLikesOnChain, refetch: refetchTotalLikes } = useReadContract({
    address: GREEN_THUMB_CONTRACT_ADDRESS,
    abi: GREEN_THUMB_ABI,
    functionName: "totalLikes",
  });

  // 4. Contract write hook
  const {
    writeContractAsync,
    isPending: isWritePending,
    data: submittedTxHash,
  } = useWriteContract();

  // 5. Transaction receipt tracker
  const { isLoading: isWaitingForReceipt, isSuccess: isTxSuccess } =
    useWaitForTransactionReceipt({
      hash: submittedTxHash,
    });

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);

    if (toast.type !== "loading") {
      setTimeout(() => {
        dismissToast(id);
      }, 7000);
    }
    return id;
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Convert on-chain tips or fallback
  const allTips: RawTip[] = useMemo(() => {
    if (
      onChainTipsData &&
      Array.isArray(onChainTipsData) &&
      onChainTipsData.length > 0
    ) {
      return onChainTipsData.map((t: any) => ({
        id: BigInt(t.id),
        author: t.author,
        title: t.title,
        plantName: t.plantName,
        category: t.category,
        description: t.description,
        imageUrl: t.imageUrl,
        timestamp: BigInt(t.timestamp),
        likesCount: BigInt(t.likesCount),
        exists: Boolean(t.exists),
      }));
    }
    return INITIAL_FEATURED_TIPS;
  }, [onChainTipsData]);

  // Sync user likes for tips from contract
  useEffect(() => {
    let isCancelled = false;

    async function checkLikes() {
      if (!publicClient || !address || allTips.length === 0) return;

      const newLikes: Record<string, boolean> = {};

      for (const tip of allTips) {
        try {
          const hasLiked = await publicClient.readContract({
            address: GREEN_THUMB_CONTRACT_ADDRESS,
            abi: GREEN_THUMB_ABI,
            functionName: "hasUserLiked",
            args: [tip.id, address],
          });
          newLikes[tip.id.toString()] = Boolean(hasLiked);
        } catch {
          // If contract call fails or not deployed yet, default to false
          newLikes[tip.id.toString()] = false;
        }
      }

      if (!isCancelled) {
        setUserLikesMap(newLikes);
      }
    }

    checkLikes();
    return () => {
      isCancelled = true;
    };
  }, [publicClient, address, allTips]);

  // Aggregate stats
  const displayTotalTips = useMemo(() => {
    if (totalTipsOnChain !== undefined && totalTipsOnChain !== null) {
      return Number(totalTipsOnChain);
    }
    return allTips.length;
  }, [totalTipsOnChain, allTips]);

  const displayTotalLikes = useMemo(() => {
    if (totalLikesOnChain !== undefined && totalLikesOnChain !== null) {
      return Number(totalLikesOnChain);
    }
    return allTips.reduce((acc, tip) => acc + Number(tip.likesCount), 0);
  }, [totalLikesOnChain, allTips]);

  // Filtered tips based on Category, Tab (All vs MyTips), and Search Query
  const filteredTips = useMemo(() => {
    return allTips.filter((tip) => {
      // 1. Tab filter
      if (activeTab === "myTips") {
        if (!address) return false;
        if (tip.author.toLowerCase() !== address.toLowerCase()) return false;
      }

      // 2. Category filter
      if (selectedCategory !== "All" && tip.category !== selectedCategory) {
        return false;
      }

      // 3. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = tip.title.toLowerCase().includes(query);
        const matchesPlant = tip.plantName.toLowerCase().includes(query);
        const matchesDesc = tip.description.toLowerCase().includes(query);
        const matchesCat = tip.category.toLowerCase().includes(query);
        return matchesTitle || matchesPlant || matchesDesc || matchesCat;
      }

      return true;
    });
  }, [allTips, activeTab, selectedCategory, searchQuery, address]);

  const myTipsCount = useMemo(() => {
    if (!address) return 0;
    return allTips.filter(
      (tip) => tip.author.toLowerCase() === address.toLowerCase()
    ).length;
  }, [allTips, address]);

  // Publish Tip Handler
  const handlePublishTip = async (formData: {
    title: string;
    plantName: string;
    category: string;
    description: string;
    imageUrl: string;
  }) => {
    if (!isConnected) {
      addToast({
        type: "error",
        title: "Wallet Not Connected",
        message: "Please connect your MetaMask or Web3 wallet to publish a tip on Botchain.",
      });
      return;
    }

    const toastId = addToast({
      type: "loading",
      title: "Publishing Tip to Botchain...",
      message: "Please confirm the transaction in your wallet.",
    });

    try {
      const hash = await writeContractAsync({
        address: GREEN_THUMB_CONTRACT_ADDRESS,
        abi: GREEN_THUMB_ABI,
        functionName: "publishTip",
        args: [
          formData.title,
          formData.plantName,
          formData.category,
          formData.description,
          formData.imageUrl,
        ],
      });

      dismissToast(toastId);

      addToast({
        type: "success",
        title: "Gardening Tip Published! 🌱",
        message: "Your gardening advice has been permanently etched on Botchain Testnet.",
        txHash: hash,
      });

      setIsShareModalOpen(false);

      // Refresh contract state
      refetchTips();
      refetchTotalTips();
      refetchTotalLikes();
    } catch (err: any) {
      dismissToast(toastId);
      console.error("Publish error:", err);
      addToast({
        type: "error",
        title: "Publishing Failed",
        message:
          err?.shortMessage ||
          err?.message ||
          "User rejected transaction or gas estimation failed.",
      });
    }
  };

  // Like / Unlike Handler
  const handleLikeTip = async (tipId: bigint, isCurrentlyLiked: boolean) => {
    if (!isConnected) {
      addToast({
        type: "error",
        title: "Wallet Not Connected",
        message: "Connect your wallet to like gardening tips on Botchain.",
      });
      return;
    }

    setPendingLikeTipId(tipId);

    const actionText = isCurrentlyLiked ? "Unliking" : "Liking";
    const toastId = addToast({
      type: "loading",
      title: `${actionText} Tip...`,
      message: `Confirming ${actionText.toLowerCase()} on Botchain Testnet...`,
    });

    try {
      const hash = await writeContractAsync({
        address: GREEN_THUMB_CONTRACT_ADDRESS,
        abi: GREEN_THUMB_ABI,
        functionName: isCurrentlyLiked ? "unlikeTip" : "likeTip",
        args: [tipId],
      });

      dismissToast(toastId);

      setUserLikesMap((prev) => ({
        ...prev,
        [tipId.toString()]: !isCurrentlyLiked,
      }));

      addToast({
        type: "success",
        title: isCurrentlyLiked ? "Tip Unliked" : "Appreciation Recorded! 🌿",
        message: isCurrentlyLiked
          ? "You unliked this tip."
          : "You liked this gardening tip on-chain.",
        txHash: hash,
      });

      // Refetch tips and counters
      refetchTips();
      refetchTotalLikes();
    } catch (err: any) {
      dismissToast(toastId);
      console.error("Like error:", err);
      addToast({
        type: "error",
        title: "Action Failed",
        message:
          err?.shortMessage ||
          err?.message ||
          "Transaction rejected or already liked.",
      });
    } finally {
      setPendingLikeTipId(null);
    }
  };

  // Delete Tip Handler
  const handleDeleteTip = async (tipId: bigint) => {
    if (!isConnected) {
      addToast({
        type: "error",
        title: "Wallet Not Connected",
        message: "Please connect your wallet to manage your tips.",
      });
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to remove this tip from Botchain? This action cannot be undone."
    );
    if (!confirmed) return;

    const toastId = addToast({
      type: "loading",
      title: "Removing Tip from Botchain...",
      message: "Please confirm the transaction in your wallet.",
    });

    try {
      const hash = await writeContractAsync({
        address: GREEN_THUMB_CONTRACT_ADDRESS,
        abi: GREEN_THUMB_ABI,
        functionName: "removeTip",
        args: [tipId],
      });

      dismissToast(toastId);

      addToast({
        type: "success",
        title: "Tip Removed Successfully",
        message: "The gardening tip has been deleted from Botchain.",
        txHash: hash,
      });

      if (selectedTip && selectedTip.id === tipId) {
        setSelectedTip(null);
      }

      refetchTips();
      refetchTotalTips();
      refetchTotalLikes();
    } catch (err: any) {
      dismissToast(toastId);
      console.error("Delete error:", err);
      addToast({
        type: "error",
        title: "Removal Failed",
        message:
          err?.shortMessage ||
          err?.message ||
          "Only the author can remove their tip.",
      });
    }
  };

  const handleScrollToExplore = () => {
    exploreSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-botanical-bg flex flex-col selection:bg-botanical-accent selection:text-botanical-bg">
      {/* 1. Header Navigation */}
      <Navbar onOpenShareModal={() => setIsShareModalOpen(true)} />

      {/* 2. Hero Section */}
      <Hero
        totalTips={displayTotalTips}
        totalLikes={displayTotalLikes}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onScrollToExplore={handleScrollToExplore}
      />

      {/* 3. Main Exploration & Tips Section */}
      <main
        ref={exploreSectionRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex-1 w-full space-y-10"
      >
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-botanical-cardBorder pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-botanical-accent font-semibold uppercase tracking-wider mb-1">
              <Sprout className="w-3.5 h-3.5" />
              <span>Community Knowledge Base</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-botanical-text">
              Explore Gardening Tips
            </h2>
            <p className="text-xs sm:text-sm text-botanical-subtext mt-1">
              Practical advice, soil secrets, and plant-growing experiences stored transparently on-chain.
            </p>
          </div>

          {/* Quick Refresh Button */}
          <button
            onClick={() => {
              refetchTips();
              refetchTotalTips();
              refetchTotalLikes();
              addToast({
                type: "info",
                title: "Refreshed Data",
                message: "Fetched latest updates from Botchain Testnet.",
              });
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-botanical-card border border-botanical-cardBorder hover:border-botanical-accent/40 text-xs text-botanical-subtext hover:text-botanical-text transition-all self-start sm:self-auto"
            title="Refresh on-chain tips"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoadingTips ? "animate-spin text-botanical-accent" : ""}`}
            />
            <span>Sync Contract</span>
          </button>
        </div>

        {/* 4. Category Filters & Tab Switcher */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          totalTipsCount={allTips.length}
          myTipsCount={myTipsCount}
          filteredCount={filteredTips.length}
        />

        {/* 5. Tips Grid */}
        {filteredTips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredTips.map((tip) => (
              <TipCard
                key={tip.id.toString()}
                tip={tip}
                currentAddress={address}
                hasLiked={Boolean(userLikesMap[tip.id.toString()])}
                onLike={handleLikeTip}
                onSelect={setSelectedTip}
                onDelete={handleDeleteTip}
                isLiking={pendingLikeTipId === tip.id}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-16 px-4 text-center rounded-3xl bg-botanical-card border border-botanical-cardBorder flex flex-col items-center justify-center max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#152317] border border-botanical-accent/30 flex items-center justify-center text-botanical-accent">
              <Sprout className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-serif font-bold text-botanical-text">
                {activeTab === "myTips"
                  ? isConnected
                    ? "You haven't shared any tips yet"
                    : "Connect wallet to view your tips"
                  : "No gardening tips found"}
              </h3>
              <p className="text-xs sm:text-sm text-botanical-subtext max-w-sm">
                {activeTab === "myTips"
                  ? isConnected
                    ? "Share your first plant experience or soil wisdom with the community!"
                    : "Please connect your MetaMask wallet to see your published gardening tips."
                  : searchQuery
                  ? `No tips match your search for "${searchQuery}". Try adjusting your keywords or category filter.`
                  : "Be the very first gardener to contribute to GreenThumb on Botchain!"}
              </p>
            </div>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="mt-2 px-5 py-2.5 rounded-xl bg-botanical-accent text-botanical-bg font-semibold text-xs sm:text-sm hover:bg-botanical-accentHover transition-all flex items-center gap-2 shadow-lg shadow-botanical-accent/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Share a Gardening Tip</span>
            </button>
          </div>
        )}
      </main>

      {/* 6. Footer */}
      <footer className="border-t border-botanical-cardBorder bg-[#0E150F] py-12 mt-16 text-botanical-subtext text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-botanical-card border border-botanical-accent/30 flex items-center justify-center text-botanical-accent">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-serif font-bold text-botanical-text">
                GreenThumb
              </p>
              <p className="text-[11px] text-botanical-subtext">
                Grow More. Share More.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-center">
            <div className="flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-botanical-accent" />
              <span>Botchain Testnet (Chain ID 968)</span>
            </div>
            <a
              href="https://scan.bohr.life"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-botanical-accent flex items-center gap-1 transition-colors"
            >
              <span>BohrScan Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={`https://scan.bohr.life/address/${GREEN_THUMB_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-botanical-accent flex items-center gap-1 font-mono transition-colors"
            >
              <span>Contract Address</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <p className="text-[11px] text-botanical-muted">
            100% On-Chain Gardening Knowledge
          </p>
        </div>
      </footer>

      {/* 7. Share a Gardening Tip Modal */}
      <ShareTipModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onSubmit={handlePublishTip}
        isSubmitting={isWritePending || isWaitingForReceipt}
      />

      {/* 8. Tip Details Modal */}
      <TipDetailModal
        tip={selectedTip}
        onClose={() => setSelectedTip(null)}
        currentAddress={address}
        hasLiked={
          selectedTip ? Boolean(userLikesMap[selectedTip.id.toString()]) : false
        }
        onLike={handleLikeTip}
        onDelete={handleDeleteTip}
        isLiking={selectedTip ? pendingLikeTipId === selectedTip.id : false}
      />

      {/* 9. Floating Notifications / Toasts */}
      <NotificationToast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

