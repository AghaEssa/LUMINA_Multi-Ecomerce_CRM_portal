"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@/components/common/Icons";

export function OfflineGuard({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    // Initial check
    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const handleRetry = async () => {
    setIsChecking(true);
    
    // Simulate network check / real check
    if (typeof window !== "undefined" && navigator.onLine) {
      // Ping check to confirm internet connectivity
      try {
        await fetch("/api/health", { method: "HEAD", cache: "no-store" }).catch(() => {});
        setIsOffline(false);
      } catch {
        // If fetch fails, keep offline
        setIsOffline(true);
      }
    } else {
      setIsOffline(true);
    }

    setTimeout(() => {
      setIsChecking(false);
    }, 600);
  };

  // Prevent SSR hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  if (isOffline) {
    return (
      <div className="fixed inset-0 z-[99999] bg-white dark:bg-[#060b13] flex flex-col items-center justify-center p-6 text-center animate-fade-in font-sans">
        <div className="max-w-md w-full space-y-2">
          {/* Red Circle Offline Icon */}
          <div className="h-20 w-20 rounded-full bg-[#ef4444] text-white flex items-center justify-center shadow-lg shadow-red-500/20 mx-auto mb-6">
            <Icon name="WifiOff" className="h-10 w-10 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            No Internet Connection
          </h1>

          {/* Subtitle Badge */}
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-6">
            <Icon name="AlertCircle" className="h-3.5 w-3.5 text-slate-400" />
            <span>Connection Lost</span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm mx-auto mb-8">
            Please check your internet connection and try again.
            <br />
            Make sure you&apos;re connected to a network.
          </p>

          {/* Try Again Button */}
          <div>
            <button
              onClick={handleRetry}
              disabled={isChecking}
              className="px-10 py-3 rounded-2xl bg-[#f59e0b] hover:bg-[#d97706] active:scale-95 text-slate-950 font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2.5 mx-auto cursor-pointer disabled:opacity-75"
            >
              <Icon name="RefreshCw" className={`h-4 w-4 ${isChecking ? "animate-spin" : ""}`} />
              <span>{isChecking ? "Checking Connection..." : "Try Again"}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200/80 dark:border-slate-800 w-full max-w-xs mx-auto my-8" />

          {/* Footer Note */}
          <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs mx-auto leading-relaxed">
            If the problem persists, check your network settings or contact your network administrator.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
