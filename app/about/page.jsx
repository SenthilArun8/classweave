/**
 * About Page Component
 * 
 * Comprehensive about page showcasing ClassWeave's mission, impact on SDGs,
 * features, and team information.
 * 
 * FEATURES:
 * - Mission and vision statements
 * - UN Sustainable Development Goals alignment
 * - Key features and benefits
 * - Team information
 * - Call-to-action sections
 * - Responsive design with consistent styling
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';

/**
 * AboutPage Component
 * 
 * Main about page component with comprehensive information about ClassWeave
 * 
 * @returns {JSX.Element} Complete about page with mission, features, and SDG alignment
 */
const AboutPage = () => {
  const { user } = useUser();

  const sdgs = [
    {
      number: 4,
      title: "Quality Education",
      description: "AI-powered educational tools for early childhood development with personalized learning experiences.",
      icon: "📚"
    },
    {
      number: 10,
      title: "Reduced Inequalities",
      description: "Making advanced educational technology accessible to all educators regardless of location or resources.",
      icon: "🤝"
    },
    {
      number: 8,
      title: "Decent Work and Economic Growth",
      description: "Empowering educators with efficient tools and helping daycare centers improve their educational outcomes.",
      icon: "💼"
    }
  ];

  const features = [
    {
      title: "AI-Powered Activity Generation",
      description: "Create personalized educational activities based on individual student profiles and learning styles.",
      icon: "🤖"
    },
    {
      title: "Student Profile Management",
      description: "Comprehensive tracking of personality, developmental stage, interests, and learning preferences.",
      icon: "👶"
    },
    {
      title: "Progress Tracking",
      description: "Monitor student development with detailed activity results and observations.",
      icon: "📊"
    },
    {
      title: "Personalized Stories",
      description: "Generate engaging, educational stories tailored to each child's interests and developmental needs.",
      icon: "📖"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f2] to-[#f3e9db]">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-emerald-800 mb-6">
            About ClassWeave
          </h1>
          <p className="text-xl md:text-2xl text-emerald-700 mb-8 leading-relaxed">
            Revolutionizing early childhood education through AI-powered personalized learning experiences
          </p>
          <div className="w-24 h-1 bg-emerald-600 mx-auto"></div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-emerald-700 mb-6 leading-relaxed">
                At ClassWeave, we believe that every child deserves access to high-quality, personalized education during their critical early years. Our AI-powered platform empowers educators to create engaging, tailored learning experiences that adapt to each child's unique needs, personality, and learning style.
              </p>
              <p className="text-lg text-emerald-700 leading-relaxed">
                By combining cutting-edge technology with educational expertise, we're making advanced teaching tools accessible to daycare centers, preschools, and educators worldwide, regardless of their size or resources.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-center">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-2xl font-bold text-emerald-800 mb-4">Growing Minds</h3>
                <p className="text-emerald-700">
                  Nurturing the next generation through personalized, AI-enhanced early childhood education
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SDGs Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-6">
              Supporting UN Sustainable Development Goals
            </h2>
            <p className="text-lg text-emerald-700 max-w-3xl mx-auto">
              ClassWeave is committed to advancing global sustainability through education and technology innovation
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {sdgs.map((sdg) => (
              <div key={sdg.number} className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">{sdg.icon}</div>
                <div className="text-sm font-semibold text-emerald-600 mb-2">SDG {sdg.number}</div>
                <h3 className="text-xl font-bold text-emerald-800 mb-4">{sdg.title}</h3>
                <p className="text-emerald-700">{sdg.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-6">
              Key Features
            </h2>
            <p className="text-lg text-emerald-700 max-w-3xl mx-auto">
              Discover how ClassWeave transforms early childhood education through innovative technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-emerald-800 mb-4">{feature.title}</h3>
                <p className="text-emerald-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#162114] text-[#FFEDD2]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Making a Global Impact
          </h2>
          <p className="text-xl mb-8 leading-relaxed opacity-90">
            By providing accessible, AI-powered educational tools, ClassWeave is helping to bridge the gap between well-funded and under-resourced educational settings, ensuring every child has access to quality early childhood education.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="text-3xl font-bold mb-2">🌍</div>
              <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
              <p className="opacity-90">Accessible anywhere with internet connection</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">👩‍🏫</div>
              <h3 className="text-xl font-semibold mb-2">Educator Empowerment</h3>
              <p className="opacity-90">Professional development through AI insights</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">📈</div>
              <h3 className="text-xl font-semibold mb-2">Better Outcomes</h3>
              <p className="opacity-90">Data-driven educational improvements</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-6">
            Our Team
          </h2>
          <p className="text-lg text-emerald-700 mb-12">
            ClassWeave is developed by passionate educators and technologists committed to improving early childhood education
          </p>
          
          {/* Profile Card - Matching page theme */}
          <div className="bg-gradient-to-br from-[#f8f6f2] to-[#f3e9db] rounded-2xl p-8 max-w-sm mx-auto shadow-2xl border border-emerald-200">
            {/* Profile Image */}
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-800 flex items-center justify-center text-3xl font-bold text-white">
                SK
              </div>
            </div>
            
            {/* Name with LinkedIn Icon */}
            <div className="flex items-center justify-center mb-4">
              <h3 className="text-2xl font-bold mr-2 text-emerald-800">Senthil Kirthieswar</h3>
              <a
                href="https://www.linkedin.com/in/senthil-kirthieswar-631631334/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0077B5] hover:text-[#005885] transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
            
            {/* Title */}
            <p className="text-emerald-600 font-semibold mb-4">Founder & Developer</p>
            
            {/* Description */}
            <p className="text-emerald-700 text-sm leading-relaxed">
              I am a passionate technologist and educator building innovative solutions for early childhood education. I love creating AI-powered tools that make quality education accessible to all, while developing key features that empower educators and transform learning experiences.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
