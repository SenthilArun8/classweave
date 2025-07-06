/**
 * All Saved Activities Page
 * 
 * Displays a list of all students who have saved activities in the system.
 * This page serves as an overview/index for accessing individual student's saved activities.
 * 
 * FUNCTIONALITY:
 * - Fetches all students from the API
 * - Filters to show only students with saved activities
 * - Provides navigation to individual student's saved activities
 * - Handles loading states and error conditions
 * 
 * NAVIGATION:
 * - Links to /saved-activities/[studentId] for individual student activities
 * 
 * AUTHENTICATION:
 * - Requires user authentication (uses UserContext)
 * - Automatically handles token-based API requests
 * 
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

const SAMPLE_STUDENT_IDS = [
  '683d57f853223cfb0c1e5723',
  '683d590053223cfb0c1e5724',
];

/**
 * AllSavedActivitiesPage Component
 * 
 * Main component that displays all students with saved activities.
 * Converted from legacy React Router implementation to Next.js App Router.
 * 
 */
const AllSavedActivitiesPage = () => {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Next.js routing and authentication
  const router = useRouter();
  const { token, user } = useUser();

  // ========================================
  // DATA FETCHING
  // ========================================

  /**
   * Fetches students from API and filters for those with saved activities
   * For non-logged-in users, fetches sample students
   * 
   * PROCESS:
   * 1. Check if user is logged in
   * 2. For logged-in users: fetch from /api/students with auth
   * 3. For non-logged-in users: fetch sample students
   * 4. Filter response to include only students with saved activities
   * 5. Update state with results or error message
   */
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError('');
      
      try {
        let studentsData = [];
        
        if (user && token) {
          // Fetch user's students if logged in
          const response = await fetch('/api/students', {
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch students');
          }
          
          const data = await response.json();
          studentsData = Array.isArray(data) ? data : data.students || [];
        } else {
          // Fetch sample students if not logged in
          const sampleStudentRequests = SAMPLE_STUDENT_IDS.map(id =>
            fetch(`/api/students/sample/${id}`, { credentials: 'include' })
              .then(res => res.ok ? res.json() : null)
              .catch(error => {
                console.error(`Error fetching sample student ${id}:`, error);
                return null;
              })
          );
          studentsData = (await Promise.all(sampleStudentRequests)).filter(Boolean);
        }
        
        // Filter students who have saved activities
        const studentsWithSavedActivities = studentsData.filter(student => 
          student.saved_activities && student.saved_activities.length > 0
        );
        
        setStudents(studentsWithSavedActivities);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load students.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [token, user]);

  // ========================================
  // EVENT HANDLERS
  // ========================================

  /**
   * Handles navigation to individual student's saved activities
   * 
   * @param {string} studentId - The ID of the student to view activities for
   */
  const handleViewActivities = (studentId) => {
    router.push(`/saved-activities/${studentId}`);
  };

  // ========================================
  // RENDER CONDITIONS
  // ========================================

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f6f2] to-[#f3e9db] py-8">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700 mx-auto mb-4"></div>
          <p className="text-emerald-700">Loading students...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f6f2] to-[#f3e9db] py-8">
        <div className="p-8 text-center text-red-600">
          <div className="mb-4">⚠️</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // ========================================
  // MAIN COMPONENT RENDER
  // ========================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f2] to-[#f3e9db] py-8">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-emerald-800 mb-2">
          {user ? 'Students with Saved Activities' : 'Sample Students with Saved Activities'}
        </h2>
        <p className="text-gray-600">
          {user 
            ? 'Browse students who have saved activities for quick access and review.'
            : 'Explore sample students and their saved activities to see how the system works.'
          }
        </p>
      </div>

      {/* Content Area */}
      {students.length === 0 ? (
        // Empty state
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {user ? 'No Saved Activities Yet' : 'No Sample Activities Available'}
          </h3>
          <p className="text-gray-600 mb-4">
            {user 
              ? 'No students have saved activities yet. Activities will appear here once students start saving them.'
              : 'Sample activities are not available at the moment. Try creating your own account to start saving activities.'
            }
          </p>
          <button
            onClick={() => router.push(user ? '/students' : '/register')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded transition-colors"
          >
            {user ? 'View All Students' : 'Create Account'}
          </button>
        </div>
      ) : (
        // Students list
        <div>
          <div className="mb-4 text-sm text-gray-500">
            Found {students.length} student{students.length !== 1 ? 's' : ''} with saved activities
          </div>
          
          <ul className="divide-y divide-gray-200">
            {students.map(student => (
              <li key={student._id} className="py-4 flex items-center justify-between hover:bg-gray-50 px-4 rounded">
                {/* Student Info */}
                <div className="flex-1">
                  <span className="font-semibold text-lg text-emerald-900">
                    {student.name} {!user && '(Sample)'}
                  </span>
                  <div className="text-sm text-gray-600 mt-1">
                    {student.saved_activities?.length || 0} saved activit{student.saved_activities?.length !== 1 ? 'ies' : 'y'}
                  </div>
                </div>
                
                {/* Action Button */}
                <button
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  onClick={() => handleViewActivities(student._id)}
                  aria-label={`View saved activities for ${student.name}`}
                >
                  View Saved Activities
                </button>
              </li>
            ))}
          </ul>
          
          {/* Call-to-action for non-logged-in users */}
          {!user && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Want to create your own activities?
                </h3>
                <p className="text-blue-700 mb-4">
                  Sign up for a free account to create personalized activities for your students.
                </p>
                <button
                  onClick={() => router.push('/register')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
                >
                  Create Free Account
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default AllSavedActivitiesPage;
