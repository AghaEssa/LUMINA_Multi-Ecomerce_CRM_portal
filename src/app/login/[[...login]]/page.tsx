"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "@/components/common/Icons";
import { LuminaLogo } from "@/components/common/LuminaLogo";


function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  return (
    <div className="relative w-full max-w-[440px] overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/95 p-6 sm:p-8 text-slate-900 dark:text-white shadow-2xl backdrop-blur-xl z-10 flex flex-col items-center">
      <div className="mb-2 text-center">
        <Link href="/" className="inline-block group hover:opacity-90 transition" title="Return to Lumina Home">
          <LuminaLogo size="md" showText={true} />
        </Link>
      </div>
      <SignIn
        path="/login"
        routing="path"
        fallbackRedirectUrl={callbackUrl}
        signUpUrl="/register"
        appearance={{
          variables: {
            colorPrimary: "#0284c7",
            colorNeutral: "#0f172a",
            colorBackground: "transparent",
            borderRadius: "0.875rem",
            fontFamily: "var(--font-inter), sans-serif",
          },



          elements: {
            rootBox: "w-full",
            cardBox: "w-full shadow-none border-0 bg-transparent p-0",
            card: "w-full shadow-none border-0 bg-transparent p-0 gap-4",
            logoBox: "hidden",
            logoImage: "hidden",
            header: "mb-2 text-center",
            headerTitle: "text-2xl font-black text-slate-900 dark:text-white tracking-tight",
            headerSubtitle: "text-xs font-medium text-slate-500 dark:text-slate-400 mt-1",
            socialButtonsBlockButton:
              "h-11 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold transition shadow-xs text-xs",
            socialButtonsBlockButtonText: "font-bold text-xs text-slate-700 dark:text-slate-200",
            socialButtonsProviderIcon: "h-4 w-4",
            dividerRow: "my-3.5",
            dividerLine: "bg-slate-200 dark:bg-slate-800",
            dividerText: "text-[11px] font-bold text-slate-400 uppercase tracking-widest",
            formFieldLabel: "text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
            formFieldInput:
              "h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-[#f8fafc] dark:bg-slate-950/70 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-[#0284c7] focus:border-transparent transition px-3.5",
            formButtonPrimary:
              "h-11 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-black text-sm transition shadow-md active:scale-[0.99] cursor-pointer",
            footerAction: "mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center",
            footerActionText: "text-xs text-slate-500 dark:text-slate-400",
            footerActionLink: "text-xs font-extrabold text-[#0284c7] dark:text-amber-400 hover:underline ml-1",
            footer: "hidden",
            footerPages: "hidden",
          },
        }}
      />
    </div>
  );
}



export default function LoginPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-950 text-slate-900 dark:text-white relative overflow-hidden font-sans">

      {/* Left Branded Showcase Panel (Hidden on Mobile, Visible on Desktop) */}
      <div className="lg:col-span-6 xl:col-span-7 hidden lg:flex flex-col justify-between p-12 lg:p-16 relative bg-gradient-to-br from-[#082f49] via-[#0369a1] to-[#0f172a] text-white overflow-hidden">
        {/* Subtle Background Pattern & Ambient Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group" title="Go to Lumina Storefront">
            <LuminaLogo size="md" textColor="text-white" />
          </Link>
          <span className="px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[10px] font-black uppercase tracking-widest border border-white/15 backdrop-blur-md">
            ENTERPRISE STORE
          </span>
        </div>

        {/* Center Showcase Content */}
        <div className="relative z-10 max-w-xl space-y-8 my-auto py-12">
          <div className="space-y-4">

            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight">
              Elevate Your Lifestyle with <span className="text-amber-300">LUMINA</span>
            </h2>
            <p className="text-sm text-ocean-100/90 leading-relaxed font-normal">
              Seamless shopping across high-fashion clothing, luxury ergonomic furniture, clinical medical gear, organic foods & smart electronics.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1">
              <span className="text-lg">🛡️</span>
              <p className="text-xs font-bold text-white">2FA Security</p>
              <p className="text-[10px] text-ocean-200">Google Authenticator protection</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1">
              <span className="text-lg">🛍️</span>
              <p className="text-xs font-bold text-white">Unified Cart</p>
              <p className="text-[10px] text-ocean-200">Guest to account cart merging</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1">
              <span className="text-lg">⚡</span>
              <p className="text-xs font-bold text-white">Express Delivery</p>
              <p className="text-[10px] text-ocean-200">Real-time order tracking</p>
            </div>
          </div>
        </div>

        {/* Footer Stats Row */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-6 text-xs text-ocean-200">
          <div className="flex items-center gap-6 font-semibold">
            <div><span className="font-extrabold text-white text-sm">50K+</span> Products</div>
            <div><span className="font-extrabold text-white text-sm">99.9%</span> Security</div>
            <div><span className="font-extrabold text-white text-sm">24/7</span> Support</div>
          </div>
          <p className="text-[11px] text-ocean-300 font-medium">© 2026 Lumina Storefront</p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-12 bg-slate-50 dark:bg-[#070c18] relative min-h-screen lg:min-h-0">

        {/* Top Back Link */}
        <div className="flex justify-between items-center w-full max-w-[440px] mx-auto pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition group"
          >
            <Icon name="ArrowLeft" className="h-4 w-4 transition group-hover:-translate-x-1" />
            <span>Back to Storefront</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="my-auto flex items-center justify-center w-full">
          <Suspense fallback={
            <div className="relative w-full max-w-[440px] rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
              <div className="h-8 w-8 mx-auto border-4 border-[#0284c7] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Loading Sign In...</p>
            </div>
          }>
            <LoginForm />
          </Suspense>
        </div>

        {/* Bottom Helper text for mobile */}
        <div className="pt-6 text-center text-[11px] text-slate-400 dark:text-slate-600">
          Protected by Lumina Enterprise Security • Terms & Privacy Policy
        </div>

      </div>

    </main>
  );
}
