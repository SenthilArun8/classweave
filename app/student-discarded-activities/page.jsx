'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

const skillCategoryColors = {
  'Cognitive': 'bg-blue-200 text-blue-800',
  'Fine Motor': 'bg-green-200 text-green-800',
  'Gross Motor': 'bg-yellow-200 text-yellow-800',
  'Language': 'bg-purple-200 text-purple-800',
  'Social-Emotional': 'bg-pink-200 text-pink-800',
  'Creative': 'bg-orange-200 text-orange-800',
  'Other': 'bg-gray-200 text-gray-800',
  'Social-Emotional Skills': 'bg-yellow-300 text-yellow-900',
  'Cognitive Skills': 'bg-blue-400 text-blue-900',
  'Literacy Skills': 'bg-green-700 text-green-100',
  'Physical Skills': 'bg-orange-400 text-orange-900',
  'Creative Arts/Expression Skills': 'bg-purple-500 text-white',
  'Language and Communication Skills': 'bg-sky-300 text-sky-900',
  'Self-Help/Adaptive Skills': 'bg-amber-800 text-amber-100',
  'Problem-Solving Skills': 'bg-lime-400 text-lime-900',
  'Sensory Processing Skills': 'bg-gradient-to-r from-pink-400 via-yellow-300 to-blue-400 text-white',
};

const normalizeSkills = (skills) => {
  if (!skills) return [];
  let arr = [];
  if (Array.isArray(skills)) {
    arr = skills.map(s => {
      if (typeof s === 'object' && s !== null) {
        const name = typeof s.name === 'string' ? s.name.trim() : '';
        const category = typeof s.category === 'string' ? s.category.trim() : '';
        if (name && category) return { name, category };
        return null;
      }
      if (typeof s === 'string') {
        const [category, ...rest] = s.split(':');
        if (rest.length > 0) {
          const name = rest.join(':').trim();
          if (name && category.trim()) return { name, category: category.trim() };
        }
        if (s.trim()) return { name: s.trim(), category: 'Other' };
      }
      return null;
    });
  } else if (typeof skills === 'string') {
    try {
      const parsed = JSON.parse(skills);
      return normalizeSkills(parsed);
    } catch {
      if (skills.trim()) return [{ name: skills.trim(), category: 'Other' }];
    }
  }
  return arr.filter(s => s && typeof s.name === 'string' && typeof s.category === 'string' && s.name && s.category);
};

export default function StudentDiscardedActivitiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [restoring, setRestoring] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      setError('');
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
        const res = await axios.get(`/api/students/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudent(res.data);
      } catch (err) {
        setError('Failed to load student.');
      }
      setLoading(false);
    };
    if (id) fetchStudent();
  }, [id]);

  const handleRestore = async (activityIdx) => {
    setRestoring(activityIdx);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      await axios.post(`/api/students/${id}/restore-discarded-activity`, { activityIdx }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudent(s => ({
        ...s,
        discarded_activities: s.discarded_activities.filter((_, i) => i !== activityIdx)
      }));
    } catch (err) {
      alert('Failed to restore activity.');
    }
    setRestoring('');
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!student) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <button
        className="mb-4 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded"
        onClick={() => router.push('/discarded-activities')}
      >
        ← Back to Students
      </button>
      <h3 className="text-xl font-bold mb-4 text-emerald-800">Discarded Activities for {student.name}</h3>
      {(!student.discarded_activities || student.discarded_activities.length === 0) ? (
        <div className="text-gray-600">No discarded activities for this student.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {student.discarded_activities.map((activity, idx) => (
            <div
              key={activity._id || idx}
              className="border rounded-lg p-6 bg-gray-50 shadow transition hover:shadow-lg flex flex-col justify-between h-full relative mb-4"
            >
              <div className="font-semibold text-lg mb-2 text-emerald-900">
                {activity['Title of Activity'] || activity.title || 'Activity'}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Why it works:</span>{' '}
                {activity['Why it works'] || activity.why_it_works || <span className="text-gray-400">N/A</span>}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Skills supported:</span>{' '}
                <div className="flex flex-wrap gap-2 mt-1">
                  {normalizeSkills(activity['Skills supported'] || activity.skills_supported).map((skill, i) => (
                    <span
                      key={i}
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${skillCategoryColors[skill.category] || skillCategoryColors['Other']}`}
                      style={skill.category === 'Sensory Processing Skills' ? {
                        background: 'linear-gradient(90deg, #f472b6 0%, #fde68a 50%, #60a5fa 100%)',
                        color: '#fff',
                      } : {}}
                    >
                      {skill.name} <span className="opacity-60">({skill.category})</span>
                    </span>
                  ))}
                </div>
              </div>
              {activity.date && (
                <div className="text-xs text-gray-500 mb-1">
                  Discarded: {new Date(activity.date).toLocaleString()}
                </div>
              )}
              {activity.notes && (
                <div className="text-xs text-gray-500 mb-1">
                  Notes: {activity.notes}
                </div>
              )}
              <button
                className="mt-4 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded w-full flex items-center justify-center gap-2 disabled:opacity-50"
                onClick={() => handleRestore(idx)}
                disabled={restoring === idx}
              >
                {restoring === idx ? 'Restoring...' : 'Restore'}
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        className="mt-8 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded"
        onClick={() => router.push('/students')}
      >
        Back
      </button>
    </div>
  );
}
