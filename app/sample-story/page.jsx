import SampleStories from '../components/SampleStories';

// Metadata for Sample Stories page
export const metadata = {
  title: 'Sample Educational Stories | ClassWeave AI Activity Insights',
  description: 'Explore sample AI-generated educational stories and activity insights. See how ClassWeave transforms children\'s activities into engaging narratives for parents and educators.',
  keywords: [
    'educational stories',
    'activity stories',
    'AI-generated stories',
    'child activity insights',
    'educational narratives',
    'daycare stories',
    'preschool activities',
    'learning stories',
    'child development stories',
    'ClassWeave samples',
    'educational documentation',
    'activity observations',
    'learning journey',
    'child progress stories'
  ],
  authors: [{ name: 'ClassWeave', url: 'https://classweave.vercel.app' }],
  creator: 'ClassWeave',
  publisher: 'ClassWeave',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://classweave.vercel.app/sample-story',
    siteName: 'ClassWeave',
    title: 'Sample Educational Stories | ClassWeave AI',
    description: 'Discover how ClassWeave creates engaging educational stories from children\'s activities. Perfect examples for educators and parents.',
    images: [
      {
        url: '/og-sample-stories.png',
        width: 1200,
        height: 630,
        alt: 'ClassWeave Sample Educational Stories and Activity Insights',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sample Educational Stories | ClassWeave AI',
    description: 'See how AI transforms children\'s activities into engaging educational stories.',
    images: ['/og-sample-stories.png'],
    creator: '@classweave',
  },
  alternates: {
    canonical: 'https://classweave.vercel.app/sample-story',
  },
  category: 'Education',
};

export default function SampleStoriesPage() {
  return <SampleStories />;
}