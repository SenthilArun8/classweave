/**
 * At Home Activities Page Component
 * 
 * Server-side rendered page for generating personalized activities for children at home.
 * Includes comprehensive SEO metadata and structured content for better search visibility.
 * 
 * FEATURES:
 * - Server-side rendering for optimal SEO
 * - Comprehensive metadata for social sharing
 * - AI-powered activity generation via client component
 * - Mobile-responsive design
 * - Rich structured data for search engines
 */

import React from 'react';
import Script from 'next/script';
import AtHomeActivityGenerator from '@/app/components/AtHomeActivityGenerator';

// Comprehensive metadata for SEO and social sharing
export const metadata = {
  title: 'At-Home Activities Generator | AI-Powered Educational Activities for Kids',
  description: 'Generate personalized educational activities for your children at home using AI. Perfect for parents, homeschoolers, and caregivers. Create engaging indoor and outdoor activities tailored to your child\'s age, interests, and developmental needs.',
  keywords: [
    'at-home activities for kids',
    'educational activities children',
    'home learning activities',
    'AI activity generator',
    'personalized kids activities',
    'indoor activities for children',
    'outdoor activities for kids',
    'preschool activities at home',
    'toddler activities',
    'homeschool activities',
    'educational games children',
    'learning activities home',
    'child development activities',
    'play-based learning',
    'parent child activities',
    'kids crafts and activities',
    'STEM activities kids',
    'creative activities children',
    'fine motor activities',
    'gross motor activities',
    'cognitive development activities',
    'language development activities',
    'social emotional learning activities',
    'Simple Science Experiments',
    'Simple Science Experiments for Kids',

  ],
  authors: [{ name: 'ClassWeave', url: 'https://classweave.vercel.app' }],
  creator: 'ClassWeave',
  publisher: 'ClassWeave',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://classweave.vercel.app/at-home',
    siteName: 'ClassWeave',
    title: 'AI-Powered At-Home Activities for Kids | ClassWeave',
    description: 'Generate unlimited personalized educational activities for your children at home. AI-powered generator creates age-appropriate activities based on your child\'s interests, developmental stage, and available materials.',
    images: [
      {
        url: '/og-at-home.png', // You can create this image later
        width: 1200,
        height: 630,
        alt: 'ClassWeave At-Home Activities Generator - AI-Powered Educational Activities for Children',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Powered At-Home Activities for Kids | ClassWeave',
    description: 'Generate personalized educational activities for your children at home using AI. Perfect for busy parents and homeschoolers.',
    images: ['/og-at-home.png'], // You can create this image later
    creator: '@classweave', // Replace with actual Twitter handle if you have one
  },
  alternates: {
    canonical: 'https://classweave.vercel.app/at-home',
  },
  category: 'Education',
  classification: 'Educational Tools',
  applicationName: 'ClassWeave',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    // Add your verification codes here if you have them
    // google: 'your-google-verification-code',
    // bing: 'your-bing-verification-code',
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'ClassWeave At-Home',
    'mobile-web-app-capable': 'yes',
  },
};

/**
 * AtHomePage Component
 * 
 * Main server component for the at-home activities page
 * Provides SEO-optimized structure and includes client component for interactivity
 * 
 * @returns {JSX.Element} Complete at-home activities page
 */
export default function AtHomePage() {
  return (
    <>
      {/* Structured Data for At-Home Activities */}
      <Script id="at-home-structured-data" type="application/ld+json" strategy="beforeInteractive">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "At-Home Activities Generator",
            "description": "AI-powered generator for personalized educational activities for children at home",
            "url": "https://classweave.vercel.app/at-home",
            "isPartOf": {
              "@type": "WebSite",
              "name": "ClassWeave",
              "url": "https://classweave.vercel.app"
            },
            "mainEntity": {
              "@type": "SoftwareApplication",
              "name": "At-Home Activity Generator",
              "applicationCategory": "EducationalApplication",
              "description": "Generate personalized educational activities for children using AI based on age, interests, and available materials",
              "operatingSystem": "Web",
              "isAccessibleForFree": true,
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Personalized activity generation",
                "Age-appropriate content",
                "Uses common household materials",
                "Indoor and outdoor activities",
                "Learning outcomes tracking",
                "Parent involvement options"
              ],
              "audience": {
                "@type": "EducationalAudience",
                "educationalRole": ["parent", "caregiver", "homeschooler"]
              }
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://classweave.vercel.app"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "At-Home Activities",
                  "item": "https://classweave.vercel.app/at-home"
                }
              ]
            }
          }
        `}
      </Script>

      <div className="min-h-screen bg-gradient-to-br from-[#f8f6f2] to-[#f3e9db]">
        {/* SEO-Optimized Hero Section */}
        <section className="relative py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-800 mb-4 md:mb-6">
              At-Home Activities Generator
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-emerald-700 mb-4 md:mb-6 leading-relaxed px-2">
              Create personalized educational activities for your child using AI
            </p>
            <p className="text-base sm:text-lg text-emerald-600 mb-6 md:mb-8 leading-relaxed px-2 max-w-3xl mx-auto">
              Perfect for busy parents, homeschoolers, and caregivers. Generate age-appropriate activities based on your child's interests, developmental stage, and available materials at home.
            </p>
            <div className="w-16 md:w-24 h-1 bg-emerald-600 mx-auto"></div>
          </div>
        </section>

        {/* Benefits Section for SEO */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white/50">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-semibold text-emerald-800 mb-2">Personalized Activities</h3>
                <p className="text-emerald-700 text-sm">
                  AI-generated activities tailored to your child's age, interests, and developmental needs
                </p>
              </div>
              <div className="p-4">
                <div className="text-3xl mb-3">🏠</div>
                <h3 className="font-semibold text-emerald-800 mb-2">Using Home Materials</h3>
                <p className="text-emerald-700 text-sm">
                  Activities designed with common household items - no need for expensive supplies
                </p>
              </div>
              <div className="p-4">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-semibold text-emerald-800 mb-2">Instant Generation</h3>
                <p className="text-emerald-700 text-sm">
                  Generate unlimited unique activities in seconds with our AI-powered system
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Activity Generator - Client Component */}
        <AtHomeActivityGenerator />

        {/* Additional SEO Content */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-800 mb-6 text-center">
              Why Choose Our At-Home Activity Generator?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-emerald-800 mb-4">
                  🧠 Educational & Fun
                </h3>
                <p className="text-emerald-700 mb-4">
                  Every activity is designed to promote learning while keeping your child engaged and entertained. Our AI considers developmental milestones and educational objectives.
                </p>
                
                <h3 className="text-xl font-semibold text-emerald-800 mb-4">
                  📱 Easy to Use
                </h3>
                <p className="text-emerald-700 mb-4">
                  Simply fill out our quick form with your child's information, and our AI will generate the perfect activity. No complex setup or technical knowledge required.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-emerald-800 mb-4">
                  🎨 Diverse Activity Types
                </h3>
                <p className="text-emerald-700 mb-4">
                  From arts and crafts to science experiments, cooking activities to physical games - our generator covers all types of learning through play.
                </p>
                
                <h3 className="text-xl font-semibold text-emerald-800 mb-4">
                  👨‍👩‍👧‍👦 Family Bonding
                </h3>
                <p className="text-emerald-700 mb-4">
                  Choose between independent activities for your child or family activities that bring everyone together for quality bonding time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section for SEO */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-emerald-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-800 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                  What age groups are supported?
                </h3>
                <p className="text-emerald-700">
                  Our activity generator supports children from 2-7 years old, with activities specifically tailored to each developmental stage and age group.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                  Do I need special materials?
                </h3>
                <p className="text-emerald-700">
                  No! Our AI prioritizes using common household items and materials you likely already have at home. You can also specify what materials you have available.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                  How long do activities take?
                </h3>
                <p className="text-emerald-700">
                  You can choose activity durations from 10 minutes to over an hour, perfect for different situations and attention spans.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                  Are the activities educational?
                </h3>
                <p className="text-emerald-700">
                  Yes! Every activity is designed with learning objectives in mind, targeting various developmental areas like fine motor skills, cognitive development, language skills, and more.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
