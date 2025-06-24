'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';

const StudentDiscardedActivitiesPage = () => {
  const { id } = useParams();
  const { token } = useUser();
  const [activities, setActivities] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDiscardedActivities = async () => {
      setLoading(true);
      setError('');
      try {
        if (!token) {
          setError('No authentication token found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/students/${id}/discarded-activities`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch discarded activities');
        }
        
        const data = await response.json();
        setStudentName(data.name);
        setActivities(data.discarded_activities || []);
      } catch (err) {
        setError('Failed to load discarded activities.');
        console.error('Error fetching discarded activities:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (token && id) {
      fetchDiscardedActivities();
    }
  }, [id, token]);

  const handleRestoreActivity = async (activityId) => {
    try {
      const response = await fetch(`/api/students/${id}/discarded-activities/${activityId}/restore`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to restore activity');
      }

      // Remove the restored activity from the list
      setActivities(prev => prev.filter(activity => activity._id !== activityId));
    } catch (err) {
      console.error('Error restoring activity:', err);
      alert('Failed to restore activity. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0e6] py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white/80 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-emerald-800 mb-6 text-center">
          Discarded Activities for {studentName}
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
          <div className="text-center text-emerald-700">No discarded activities found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity, idx) => (
              <div
                key={activity._id || idx}
                className="border rounded-lg p-6 bg-gray-50 shadow transition hover:shadow-lg flex flex-col justify-between h-full"
              >
                <div>
                  <div className="font-semibold text-lg mb-2 text-emerald-900">
                    {activity['Title of Activity'] || activity.title || `Activity ${idx + 1}`}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Why it works:</span>{' '}
                    {activity['Why it works'] || activity.why_it_works || <span className="text-gray-400">N/A</span>}
                  </div>
                  {activity.skills_supported && (
                    <div className="mb-2">
                      <span className="font-semibold">Skills supported:</span>{' '}
                      <span className="text-sm text-gray-600">
                        {Array.isArray(activity.skills_supported) 
                          ? activity.skills_supported.map(skill => 
                              typeof skill === 'object' ? skill.name : skill
                            ).join(', ')
                          : activity.skills_supported
                        }
                      </span>
                    </div>
                  )}
                  {activity.date && (
                    <div className="text-xs text-gray-500 mb-1">
                      Discarded: {new Date(activity.date).toLocaleString()}
                    </div>
                  )}
                </div>
                <button
                  className="mt-4 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded w-full transition"
                  onClick={() => handleRestoreActivity(activity._id)}
                >
                  Restore Activity
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDiscardedActivitiesPage;
