import Hero from './components/Hero';
import SubHeading from './components/SubHeading';
import SamplePage from './components/SamplePage';
import SampleStories from './components/SampleStories';

// Comprehensive metadata for the home page
export const metadata = {
  title: 'ClassWeave AI | Personalized Educational Activities for Children',
  description: 'Discover AI-powered personalized learning activities for toddlers, preschoolers, and students. ClassWeave helps educators and parents create engaging educational experiences tailored to each child\'s unique needs and interests.',
  keywords: [
    'AI education platform',
    'personalized learning activities',
    'educational activities for children',
    'toddler activities',
    'preschool activities',
    'student activities',
    'AI activity generator',
    'early childhood education',
    'educational technology',
    'child development activities',
    'daycare activities',
    'at-home learning',
    'personalized education',
    'adaptive learning',
    'ClassWeave',
    'educational AI',
    'learning platform',
    'child-centered learning',
    'developmental activities',
    'educational content generation',
    'SDG 4 - Quality Education',
    'SDG 10 - Reduced Inequalities',
    'SDG 8 - Decent Work and Economic Growth',
    'SDG 9 - Industry, Innovation and Infrastructure',
    'SDG 4',
    'automatic activity generator',
    'AI-powered education',
    'AI learning activities',
    'AI for toddlers',
    'AI for preschoolers',
    'AI for students',
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
    url: 'https://classweave.vercel.app',
    siteName: 'ClassWeave',
    title: 'ClassWeave AI | Personalized Educational Activities for Children',
    description: 'AI-powered platform creating personalized learning activities for toddlers, preschoolers, and students. Empowering educators and parents with tailored educational experiences.',
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: 'ClassWeave AI - Personalized Educational Activities Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClassWeave AI | Personalized Educational Activities for Children',
    description: 'AI-powered platform for personalized learning activities. Perfect for educators, parents, and childcare providers.',
    images: ['/og-home.png'],
    creator: '@classweave',
  },
  alternates: {
    canonical: 'https://classweave.vercel.app',
  },
  category: 'Education',
  classification: 'Educational Platform',
  applicationName: 'ClassWeave',
  referrer: 'origin-when-cross-origin',
  verification: {
    // Add verification codes when available
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'ClassWeave',
    'mobile-web-app-capable': 'yes',
  },
};

export default function Home() {
  return (
    <>
      <Hero
        title='Classweave AI'
        subtitle='Find personalized activities for toddlers, preschoolers, and students'
      />
      <SampleStories />
      <SamplePage />
      <SubHeading />
    </>
  );
}
