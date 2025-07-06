import SamplePage from '../components/SamplePage';

// Metadata for Sample Students page
export const metadata = {
  title: 'Sample Student Profiles | ClassWeave AI Educational Platform',
  description: 'Explore sample student profiles and see how ClassWeave creates personalized educational activities. Learn how our AI adapts to each child\'s unique learning style and interests.',
  keywords: [
    'student profiles',
    'sample students',
    'personalized learning',
    'educational profiles',
    'child learning profiles',
    'AI education',
    'adaptive learning',
    'ClassWeave examples',
    'student data',
    'learning preferences',
    'educational personalization',
    'child development tracking',
    'learning analytics',
    'student progress'
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
    url: 'https://classweave.vercel.app/sample-students',
    siteName: 'ClassWeave',
    title: 'Sample Student Profiles | ClassWeave AI',
    description: 'See how ClassWeave creates personalized learning experiences for each child. Explore sample student profiles and activity recommendations.',
    images: [
      {
        url: '/og-sample-students.png',
        width: 1200,
        height: 630,
        alt: 'ClassWeave Sample Student Profiles and Personalized Learning',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sample Student Profiles | ClassWeave AI',
    description: 'Discover how AI creates personalized learning experiences for each child.',
    images: ['/og-sample-students.png'],
    creator: '@classweave',
  },
  alternates: {
    canonical: 'https://classweave.vercel.app/sample-students',
  },
  category: 'Education',
};

export default function SampleStudentsPage() {
  return <SamplePage />;
}