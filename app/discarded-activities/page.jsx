'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

const SAMPLE_STUDENT_IDS = [
  '683d57f853223cfb0c1e5723',
  '683d590053223cfb0c1e5724',
];

const DiscardedActivitiesPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { token, user } = useUser();  useEffect(() => {
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
        
        // Filter students who have discarded activities
        const studentsWithDiscardedActivities = studentsData.filter(s => 
          s.discarded_activities && s.discarded_activities.length > 0
        );
        
        setStudents(studentsWithDiscardedActivities);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load students.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [token, user]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f2] to-[#f3e9db] py-8">
      <div className="p-8 text-center">Loading...</div>
    </div>
  );
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f2] to-[#f3e9db] py-8">
      <div className="p-8 text-center text-red-600">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f2] to-[#f3e9db] py-8">
      <div className="max-w-4xl mx-auto p-6 bg-white/100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-emerald-800">
        {user ? 'Students with Discarded Activities' : 'Sample Students with Discarded Activities'}
      </h2>
      {students.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">🗑️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {user ? 'No Discarded Activities Yet' : 'No Sample Discarded Activities'}
          </h3>
          <p className="text-gray-600 mb-4">
            {user 
              ? 'No students have discarded activities yet.'
              : 'Sample discarded activities are not available. Create an account to start managing activities.'
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
        <div>
          <ul className="divide-y divide-gray-200">
            {students.map(student => (
              <li key={student._id} className="py-4 flex items-center justify-between">
                <span className="font-semibold text-lg text-emerald-900">
                  {student.name} {!user && '(Sample)'}
                </span>
                <button
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded transition"
                  onClick={() => router.push(`/discarded-activities/${student._id}`)}
                >
                  View Discarded Activities
                </button>
              </li>
            ))}
          </ul>
          
          {/* Call-to-action for non-logged-in users */}
          {!user && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Want to manage your own activities?
                </h3>
                <p className="text-blue-700 mb-4">
                  Sign up for a free account to create and manage personalized activities for your students.
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
      <button
        className="mt-8 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded transition"
        onClick={() => router.push(user ? '/students' : '/sample-students')}
      >
        Back to {user ? 'Students' : 'Sample Students'}
      </button>
      </div>
    </div>
  );
};

export default DiscardedActivitiesPage;
