'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

const AllSavedActivitiesPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { token } = useUser();

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError('');
      try {
        if (!token) {
          setError('No authentication token found. Please log in.');
          setLoading(false);
          return;
        }

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
        const studentsData = Array.isArray(data) ? data : data.students || [];
        
        // Filter students who have saved activities
        const studentsWithSavedActivities = studentsData.filter(s => 
          s.saved_activities && s.saved_activities.length > 0
        );
        
        setStudents(studentsWithSavedActivities);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load students.');
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchStudents();
    }
  }, [token]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-4 text-emerald-800">Students with Saved Activities</h2>
      {students.length === 0 ? (
        <div className="text-gray-600">No students have saved activities yet.</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {students.map(student => (
            <li key={student._id} className="py-4 flex items-center justify-between">
              <span className="font-semibold text-lg text-emerald-900">{student.name}</span>
              <button
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded transition"
                onClick={() => router.push(`/saved-activities/${student._id}`)}
              >
                View Saved Activities
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllSavedActivitiesPage;
