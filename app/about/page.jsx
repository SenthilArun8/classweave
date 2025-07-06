/**
 * About Page Component
 * 
 * Comprehensive about page showcasing Class    {
      title: "Non-Repetitive Content",
      description: "Advanced algorithms ensure every generated activity and story is unique, preventing repetition and maintaining engagement.",
      icon: "🔄"
    },
    {
      title: "Real-Time Analytics",
      description: "Monitor student development with detailed activity results, engagement metrics, and personalized recommendations.",
      icon: "📊"
    }ssion, impact on SDGs,
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
      description: "AI-powered educational tools for early childhood development with personalized learning experiences that adapt to each child's unique needs.",
      icon: "📚"
    },
    {
      number: 10,
      title: "Reduced Inequalities",
      description: "Making advanced educational technology accessible to all educators regardless of location, resources, or technical expertise.",
      icon: "🤝"
    },
    {
      number: 8,
      title: "Decent Work and Economic Growth",
      description: "Empowering educators with efficient AI tools while helping daycare centers improve outcomes and operational efficiency.",
      icon: "💼"
    },
    {
      number: 9,
      title: "Industry, Innovation and Infrastructure",
      description: "Building resilient educational infrastructure through innovative AI technology and sustainable digital solutions.",
      icon: "🏗️"
    }
  ];

  const features = [
    {
      title: "AI-Powered Activity Generation",
      description: "Create unlimited personalized educational activities based on individual student profiles, interests, and developmental stages.",
      icon: "🤖"
    },
    {
      title: "At-Home Learning Hub",
      description: "Generate engaging activities for parents with customizable difficulty, duration, and materials - perfect for home learning and keeping kids occupied while you get a well-deserved break.",
      icon: "🏠"
    },
    {
      title: "Smart Story Creation",
      description: "AI-generated personalized stories about daily activities that help children process experiences and learn new concepts.",
      icon: "📖"
    },
    {
      title: "Student Profile Management",
      description: "Comprehensive tracking of personality, developmental milestones, interests, and learning preferences with detailed insights.",
      icon: "👶"
    },
    {
      title: "Non-Repetitive Content",
      description: "Advanced algorithms ensure every generated activity and story is unique, preventing repetition and maintaining engagement.",
      icon: "�"
    },
    {
      title: "Real-Time Analytics",
      description: "Monitor student development with detailed activity results, engagement metrics, and personalized recommendations.",
      icon: "�"
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
              
              {/* Mission Stats */}
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-800">∞</div>
                  <p className="text-sm text-emerald-600 font-medium">Unique Activities</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-800">24/7</div>
                  <p className="text-sm text-emerald-600 font-medium">AI Availability</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-center">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-2xl font-bold text-emerald-800 mb-4">Growing Minds</h3>
                <p className="text-emerald-700">
                  Nurturing the next generation through personalized, AI-enhanced early childhood education
                </p>
                <div className="mt-6 flex justify-center space-x-4">
                  <div className="w-3 h-3 bg-emerald-300 rounded-full"></div>
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-emerald-700 rounded-full"></div>
                </div>
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-emerald-800 mb-4">{feature.title}</h3>
                <p className="text-emerald-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section - Commented out for now */}
      {/*
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-6">
              Built with Modern Technology
            </h2>
            <p className="text-lg text-emerald-700 max-w-3xl mx-auto">
              ClassWeave leverages cutting-edge technologies to deliver a fast, secure, and scalable platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">⚛️</div>
              <h3 className="text-lg font-bold text-emerald-800 mb-2">Next.js 15</h3>
              <p className="text-sm text-emerald-700">Modern React framework for optimal performance</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-lg font-bold text-emerald-800 mb-2">Google Vertex AI</h3>
              <p className="text-sm text-emerald-700">Advanced AI for content generation</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🍃</div>
              <h3 className="text-lg font-bold text-emerald-800 mb-2">MongoDB</h3>
              <p className="text-sm text-emerald-700">Flexible NoSQL database</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-lg font-bold text-emerald-800 mb-2">Tailwind CSS</h3>
              <p className="text-sm text-emerald-700">Beautiful, responsive design</p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-8 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white px-8 py-4 rounded-xl">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🔒</span>
                <span className="font-semibold">GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">⚡</span>
                <span className="font-semibold">Lightning Fast</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📱</span>
                <span className="font-semibold">Mobile Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      */}

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
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-6">
            Meet Our Team
          </h2>
          <p className="text-lg text-emerald-700 mb-12">
            ClassWeave is developed by passionate educators and technologists committed to improving early childhood education
          </p>
          
          {/* Profile Card - Enhanced design */}
          <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-2xl border border-emerald-200 hover:shadow-3xl transition-all duration-300">
            {/* Profile Image */}
            <div className="mb-6 flex justify-center">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-800 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                SK
              </div>
            </div>
            
            {/* Name with LinkedIn Icon */}
            <div className="flex items-center justify-center mb-4">
              <h3 className="text-2xl font-bold mr-3 text-emerald-800">Senthil Kirthieswar</h3>
              <a
                href="https://www.linkedin.com/in/senthil-kirthieswar-631631334/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0077B5] hover:text-[#005885] transition-colors transform hover:scale-110"
                aria-label="LinkedIn Profile"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
            
            {/* Title */}
            <p className="text-emerald-600 font-semibold mb-2">Founder & Developer</p>
            <div className="w-16 h-1 bg-emerald-600 mx-auto mb-4"></div>
            
            {/* Description */}
            <p className="text-emerald-700 leading-relaxed">
              Geomatics student at the University of Waterloo and passionate full-stack developer specializing in AI engineering for early childhood education. I'm dedicated to creating innovative AI-powered tools that simplify daily challenges and empower educators and parents to focus on what matters most - nurturing young minds.
            </p>
            
            {/* Skills */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">AI Development</span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">Education Technology</span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">Full-Stack Development</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
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
    </div>
  );
};

export default AboutPage;
