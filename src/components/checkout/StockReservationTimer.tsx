"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@/components/common/Icons";

const RESERVATION_DURATION_SECONDS = 15 * 60; // 15 minutes
const STORAGE_KEY = "lumina_checkout_reservation_timestamp";

export function StockReservationTimer({ onItemCountChange }: { onItemCountChange?: () => void }) {
  const [timeLeft, setTimeLeft] = useState<number>(RESERVATION_DURATION_SECONDS);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    // Read or set initial reservation timestamp
    let targetTime: number;
    const stored = sessionStorage.getItem(STORAGE_KEY);

    if (stored) {
      targetTime = parseInt(stored, 10);
    } else {
      targetTime = Date.now() + RESERVATION_DURATION_SECONDS * 1000;
      sessionStorage.setItem(STORAGE_KEY, targetTime.toString());
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((targetTime - now) / 1000));
      setTimeLeft(diff);

      if (diff === 0) {
        setIsExpired(true);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRefreshReservation = () => {
    const newTarget = Date.now() + RESERVATION_DURATION_SECONDS * 1000;
    sessionStorage.setItem(STORAGE_KEY, newTarget.toString());
    setTimeLeft(RESERVATION_DURATION_SECONDS);
    setIsExpired(false);
    if (onItemCountChange) onItemCountChange();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  if (isExpired) {
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs flex flex-wrap items-center justify-between gap-3 text-amber-900 dark:text-amber-200">
        <div className="flex items-center gap-2">
          <Icon name="AlertCircle" className="h-5 w-5 text-amber-500 shrink-0" />
          <div>
            <p className="font-black">Inventory Lock Expired</p>
            <p className="text-[11px] text-amber-700 dark:text-amber-300">
              Items in your cart are no longer locked for checkout. Re-lock stock to guarantee availability.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleRefreshReservation}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold transition shadow-sm cursor-pointer"
        >
          Refresh Reservation
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/30 p-3.5 text-xs flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </div>
        <div>
          <span className="font-extrabold text-slate-900 dark:text-white">
            ⚡ Inventory Reserved & Locked
          </span>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Stock held exclusively for your active checkout session
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 font-mono font-black text-sm px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
        <Icon name="Clock" className="h-4 w-4 stroke-[2.5]" />
        <span>{formattedTime}</span>
      </div>
    </div>
  );
}
