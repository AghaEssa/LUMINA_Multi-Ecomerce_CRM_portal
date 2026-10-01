"use client";

import React from "react";
import { Icon } from "@/components/common/Icons";
import { useAuth } from "@/context/AuthContext";

export function Security2FAModal() {
  const { user, isSecurityModalOpen, closeSecurityModal } = useAuth();

  if (!isSecurityModalOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <Icon name="ShieldCheck" className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Account & 2FA Security</h3>
              <p className="text-xs text-slate-400 font-medium">Enterprise Security Powered by Clerk & Google</p>
            </div>
          </div>

          <button
            onClick={closeSecurityModal}
            className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Active Protection Status */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <span className="text-xs font-black text-emerald-900 dark:text-emerald-300 block">Security Status: Active & Protected</span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Session token & Google OAuth 2FA active</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[10px] font-black uppercase">
              Protected
            </span>
          </div>

          {/* Security Features Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Active Security Layers</h4>

            {/* Feature 1: Google OAuth 2FA */}
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                G
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">Google OAuth 2FA</h5>
                  <span className="px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 text-[9px] font-black">
                    RECOMMENDED
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  When logging in via &quot;Continue with Google&quot;, your account is automatically secured by Google Authenticator, device prompt, or SMS 2FA.
                </p>
              </div>
            </div>

            {/* Feature 2: Password Encryption & Token Validation */}
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Icon name="Lock" className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">Encrypted Session Tokens</h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  Clerk manages state-of-the-art JWT session tokens, protecting your Lumina cart, orders, and wallet balance against unauthorized access.
                </p>
              </div>
            </div>
          </div>

          {/* Account Metadata */}
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-mono">
            <span>Account Email:</span>
            <span className="font-bold text-slate-900 dark:text-slate-200">{user.email}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex justify-end">
          <button
            onClick={closeSecurityModal}
            className="px-6 py-2 rounded-xl bg-slate-900 dark:bg-amber-400 hover:bg-slate-800 dark:hover:bg-amber-300 text-white dark:text-slate-950 font-black text-xs transition shadow-sm cursor-pointer"
          >
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  );
}
