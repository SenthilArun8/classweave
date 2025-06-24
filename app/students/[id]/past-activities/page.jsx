'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';

const StudentPastActivitiesPage = () => {
  const { id } = useParams();
  const { token } = useUser();
  const [activities, setActivities] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPastActivities = async () => {
      setLoading(true);
      setError('');
      try {
        if (!token) {
          setError('No authentication token found. Please log in.');
          setLoading(false);
          return;
        }        const response = await fetch(`/api/students/${id}/past-activities`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch student data');
        }
        
        const data = await response.json();
        setStudentName(data.name);
        setActivities(data.past_activities || []);
      } catch (err) {
        setError('Failed to load past activities.');
        console.error('Error fetching past activities:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (token && id) {
      fetchPastActivities();
    }
  }, [id, token]);

  return (
    <div className="min-h-screen bg-[#f5f0e6] py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white/80 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-emerald-800 mb-6 text-center">
          Past Activities for {studentName}
        </h2>
        <div className="mb-6 text-center">
          <Link
            href={`/students/${id}`}
            className="text-emerald-700 hover:underline font-semibold"
          >
            ← Back to Student Page
          </Link>
        </div>
        {loading ? (
          <div className="text-center text-emerald-700">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : activities.length === 0 ? (
          <div className="text-center text-emerald-700">No past activities found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-emerald-200 rounded-lg">
              <thead>
                <tr className="bg-emerald-100">
                  <th className="py-3 px-4 border-b text-left font-semibold">Date</th>
                  <th className="py-3 px-4 border-b text-left font-semibold">Activity Name</th>
                  <th className="py-3 px-4 border-b text-left font-semibold">Result</th>
                  <th className="py-3 px-4 border-b text-left font-semibold">Difficulty</th>
                  <th className="py-3 px-4 border-b text-left font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, idx) => (
                  <tr key={idx} className="hover:bg-emerald-50 transition">
                    <td className="py-3 px-4 border-b">
                      {activity.date ? new Date(activity.date).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3 px-4 border-b font-semibold text-emerald-800">
                      {activity.name || '-'}
                    </td>
                    <td className="py-3 px-4 border-b">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        activity.result === 'Success' ? 'bg-green-100 text-green-800' :
                        activity.result === 'Failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.result || '-'}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-b">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        activity.difficulty_level === 'Easy' ? 'bg-blue-100 text-blue-800' :
                        activity.difficulty_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        activity.difficulty_level === 'Hard' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.difficulty_level || '-'}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-b text-sm">
                      {activity.notes ? (
                        <div className="max-w-xs truncate" title={activity.notes}>
                          {activity.notes}
                        </div>
                      ) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPastActivitiesPage;
