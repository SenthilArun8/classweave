import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Upcoming Features | ClassWeave',
  description: 'Explore our roadmap of upcoming features for ClassWeave, including student progress tracking, AI-powered suggestions, and curriculum integration.',
  keywords: ['daycare management', 'education technology', 'child development', 'AI for education', 'classroom tools'],
  openGraph: {
    title: 'Upcoming Features | ClassWeave',
    description: 'Our roadmap of new features to enhance your daycare management experience',
    images: [
      {
        url: '/images/coming-soon-og.jpg',
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f6f2] to-[#f3e9db] px-4 py-12 lg:px-8">
      <div className="flex flex-col items-center w-full">
        <h2 className="text-center text-5xl sm:text-6xl font-extrabold tracking-tight text-[#162114] mb-8 drop-shadow-lg">Coming Soon</h2>
        <p className="text-xl sm:text-2xl text-[#294122] text-center max-w-2xl mb-12 drop-shadow-sm">
          We are working hard to bring you new features that will make managing your daycare activities even easier and more insightful. Here's our roadmap:
        </p>
        <div className="w-full max-w-2xl mb-12">
          <ol className="relative border-l-2 border-emerald-300">
            <li className="mb-16 ml-8">
              <span className="absolute flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-full -left-5 ring-4 ring-white">
                <span className="text-3xl">🧑‍🎓</span>
              </span>
              <h3 className="font-bold text-2xl text-emerald-700 mb-2">Spring 2025</h3>
              <p className="text-lg text-[#294122]">Student Dashboard launched</p>
            </li>
            <li className="mb-16 ml-8">
              <span className="absolute flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-full -left-5 ring-4 ring-white">
                <span className="text-3xl">📊</span>
              </span>
              <h3 className="font-bold text-2xl text-emerald-700 mb-2">June 2025</h3>
              <ul className="list-disc pl-7 text-lg text-[#294122]">
                <li>Open beta testing</li>
                <li>End-to-end testing and more integrations</li>
                <li>Performance improvements and mobile UI polish</li>
              </ul>
            </li>
            <li className="ml-8 mb-16">
              <span className="absolute flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-full -left-5 ring-4 ring-white">
                <span className="text-3xl">📈</span>
              </span>
              <h3 className="font-bold text-2xl text-emerald-700 mb-2">Coming Soon</h3>
              <ul className="list-disc pl-7 text-lg text-[#294122] space-y-2">
                <li>
                  <span className="font-semibold">Student Progress Tracking Dashboard</span>
                  <ul className="list-disc pl-5 text-base">
                    <li>Track developmental progress over time (e.g., milestones, skills practiced).</li>
                    <li>Visualize progress via charts or reports.</li>
                  </ul>
                </li>
                <li>Highlight trends from activity history.</li>
                <li>
                  <span className="font-semibold">"What if?" Simulator</span>: Let educators tweak student traits to see different suggestions.
                </li>
                <li>
                  <span className="font-semibold">RAG-Powered Curriculum Integration</span>
                  <ul className="list-disc pl-5 text-base">
                    <li>Use RAG pipelines to query local curriculum documents for activity justification.</li>
                    <li>Real-time curriculum reference alongside AI suggestions.</li>
                  </ul>
                </li>
                <li>
                  <span className="font-semibold">Smart Form Auto-fill</span>
                  <ul className="list-disc pl-5 text-base">
                    <li>When adding a student, predict developmental stages/interests based on age.</li>
                    <li>Use AI to suggest typical personality traits or social behaviors.</li>
                  </ul>
                </li>
                <li>
                  <span className="font-semibold">Custom AI Goals Engine</span>
                  <ul className="list-disc pl-5 text-base">
                    <li>Let educators set weekly/monthly learning goals (e.g., "improve fine motor skills").</li>
                    <li>AI prioritizes activities that target those goals.</li>
                  </ul>
                </li>
              </ul>
            </li>
          </ol>
        </div>
        <Link href="/students" className="mt-2 inline-block px-8 py-3 rounded bg-[#294122] text-xl font-semibold text-white hover:bg-emerald-700 transition">Back to Students</Link>
      </div>
    </div>
  );
}
