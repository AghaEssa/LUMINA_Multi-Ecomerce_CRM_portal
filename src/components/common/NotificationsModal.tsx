"use client";

import React, { useState } from "react";
import { Icon } from "@/components/common/Icons";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: "order" | "offer" | "security" | "system";
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Welcome to Lumina Storefront!",
    message: "Thank you for joining. Explore our 8 main categories and enjoy exclusive member offers.",
    time: "Just now",
    unread: true,
    type: "system",
  },
  {
    id: "2",
    title: "2FA Security Available",
    message: "Enhance your account security by enabling Google Authenticator 2FA in your account portal.",
    time: "2 hours ago",
    unread: true,
    type: "security",
  },
  {
    id: "3",
    title: "Exclusive Multi-Category Discounts",
    message: "Get up to 25% OFF on premium clothing, ergonomic furniture, and smart electronics today.",
    time: "1 day ago",
    unread: false,
    type: "offer",
  },
];

type NotificationsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-scale-up flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-400/20 text-amber-500 font-bold">
              <Icon name="Bell" className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5">
                    {unreadCount} new
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400 font-medium">Updates & account activity</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white transition cursor-pointer"
          >
            <Icon name="X" className="h-5 w-5" />
          </button>
        </div>

        {/* Action Bar */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between px-5 py-2.5 bg-slate-100/60 dark:bg-slate-900/80 border-b border-slate-200/60 dark:border-slate-800 text-xs">
            <button
              onClick={markAllAsRead}
              className="text-ocean-700 dark:text-amber-400 font-bold hover:underline cursor-pointer"
            >
              Mark all as read
            </button>
            <button
              onClick={clearAll}
              className="text-rose-500 font-bold hover:underline cursor-pointer"
            >
              Clear notifications
            </button>
          </div>
        )}

        {/* List of Notifications */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {notifications.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="h-16 w-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400">
                <Icon name="Bell" className="h-8 w-8" />
              </div>
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No New Notifications</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                You&apos;re all caught up! Order alerts and account updates will appear right here.
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 ${
                  item.unread
                    ? "bg-amber-500/5 dark:bg-amber-400/5 border-amber-300/40 dark:border-amber-400/20"
                    : "bg-slate-50 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800"
                }`}
              >
                <div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                    item.type === "security"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : item.type === "offer"
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      : "bg-ocean-500/15 text-ocean-600 dark:text-ocean-400"
                  }`}
                >
                  <Icon
                    name={
                      item.type === "security"
                        ? "Lock"
                        : item.type === "offer"
                        ? "Tag"
                        : "Info"
                    }
                    className="h-4 w-4"
                  />
                </div>

                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {item.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-950 dark:bg-slate-800 text-white font-extrabold text-xs hover:bg-slate-800 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            Close Notifications
          </button>
        </div>

      </div>
    </div>
  );
}
