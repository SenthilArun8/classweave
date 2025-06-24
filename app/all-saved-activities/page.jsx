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
  const { token } = useUser();

  // ========================================
  // DATA FETCHING
  // ========================================

  /**
   * Fetches students from API and filters for those with saved activities
   * 
   * PROCESS:
   * 1. Validates authentication token
   * 2. Makes authenticated request to /api/students
   * 3. Filters response to include only students with saved activities
   * 4. Updates state with results or error message
   */
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Check authentication
        if (!token) {
          setError('No authentication token found. Please log in.');
          setLoading(false);
          return;
        }

        // Fetch students using Next.js fetch API
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
        
        // Handle different response formats (array or object with students property)
        const studentsData = Array.isArray(data) ? data : data.students || [];
        
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

    // Only fetch if we have a token
    if (token) {
      fetchStudents();
    }
  }, [token]);

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
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700 mx-auto mb-4"></div>
        <p className="text-emerald-700">Loading students...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <div className="mb-4">⚠️</div>
        <p>{error}</p>
      </div>
    );
  }

  // ========================================
  // MAIN COMPONENT RENDER
  // ========================================

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-emerald-800 mb-2">
          Students with Saved Activities
        </h2>
        <p className="text-gray-600">
          Browse students who have saved activities for quick access and review.
        </p>
      </div>

      {/* Content Area */}
      {students.length === 0 ? (
        // Empty state
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Activities Yet</h3>
          <p className="text-gray-600 mb-4">
            No students have saved activities yet. Activities will appear here once students start saving them.
          </p>
          <button
            onClick={() => router.push('/students')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded transition-colors"
          >
            View All Students
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
                    {student.name}
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
        </div>
      )}
    </div>
  );
};

export default AllSavedActivitiesPage;
