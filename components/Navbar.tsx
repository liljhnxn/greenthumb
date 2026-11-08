"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { Sprout, Wallet, LogOut, ChevronDown, PlusCircle, AlertTriangle } from "lucide-react";
import { botchainTestnet } from "@/lib/contract";

interface NavbarProps {
  onOpenShareModal: () => void;
}

export function Navbar({ onOpenShareModal }: NavbarProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [showWalletMenu, setShowWalletMenu] = useState(false);

  const isWrongNetwork = isConnected && chainId !== botchainTestnet.id;

  const formatAddress = (addr?: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = () => {
    // Prefer MetaMask connector or first injected connector
    const mmConnector = connectors.find((c) => c.id === "metaMask") || connectors[0];
    if (mmConnector) {
      connect({ connector: mmConnector });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full botanical-glass border-b border-botanical-cardBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-botanical-card border border-botanical-accent/30 flex items-center justify-center shadow-lg shadow-black/20 text-botanical-accent group cursor-pointer">
            <Sprout className="w-6 h-6 transition-transform group-hover:scale-110 group-hover:rotate-6 text-botanical-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-serif font-bold text-botanical-text tracking-tight">
                GreenThumb
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-botanical-accent/15 text-botanical-accent border border-botanical-accent/30">
                Web3
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-botanical-subtext font-medium tracking-wide">
              Grow More. Share More.
            </p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Network Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-botanical-card border border-botanical-cardBorder text-xs text-botanical-subtext">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected
                  ? isWrongNetwork
                    ? "bg-amber-400 animate-pulse"
                    : "bg-emerald-400"
                  : "bg-neutral-500"
              }`}
            />
            <span>Botchain (968)</span>
          </div>

          {/* Share Tip CTA */}
          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl bg-botanical-accent text-botanical-bg font-semibold text-xs sm:text-sm hover:bg-botanical-accentHover transition-all shadow-md shadow-botanical-accent/20 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden xs:inline">Share Tip</span>
            <span className="xs:hidden">Share</span>
          </button>

          {/* Network Switch Prompt if Wrong Network */}
          {isWrongNetwork && (
            <button
              onClick={() => switchChain({ chainId: botchainTestnet.id })}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-medium hover:bg-amber-500/30 transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Switch Chain</span>
            </button>
          )}

          {/* Wallet Connection */}
          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isPending}
              className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl bg-botanical-card border border-botanical-accent/30 text-botanical-text text-xs sm:text-sm font-medium hover:border-botanical-accent hover:bg-botanical-cardHover transition-all"
            >
              <Wallet className="w-4 h-4 text-botanical-accent" />
              <span>{isPending ? "Connecting..." : "Connect Wallet"}</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowWalletMenu(!showWalletMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-botanical-card border border-botanical-cardBorder hover:border-botanical-accent/40 text-xs sm:text-sm font-medium transition-all"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-botanical-accent" />
                <span className="font-mono text-botanical-text">
                  {formatAddress(address)}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-botanical-subtext" />
              </button>

              {showWalletMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-botanical-card border border-botanical-cardBorder shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-botanical-cardBorder/60">
                    <p className="text-[11px] text-botanical-subtext uppercase tracking-wider">
                      Connected Account
                    </p>
                    <p className="text-xs font-mono text-botanical-text truncate mt-0.5">
                      {address}
                    </p>
                  </div>

                  <a
                    href={`https://scan.bohr.life/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-3 py-2 text-xs text-botanical-subtext hover:text-botanical-accent hover:bg-[#253628] rounded-lg flex items-center justify-between transition-colors mt-1"
                  >
                    <span>View on Explorer</span>
                    <span className="text-[10px] text-botanical-subtext font-mono">BohrScan</span>
                  </a>

                  <button
                    onClick={() => {
                      disconnect();
                      setShowWalletMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2 transition-colors mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

