import type { Metadata, Viewport } from "next";
import { Poppins, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartDrawer } from "@/components/common/CartDrawer";
import { WishlistDrawer } from "@/components/common/WishlistDrawer";
import { CartToast } from "@/components/common/CartToast";
import { MobileBottomNav } from "@/components/common/MobileBottomNav";
import { FloatingActionButtons } from "@/components/common/FloatingActionButtons";
import { OfflineGuard } from "@/components/common/OfflineGuard";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${APP_NAME} | Multi-Category Storefront & Enterprise CRM`,
  description: APP_DESCRIPTION,
  keywords: ["LUMINA", "E-commerce", "Storefront", "Multi-category", "Next.js 15", "PostgreSQL", "Neon"],
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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${inter.variable}`}>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
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
        <body suppressHydrationWarning className={`${poppins.variable} ${inter.variable} font-sans min-h-screen bg-[#f8fafc] dark:bg-[#060b13] text-slate-900 dark:text-slate-100 antialiased overflow-x-clip`}>
          <div id="google_translate_element" />
          <ReactQueryProvider>
            <LanguageProvider>
              <AuthProvider>
                <WishlistProvider>
                  <CartProvider>
                    <OfflineGuard>
                      <div className="flex flex-col min-h-screen">
                        {children}
                      </div>
                    </OfflineGuard>
                    <MobileBottomNav />
                    <FloatingActionButtons />
                    <CartToast />
                    <CartDrawer />
                    <WishlistDrawer />
                  </CartProvider>
                </WishlistProvider>
              </AuthProvider>
            </LanguageProvider>
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}



