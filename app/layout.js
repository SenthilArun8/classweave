import { Geist, Geist_Mono } from "next/font/google";
import Script from 'next/script';
import "./globals.css";
import Navbar from "./components/Navbar";
import { UserProvider } from "@/contexts/UserContext";
import { Toaster } from 'react-hot-toast';
import Footer from "./components/Footer";
import CookieConsent from "./components/CookieConsent";
import ConsentSettings from "./components/ConsentSettings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ClassWeave",
  description: "Streamline your daycare and preschool planning with AI-generated activities, personalized stories, and comprehensive student management tools.",
  keywords: "daycare, preschool, early childhood education, AI activities, student management, educational planning",
  authors: [{ name: "Senthil Kirthieswar" }],
  openGraph: {
    title: "ClassWeave - AI-Powered Early Childhood Education",
    description: "Streamline your daycare and preschool planning with AI-generated activities, personalized stories, and comprehensive student management tools.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics with Consent Mode - Required in HEAD for verification */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-88398TJT8Q"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              
              // Set default consent mode
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'wait_for_update': 500,
              });
              
              gtag('js', new Date());
              gtag('config', 'G-88398TJT8Q');
            `,
          }}
        />
        
        {/* AdSense Verification Code */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7943531569653927"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>

        <UserProvider>
          <Navbar />
          {children}
          <CookieConsent />
          <ConsentSettings />
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
