import { Geist, Geist_Mono } from "next/font/google";
import Script from 'next/script';
import "./globals.css";
import Navbar from "./components/Navbar";
import { UserProvider } from "@/contexts/UserContext";
import { Toaster } from 'react-hot-toast';
import Footer from "./components/Footer";
import CookieConsent from "./components/CookieConsent";
import ConsentSettings from "./components/ConsentSettings";
import ClientOnly from "./components/ClientOnly";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ClassWeave - AI-Powered Early Childhood Education",
  description: "Streamline your daycare and preschool planning with AI-generated activities, personalized stories, and comprehensive student management tools.",
  keywords: "daycare, preschool, early childhood education, AI activities, student management, educational planning",
  authors: [{ name: "Senthil Kirthieswar" }],
  openGraph: {
    title: "ClassWeave - AI-Powered Early Childhood Education",
    description: "Streamline your daycare and preschool planning with AI-generated activities, personalized stories, and comprehensive student management tools.",
    type: "website",
    url: "https://classweave.vercel.app",
    siteName: "ClassWeave",
  },
  // Add favicon and icon metadata
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512', 
        url: '/android-chrome-512x512.png',
      }
    ]
  },
  manifest: '/site.webmanifest',
  themeColor: '#10b981',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics - Basic tracking code */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-88398TJT8Q"></script>
        
        {/* AdSense Verification Code */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7943531569653927"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col`} suppressHydrationWarning={true}>
        {/* Google Analytics with Consent Mode - Moved to body to prevent hydration issues */}
        <Script id="google-analytics-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Set default consent mode - Analytics and ads are now essential
            gtag('consent', 'default', {
              'analytics_storage': 'granted',
              'ad_storage': 'granted',
              'ad_user_data': 'granted',
              'ad_personalization': 'granted',
              'wait_for_update': 500,
            });
            
            gtag('js', new Date());
            gtag('config', 'G-88398TJT8Q');
          `}
        </Script>

        <UserProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <ClientOnly>
            <CookieConsent />
            <ConsentSettings />
          </ClientOnly>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#10b981',
                color: '#fff',
              },
            }}
          />
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
