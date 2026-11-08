"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Loader2, X, ExternalLink } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "loading" | "info";
  title: string;
  message?: string;
  txHash?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function NotificationToast({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <aside aria-label="Notifications" className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
            toast.type === "success"
              ? "bg-[#162719]/95 border-botanical-accent/40 text-botanical-text"
              : toast.type === "error"
              ? "bg-[#2A1515]/95 border-red-500/40 text-red-100"
              : toast.type === "loading"
              ? "bg-[#1E2B20]/95 border-botanical-accent/30 text-botanical-text"
              : "bg-[#1E2B20]/95 border-botanical-cardBorder text-botanical-text"
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-botanical-accent" />
            )}
            {toast.type === "error" && (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            {toast.type === "loading" && (
              <Loader2 className="w-5 h-5 text-botanical-accent animate-spin" />
            )}
            {toast.type === "info" && (
              <CheckCircle2 className="w-5 h-5 text-botanical-subtext" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold tracking-wide">{toast.title}</h4>
            {toast.message && (
              <p className="text-xs text-botanical-subtext mt-1 leading-relaxed break-words">
                {toast.message}
              </p>
            )}
            {toast.txHash && (
              <a
                href={`https://scan.bohr.life/tx/${toast.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-botanical-accent hover:underline mt-2 font-mono"
              >
                <span>View on BohrScan</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-botanical-subtext hover:text-botanical-text p-1 transition-colors"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </aside>
  );
}

