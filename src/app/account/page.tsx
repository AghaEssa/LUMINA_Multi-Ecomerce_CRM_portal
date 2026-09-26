"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/common/Header";
import { SiteFooter } from "@/components/common/Footer";
import { Icon } from "@/components/common/Icons";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCartContext } from "@/context/CartContext";
import { Security2FAModal } from "@/components/common/Security2FAModal";
import { ProfileModal } from "@/components/common/ProfileModal";
import { NotificationsModal } from "@/components/common/NotificationsModal";

type AccountTab =
  | "account"
  | "orders"
  | "addresses"
  | "wishlist"
  | "wallet"
  | "shopping-list"
  | "refer"
  | "transactions"
  | "notifications"
  | "support";

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, logout, openProfileModal, openSecurityModal } = useAuth();
  const { wishlistCount, wishlistItems, toggleWishlist } = useWishlist();
  const { cartCount, productCount, openCart, addToCart } = useCartContext();

  const [activeTab, setActiveTab] = useState<AccountTab>("account");
  const [copiedReferral, setCopiedReferral] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get("tab") as AccountTab;
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Address state management
  const [addresses, setAddresses] = useState([
    {
      id: "1",
      name: "Home Address",
      recipient: user?.name || "Agha Essa Khan",
      street: "Bhuj, Gujarat",
      city: "Bhuj",
      state: "Gujarat",
      country: "India",
      zip: "370001",
      isDefault: true,
    },
  ]);
  const [newAddress, setNewAddress] = useState({ name: "", street: "", city: "", state: "", zip: "" });
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  // Shopping list state
  const [shoppingList, setShoppingList] = useState<string[]>([
    "Sofa Set for Living Room",
    "Smart Watch Series 9",
    "Ergonomic Office Chair",
  ]);
  const [newItemInput, setNewItemInput] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login?callbackUrl=/account");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Loading My Account Portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleCopyReferral = () => {
    const code = `https://lumina-store.com/register?ref=${user.email.split("@")[0].toUpperCase()}`;
    navigator.clipboard.writeText(code);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2500);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city) return;
    setAddresses([
      ...addresses,
      {
        id: Date.now().toString(),
        name: newAddress.name || "Secondary Address",
        recipient: user.name || "Agha Essa Khan",
        street: newAddress.street,
        city: newAddress.city,
        state: newAddress.state || "Gujarat",
        country: "India",
        zip: newAddress.zip || "370001",
        isDefault: false,
      },
    ]);
    setNewAddress({ name: "", street: "", city: "", state: "", zip: "" });
    setShowAddAddressModal(false);
  };

  const handleAddShoppingItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemInput.trim()) return;
    setShoppingList([...shoppingList, newItemInput.trim()]);
    setNewItemInput("");
  };

  const sidebarLinks = [
    { id: "account" as AccountTab, label: "My Account", icon: "User" as const },
    { id: "orders" as AccountTab, label: "My Orders", icon: "Package" as const },
    { id: "addresses" as AccountTab, label: "Addresses", icon: "MapPin" as const },
    { id: "wishlist" as AccountTab, label: "My Wishlists", icon: "Heart" as const },
    { id: "wallet" as AccountTab, label: "Wallet", icon: "Wallet" as const },
    { id: "transactions" as AccountTab, label: "Transactions", icon: "CreditCard" as const },
    { id: "notifications" as AccountTab, label: "Notifications", icon: "Bell" as const },
    { id: "support" as AccountTab, label: "Support", icon: "HelpCircle" as const },
    { id: "refer" as AccountTab, label: "Refer & Earn", icon: "Gift" as const },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#060b13] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
        
        {/* 1. User Banner Header Card (Compact & Sleek) */}
        <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 p-3 sm:p-4 shadow-2xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-[#fef3c7] dark:bg-amber-400/20 border-2 border-[#f59e0b] text-[#d97706] dark:text-amber-400 font-extrabold text-base sm:text-lg flex items-center justify-center shadow-2xs shrink-0">
              {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
            </div>

            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                {user.name || user.email.split("@")[0]}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
            </div>
          </div>

          <button
            onClick={openProfileModal}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-amber-300/80 bg-amber-50 dark:bg-amber-400/10 hover:bg-amber-100 text-[#d97706] dark:text-amber-400 text-xs font-extrabold transition cursor-pointer shrink-0"
          >
            <span>✏️</span>
            <span className="hidden sm:inline">Edit profile</span>
            <span className="sm:hidden">Edit</span>
          </button>
        </div>

        {/* 2. Horizontal Tab Navigation Slider (Only for mobile view) */}
        <div className="lg:hidden overflow-x-auto pb-1 -mx-2 px-2 flex items-center gap-2 no-scrollbar">
          {sidebarLinks.map((link) => {
            const active = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer flex items-center gap-2 ${
                  active
                    ? "bg-[#fffbeb] dark:bg-amber-400/20 text-[#d97706] dark:text-amber-400 border border-[#fde68a] dark:border-amber-400/40 shadow-2xs"
                    : "bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <Icon name={link.icon} className={`h-3.5 w-3.5 ${active ? "text-[#d97706] dark:text-amber-400" : "text-slate-400"}`} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Breadcrumb Navigation (Placed below horizontal nav slider as requested) */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Link href="/" className="hover:text-amber-500 transition flex items-center gap-1">
              <Icon name="Home" className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <span>&gt;</span>
            <button
              onClick={() => setActiveTab("account")}
              className={`hover:text-amber-500 transition ${activeTab === "account" ? "text-slate-900 dark:text-slate-200 font-extrabold" : ""}`}
            >
              My Account
            </button>
            {activeTab !== "account" && (
              <>
                <span>&gt;</span>
                <span className="text-slate-900 dark:text-slate-200 font-extrabold">
                  {sidebarLinks.find((l) => l.id === activeTab)?.label || "Page"}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Main My Account Layout Grid (Matches Screenshot 3) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Navigation (3 cols on desktop, hidden on mobile when viewing a sub-tab) */}
          <div className={`lg:col-span-3 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/90 dark:border-slate-800 p-3 shadow-xs space-y-1 ${activeTab !== "account" ? "hidden lg:block" : "block"}`}>
            <div className="p-3 border-b border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Account Navigation
              </p>
            </div>

            {sidebarLinks.map((link) => {
              const active = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-[#fffbeb] dark:bg-amber-400/15 text-[#d97706] dark:text-amber-400 border border-[#fde68a] dark:border-amber-400/30 shadow-2xs"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon name={link.icon} className={`h-4 w-4 ${active ? "text-[#d97706] dark:text-amber-400" : "text-slate-400"}`} />
                    <span>{link.label}</span>
                  </div>
                  {link.id === "wishlist" && wishlistCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                      {wishlistCount}
                    </span>
                  )}
                  {link.id === "orders" && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black">
                      Active
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
              >
                <Icon name="LogOut" className="h-4 w-4 text-rose-500" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Right Main Content Area (9 cols on desktop) */}
          <div className="lg:col-span-9 space-y-6">

            {/* TAB 1: OVERVIEW GRID (My Account Overview - Hidden on mobile to avoid duplicate cards) */}
            {activeTab === "account" && (
              <div className="space-y-6 animate-fade-in">
                <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  
                  {/* Card 1: My Orders */}
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 hover:border-amber-400/80 transition shadow-xs text-left group cursor-pointer space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-2xl bg-[#fffbeb] dark:bg-amber-400/15 border border-[#fde68a] dark:border-amber-400/30 text-[#d97706] dark:text-amber-400 flex items-center justify-center font-bold">
                        <Icon name="Package" className="h-5 w-5" />
                      </div>
                      <Icon name="ChevronRight" className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">My Orders</h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">Track &amp; manage order history</p>
                    </div>
                  </button>

                  {/* Card 2: Addresses */}
                  <button
                    onClick={() => setActiveTab("addresses")}
                    className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 hover:border-amber-400/80 transition shadow-xs text-left group cursor-pointer space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-2xl bg-[#fffbeb] dark:bg-amber-400/15 border border-[#fde68a] dark:border-amber-400/30 text-[#d97706] dark:text-amber-400 flex items-center justify-center font-bold">
                        <Icon name="MapPin" className="h-5 w-5" />
                      </div>
                      <Icon name="ChevronRight" className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">Addresses</h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{addresses.length} Saved Address</p>
                    </div>
                  </button>

                  {/* Card 3: Wallet */}
                  <button
                    onClick={() => setActiveTab("wallet")}
                    className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 hover:border-amber-400/80 transition shadow-xs text-left group cursor-pointer space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-2xl bg-[#fffbeb] dark:bg-amber-400/15 border border-[#fde68a] dark:border-amber-400/30 text-[#d97706] dark:text-amber-400 flex items-center justify-center font-bold">
                        <Icon name="Wallet" className="h-5 w-5" />
                      </div>
                      <Icon name="ChevronRight" className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">Wallet</h3>
                      <p className="text-xs text-[#d97706] dark:text-amber-400 font-extrabold mt-0.5">₹12,500 Credits Available</p>
                    </div>
                  </button>

                  {/* Card 4: My Wishlists */}
                  <button
                    onClick={() => setActiveTab("wishlist")}
                    className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 hover:border-amber-400/80 transition shadow-xs text-left group cursor-pointer space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-2xl bg-[#fffbeb] dark:bg-amber-400/15 border border-[#fde68a] dark:border-amber-400/30 text-[#d97706] dark:text-amber-400 flex items-center justify-center font-bold">
                        <Icon name="Heart" className="h-5 w-5" />
                      </div>
                      <Icon name="ChevronRight" className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">My Wishlists</h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{wishlistCount} Saved Products</p>
                    </div>
                  </button>

                  {/* Card 5: Shopping List */}
                  <button
                    onClick={() => setActiveTab("shopping-list")}
                    className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 hover:border-amber-400/80 transition shadow-xs text-left group cursor-pointer space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-2xl bg-[#fffbeb] dark:bg-amber-400/15 border border-[#fde68a] dark:border-amber-400/30 text-[#d97706] dark:text-amber-400 flex items-center justify-center font-bold">
                        <Icon name="List" className="h-5 w-5" />
                      </div>
                      <Icon name="ChevronRight" className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">Shopping List</h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{shoppingList.length} Quick Items</p>
                    </div>
                  </button>

                  {/* Card 6: Refer & Earn */}
                  <button
                    onClick={() => setActiveTab("refer")}
                    className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 hover:border-amber-400/80 transition shadow-xs text-left group cursor-pointer space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-2xl bg-[#fffbeb] dark:bg-amber-400/15 border border-[#fde68a] dark:border-amber-400/30 text-[#d97706] dark:text-amber-400 flex items-center justify-center font-bold">
                        <Icon name="Gift" className="h-5 w-5" />
                      </div>
                      <Icon name="ChevronRight" className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">Refer &amp; Earn</h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">Earn ₹500 per Referral</p>
                    </div>
                  </button>

                </div>
 
              </div>
            )}

            {/* TAB 2: MY ORDERS */}
            {activeTab === "orders" && (
              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-6 animate-fade-in">
                {/* Header matching Screenshot 1 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Orders</h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Manage your Order information and Status</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-slate-400 block">Date Range</label>
                      <select className="bg-slate-100 dark:bg-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl border-none outline-none">
                        <option value="all">All</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="2026">2026</option>
                      </select>
                    </div>

                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-slate-400 block">Status</label>
                      <select className="bg-slate-100 dark:bg-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl border-none outline-none">
                        <option value="all">All</option>
                        <option value="transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Empty State matching Screenshot 1 */}
                <div className="py-14 text-center space-y-4 max-w-sm mx-auto">
                  <div className="h-14 w-14 rounded-2xl bg-[#fffbeb] border border-[#fde68a] text-amber-500 flex items-center justify-center mx-auto shadow-2xs">
                    <Icon name="Package" className="h-7 w-7 text-amber-500" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">No Orders Found</h4>
                    <p className="text-xs text-slate-400 font-medium">You haven&apos;t placed any orders yet.</p>
                  </div>
                  <Link
                    href="/"
                    className="inline-block px-7 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition"
                  >
                    Start Shopping
                  </Link>
                </div>
              </div>
            )}

            {/* TAB 3: ADDRESSES */}
            {activeTab === "addresses" && (
              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-6 animate-fade-in">
                {/* Header matching Screenshot 2 */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">My Addresses</h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Manage your address information for faster checkout and delivery</p>
                  </div>

                  <button
                    onClick={() => setShowAddAddressModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-amber-400 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
                  >
                    <span>⊕</span>
                    <span>Add New</span>
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="py-14 text-center space-y-4 max-w-sm mx-auto">
                    <div className="h-14 w-14 rounded-full bg-[#fffbeb] border border-[#fde68a] text-amber-500 flex items-center justify-center mx-auto shadow-2xs">
                      <Icon name="MapPin" className="h-7 w-7 text-amber-500" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">No addresses saved yet</h4>
                      <p className="text-xs text-slate-400 font-medium">Add your first address to get started with faster checkout and delivery.</p>
                    </div>
                    <button
                      onClick={() => setShowAddAddressModal(true)}
                      className="inline-block px-7 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition cursor-pointer"
                    >
                      Add Your First Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Icon name="MapPin" className="h-4 w-4 text-amber-500" />
                            <span>{addr.name}</span>
                          </span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 font-medium space-y-0.5">
                          <p className="font-bold text-slate-900 dark:text-white">{addr.recipient}</p>
                          <p>{addr.street}</p>
                          <p>{addr.city}, {addr.state} - {addr.zip}</p>
                          <p>{addr.country}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showAddAddressModal && (
                  <form onSubmit={handleAddAddress} className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-900 border space-y-4">
                    <h4 className="text-xs font-black">Add New Address Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <input
                        type="text"
                        placeholder="Label (e.g. Work, Home)"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        className="p-2.5 rounded-xl border bg-white dark:bg-slate-800"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Street Address"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        className="p-2.5 rounded-xl border bg-white dark:bg-slate-800"
                        required
                      />
                      <input
                        type="text"
                        placeholder="City (e.g. Bhuj)"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="p-2.5 rounded-xl border bg-white dark:bg-slate-800"
                        required
                      />
                      <input
                        type="text"
                        placeholder="State / Postal Zip Code"
                        value={newAddress.zip}
                        onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                        className="p-2.5 rounded-xl border bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setShowAddAddressModal(false)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl text-xs font-extrabold bg-amber-400 text-slate-950"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 4: WISHLIST */}
            {activeTab === "wishlist" && (
              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-6 animate-fade-in">
                {/* Header matching Screenshot 3 */}
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Wishlists</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Products you saved for later</p>
                </div>

                {wishlistItems.length === 0 ? (
                  <div className="py-14 text-center space-y-4 max-w-sm mx-auto">
                    <div className="h-14 w-14 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-500 flex items-center justify-center mx-auto shadow-2xs">
                      <Icon name="Heart" className="h-7 w-7 text-rose-500 fill-rose-500" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">Your wishlist is empty</h4>
                      <p className="text-xs text-slate-400 font-medium">Save products while browsing to view them anytime here.</p>
                    </div>
                    <Link
                      href="/"
                      className="inline-block px-7 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {wishlistItems.map((item) => (
                      <div key={item.slug} className="p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 relative group">
                        <div className="relative aspect-square w-full rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                          <button
                            onClick={() => toggleWishlist(item)}
                            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white text-rose-500 flex items-center justify-center shadow-md"
                          >
                            ❤️
                          </button>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h4>
                          <p className="text-xs font-black text-slate-900 dark:text-white mt-0.5">${item.price}</p>
                        </div>
                        <button
                          onClick={() => addToCart({ product: item, quantity: 1, openDrawer: true })}
                          className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <Icon name="ShoppingCart" className="h-4 w-4" />
                          <span>Add to cart</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: WALLET */}
            {activeTab === "wallet" && (
              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-6 animate-fade-in">
                {/* Header matching Screenshot 4 */}
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">My Wallet</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Manage your wallet balance, track transactions, and view credits.</p>
                </div>

                {/* Wallet Balance Card matching Screenshot 4 */}
                <div className="p-6 rounded-2xl bg-[#fffbeb] dark:bg-amber-400/10 border border-[#fde68a] dark:border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-amber-200/60 text-amber-700 flex items-center justify-center font-bold">
                        <Icon name="Wallet" className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-amber-800/80 dark:text-amber-300 uppercase tracking-wider block">Available balance</span>
                        <p className="text-3xl font-black text-amber-950 dark:text-amber-100 mt-0.5">$50.00</p>
                      </div>
                    </div>

                    <p className="text-xs font-bold text-amber-800/70 dark:text-amber-200/70 tracking-widest font-mono">
                      XXXX XXXX XXXX XX72
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end justify-between gap-4">
                    <button
                      onClick={() => alert("Deposit feature available soon!")}
                      className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition shadow-md cursor-pointer"
                    >
                      Deposit
                    </button>

                    <p className="text-xs font-extrabold text-slate-900 dark:text-amber-200">
                      {user.name || "Agha Essa Khan"}
                    </p>
                  </div>
                </div>

                {/* Wallet Transactions Log matching Screenshot 4 */}
                <div className="space-y-4 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">Wallet Transactions</h4>

                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="text"
                        placeholder="Search..."
                        className="bg-slate-100 dark:bg-slate-800 text-xs font-medium px-3.5 py-1.5 rounded-xl border-none outline-none max-w-[140px]"
                      />
                      <select className="bg-slate-100 dark:bg-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl border-none outline-none">
                        <option value="all">All Statuses</option>
                        <option value="completed">Completed</option>
                      </select>
                      <select className="bg-slate-100 dark:bg-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl border-none outline-none">
                        <option value="all">All Types</option>
                        <option value="deposit">Deposit</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white">Deposit</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                          Completed
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">25/09/2026, 8:26:28 pm • system</p>
                    </div>

                    <span className="font-black text-amber-600 dark:text-amber-400 text-sm">+$50.00</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: TRANSACTIONS */}
            {activeTab === "transactions" && (
              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-6 animate-fade-in">
                {/* Header matching Screenshot 5 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">My Transactions</h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">See your Transactions information and Status</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="bg-slate-100 dark:bg-slate-800 text-xs font-medium px-3.5 py-1.5 rounded-xl border-none outline-none max-w-[140px]"
                    />
                    <select className="bg-slate-100 dark:bg-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl border-none outline-none">
                      <option value="all">All Statuses</option>
                    </select>
                  </div>
                </div>

                <div className="py-16 text-center text-xs font-bold text-slate-400">
                  No transactions found
                </div>
              </div>
            )}

            {/* TAB 7: NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-6 animate-fade-in">
                {/* Header matching Reference Screenshot */}
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Notifications</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Stay updated with your orders, wallet, and more</p>
                </div>

                {/* Content Card matching Reference Screenshot */}
                <div className="p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-12">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                    <Icon name="Bell" className="h-4 w-4 text-slate-400" />
                    <span>0 Total</span>
                  </div>

                  <div className="py-8 text-center space-y-4 max-w-sm mx-auto">
                    <Icon name="Bell" className="h-10 w-10 text-[#f59e0b] dark:text-amber-400 mx-auto stroke-[1.5]" />
                    <div className="space-y-1">
                      <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">No notifications yet</h4>
                      <p className="text-xs text-slate-400 font-medium">You&apos;re all caught up! Check back later.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: SUPPORT */}
            {activeTab === "support" && (
              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-6 animate-fade-in">
                {/* Header matching Screenshot 2 */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Customer Support</h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Your personal support assistant</p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live</span>
                  </span>
                </div>

                {/* Content Box matching Screenshot 2 */}
                <div className="p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-center space-y-8">
                  <div className="h-14 w-14 rounded-full bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/30 text-amber-500 flex items-center justify-center mx-auto shadow-2xs">
                    <Icon name="HelpCircle" className="h-7 w-7 text-amber-500" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">How can we help?</h4>
                    <p className="text-xs text-slate-400 font-medium max-w-md mx-auto">
                      Choose an order or general help to start a guided support conversation.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 max-w-md mx-auto space-y-3 text-left">
                    <label className="text-xs font-black text-slate-900 dark:text-white block text-center">
                      Which order do you need help with?
                    </label>

                    <a
                      href="https://wa.me/919974692496"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-400 text-slate-900 dark:text-white text-xs font-bold block text-center transition shadow-xs"
                    >
                      My issue is not related to an order
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 9: REFER & EARN */}
            {activeTab === "refer" && (
              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-6 animate-fade-in">
                {/* Header matching Screenshot 3 */}
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Refer &amp; Earn</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Invite your friends to join and get the reward</p>
                </div>

                {/* Top Code Card matching Screenshot 3 */}
                <div className="p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-center space-y-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Your referral code</span>
                  <p className="text-3xl font-black text-amber-500 tracking-wider font-mono">
                    REF-7D3ORGOZ
                  </p>

                  <div>
                    <button
                      onClick={handleCopyReferral}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition shadow-md cursor-pointer"
                    >
                      <Icon name="Gift" className="h-4 w-4" />
                      <span>{copiedReferral ? "Code Copied! 🎉" : "Copy code"}</span>
                    </button>
                  </div>

                  <p className="text-xs font-bold text-slate-400 pt-1">
                    Earn up to $500.00
                  </p>
                </div>

                {/* How it Works Section matching Screenshot 3 */}
                <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-6">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">How it works</h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Step 1 */}
                    <div className="space-y-2">
                      <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center">
                        1
                      </div>
                      <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">Share your code</h5>
                      <p className="text-[11px] text-slate-400 font-medium">Send your referral code to friends</p>
                    </div>

                    {/* Step 2 */}
                    <div className="space-y-2">
                      <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center">
                        2
                      </div>
                      <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">Friend signs up</h5>
                      <p className="text-[11px] text-slate-400 font-medium">They register using your referral code</p>
                    </div>

                    {/* Step 3 */}
                    <div className="space-y-2">
                      <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center">
                        3
                      </div>
                      <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">Earn rewards</h5>
                      <p className="text-[11px] text-slate-400 font-medium">
                        When they complete their first order, you earn rewards (up to $500.00 total)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </main>

      <SiteFooter />



      {/* Account Modals */}
      <ProfileModal />
      <Security2FAModal />
    </div>
  );
}

export default function UserAccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="h-10 w-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">Loading Account...</p>
          </div>
        </div>
      }
    >
      <AccountContent />
    </Suspense>
  );
}
