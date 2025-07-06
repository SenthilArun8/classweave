/**
 * About Page Call-to-Action Component
 * 
 * Client component for the interactive CTA section that shows different
 * buttons based on user authentication state.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';

/**
 * AboutCTA Component
 * 
 * Interactive call-to-action section that changes based on user state
 * 
 * @returns {JSX.Element} CTA section with conditional rendering
 */
export default function AboutCTA() {
  const { user } = useUser();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-700 to-emerald-800">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Transform Your Teaching?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join educators worldwide who are already using ClassWeave to create personalized learning experiences
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Link 
              href="/students" 
              className="bg-white text-emerald-800 px-8 py-4 rounded-lg font-semibold hover:bg-emerald-50 transition-colors transform hover:scale-105 shadow-lg"
            >
              Go to Your Dashboard
            </Link>
          ) : (
            <>
              <Link 
                href="/register" 
                className="bg-white text-emerald-800 px-8 py-4 rounded-lg font-semibold hover:bg-emerald-50 transition-colors transform hover:scale-105 shadow-lg"
              >
                Get Started Free
              </Link>
              <Link 
                href="/sample-students" 
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-emerald-800 transition-colors transform hover:scale-105"
              >
                Try Demo
              </Link>
            </>
          )}
        </div>
        
        <p className="mt-6 text-sm opacity-75">
          No credit card required • GDPR compliant • Start in minutes
        </p>
      </div>
    </section>
  );
}
