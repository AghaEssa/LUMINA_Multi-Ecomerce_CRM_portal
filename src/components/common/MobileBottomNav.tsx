"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/common/Icons";
import { useCartContext } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { productCount, openCart } = useCartContext();
  const { user } = useAuth();

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  const handleCategoriesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === "/") {
      const el = document.getElementById("categories");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    router.push("/categories");
  };

  const handleWatchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === "/") {
      const el = document.getElementById("trending") || document.getElementById("hero");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    router.push("/#trending");
  };

  const handleBagClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openCart();
  };

  const handleAccountClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      router.push("/account");
    } else {
      router.push("/login?callbackUrl=/account");
    }
  };

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: "Home" as const,
      href: "/",
      isActive: pathname === "/",
      onClick: handleHomeClick,
    },
    {
      id: "categories",
      label: "Categories",
      icon: "Grid" as const,
      href: "/categories",
      isActive: pathname.startsWith("/categories") || pathname.startsWith("/category"),
      onClick: handleCategoriesClick,
    },
    {
      id: "watch",
      label: "Watch",
      icon: "PlayCircle" as const,
      href: "/#trending",
      isActive: pathname === "/" && typeof window !== "undefined" && window.location.hash === "#trending",
      onClick: handleWatchClick,
    },
    {
      id: "bag",
      label: "Bag",
      icon: "ShoppingBag" as const,
      href: "/cart",
      isActive: pathname === "/cart",
      badge: productCount,
      onClick: handleBagClick,
    },
    {
      id: "account",
      label: "Account",
      icon: "User" as const,
      href: "/account",
      isActive: pathname === "/account" || pathname === "/profile",
      onClick: handleAccountClick,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#090e17]/95 backdrop-blur-lg border-t border-slate-200/90 dark:border-slate-800/90 px-2 py-1.5 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] transition-transform duration-200">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const active = item.isActive;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 relative cursor-pointer ${
                active
                  ? "text-sky-600 dark:text-amber-400 font-extrabold scale-105"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
              }`}
            >
              <div className="relative">
                <Icon
                  name={item.icon}
                  className={`h-5 w-5 transition-transform duration-200 ${
                    active ? "stroke-[2.5px] text-sky-600 dark:text-amber-400" : "stroke-[1.75px]"
                  }`}
                />
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2.5 h-4 min-w-[16px] px-1 rounded-full bg-amber-400 dark:bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
              {active && (
                <span className="absolute -bottom-1 h-1 w-4 rounded-full bg-[#0284c7] dark:bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
