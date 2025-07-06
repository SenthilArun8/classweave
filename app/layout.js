import { Geist, Geist_Mono } from "next/font/google";
import Script from 'next/script';
import "./globals.css";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
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
  metadataBase: new URL('https://classweave.vercel.app'),
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
        {/* AdSense Verification Code */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7943531569653927"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col`} suppressHydrationWarning={true}>
        {/* Google Analytics with Next.js Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-88398TJT8Q"
          strategy="afterInteractive"
        />
        
        {/* Structured Data for SEO */}
        <Script id="structured-data" type="application/ld+json" strategy="beforeInteractive">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "ClassWeave",
              "alternateName": "ClassWeave AI",
              "description": "AI-powered educational platform for personalized learning activities for toddlers, preschoolers, and students",
              "url": "https://classweave.vercel.app",
              "sameAs": [
                "https://www.linkedin.com/in/senthil-kirthieswar-631631334/"
              ],
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Person",
                "name": "Senthil Kirthieswar",
                "url": "https://www.linkedin.com/in/senthil-kirthieswar-631631334/"
              },
              "publisher": {
                "@type": "Organization",
                "name": "ClassWeave",
                "url": "https://classweave.vercel.app"
              },
              "featureList": [
                "AI-powered activity generation",
                "Personalized learning experiences",
                "Student profile management",
                "Educational story creation",
                "At-home activity suggestions",
                "Progress tracking",
                "Parent-educator communication"
              ],
              "audience": {
                "@type": "EducationalAudience",
                "educationalRole": ["parent", "teacher", "educator", "caregiver"]
              },
              "educationalLevel": ["preschool", "kindergarten", "elementary"],
              "learningResourceType": ["activity", "lesson plan", "educational game"],
              "isAccessibleForFree": true
            }
          `}
        </Script>

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
          <Banner />
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
