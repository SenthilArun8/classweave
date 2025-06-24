'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';

const PastActivitiesPage = () => {
  const { token } = useUser();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentsWithPastActivities = async () => {
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
        
        // Filter students who have past activities (activity_history)
        const studentsWithPastActivities = studentsData.filter(student => 
          student.activity_history && student.activity_history.length > 0
        );
        
        setStudents(studentsWithPastActivities);
      } catch (err) {
        setError('Failed to load students with past activities.');
        console.error('Error fetching students:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchStudentsWithPastActivities();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-[#f5f0e6] py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white/80 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-emerald-800 mb-6 text-center">
          Students with Past Activities
        </h2>
        <div className="mb-6 text-center">
          <Link
            href="/students"
            className="text-emerald-700 hover:underline font-semibold"
          >
            ← Back to Students
          </Link>
        </div>
        {loading ? (
          <div className="text-center text-emerald-700">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : students.length === 0 ? (
          <div className="text-center text-emerald-700">No students with past activities found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div key={student._id} className="bg-white border border-emerald-200 rounded-lg p-6 shadow hover:shadow-lg transition">
                <h3 className="text-xl font-bold text-emerald-800 mb-2">{student.name}</h3>
                <p className="text-emerald-600 mb-4">
                  {student.activity_history.length} past activit{student.activity_history.length === 1 ? 'y' : 'ies'}
                </p>
                <Link
                  href={`/students/${student._id}/past-activities`}
                  className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded font-semibold transition"
                >
                  View Past Activities
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PastActivitiesPage;
