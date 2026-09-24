import type { Metadata, Viewport } from "next";
import "./globals.css";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartDrawer } from "@/components/common/CartDrawer";
import { WishlistDrawer } from "@/components/common/WishlistDrawer";
import { CartToast } from "@/components/common/CartToast";
import { AuthModal } from "@/components/common/AuthModal";
import { ProfileModal } from "@/components/common/ProfileModal";
import { Security2FAModal } from "@/components/common/Security2FAModal";

export const metadata: Metadata = {
  title: `${APP_NAME} | Multi-Category Storefront & Enterprise CRM`,
  description: APP_DESCRIPTION,
  keywords: ["LUMINA", "E-commerce", "Storefront", "Multi-category", "Next.js 15", "MongoDB"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('lumina_theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }

                  var lang = localStorage.getItem('lumina_lang');
                  if (lang === 'ar') {
                    document.documentElement.dir = 'rtl';
                    document.documentElement.lang = 'ar';
                  } else if (lang === 'hi') {
                    document.documentElement.dir = 'ltr';
                    document.documentElement.lang = 'hi';
                  }
                } catch (e) {}
              })();

              function googleTranslateElementInit() {
                if (window.google && window.google.translate) {
                  new window.google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: 'en,hi,ar',
                    autoDisplay: false
                  }, 'google_translate_element');
                }
              }
            `,
          }}
        />
        <script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          async
          defer
        />
        <style>{`
          .goog-te-banner-frame,
          .goog-te-balloon-frame,
          #goog-gt-tt,
          .goog-te-spinner-pos,
          .goog-tooltip,
          .goog-tooltip:hover {
            display: none !important;
          }
          body {
            top: 0px !important;
            position: static !important;
          }
          #google_translate_element {
            position: absolute !important;
            opacity: 0 !important;
            pointer-events: none !important;
            top: -9999px !important;
            left: -9999px !important;
            width: 1px !important;
            height: 1px !important;
            overflow: hidden !important;
          }
          /* Fix layout when RTL */
          [dir="rtl"] {
            text-align: right;
          }
        `}</style>
      </head>
      <body className="min-h-screen bg-[#f8fafc] dark:bg-[#060b13] text-slate-900 dark:text-slate-100 antialiased overflow-x-clip">
        <div id="google_translate_element" />
        <LanguageProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                {children}
                <CartToast />
                <CartDrawer />
                <WishlistDrawer />
                <AuthModal />
                <ProfileModal />
                <Security2FAModal />
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}


