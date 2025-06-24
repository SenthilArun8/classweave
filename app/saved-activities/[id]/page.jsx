'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ActivityComparison from '../../components/ActivityComparison';

const SavedActivityPage = () => {
  const { id } = useParams(); // student id
  const [student, setStudent] = useState(null);
  const [savedActivities, setSavedActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // States for comparison, now managed by the parent and passed to child
  const [compareActivities, setCompareActivities] = useState([]);
  const [showCompareCounter, setShowCompareCounter] = useState(false);

  // Filter state for skill category
  const [categoryFilter, setCategoryFilter] = useState('');
  // Scroll up button state
  const [showScroll, setShowScroll] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchSavedActivities = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/students/${id}`, {
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
        setStudent(data);
        setSavedActivities(data.saved_activities || []);
      } catch (err) {
        console.error("Error fetching saved activities:", err);
        setError('Failed to load saved activities.');
      }
      setLoading(false);
    };
    fetchSavedActivities();
  }, [id]);
  const handleDeleteActivity = async (activityToDeleteId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/students/${id}/saved-activities?activityId=${activityToDeleteId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete activity');
      }
      
      setSavedActivities(prev => prev.filter(activity => activity._id !== activityToDeleteId));
      // Also clear from comparison if the deleted activity was being compared
      setCompareActivities(prev => prev.filter(a => a._id !== activityToDeleteId));
    } catch (err) {
      alert(`Failed to delete saved activity: ${err.message}`);
      console.error("Error deleting saved activity:", err);
    }
  };

  // The handleCompare logic remains here as it modifies the state that this component owns
  const handleCompare = (activity) => {
    setCompareActivities(prev => {
      let newActivities;
      if (prev.some(a => a._id === activity._id)) {
        newActivities = prev.filter(a => a._id !== activity._id);
      } else {
        if (prev.length === 2) {
          newActivities = [prev[1], activity];
        } else {
          newActivities = [...prev, activity];
        }
      }

      // Show/hide counter based on newActivities length
      setShowCompareCounter(newActivities.length > 0 && newActivities.length < 2);

      return newActivities;
    });
  };

  // Helper: Normalize skills_supported to array of { name, category }
  const normalizeSkills = (skills) => {
    if (!skills) return [];
    if (Array.isArray(skills) && skills.length > 0 && typeof skills[0] === 'object' && skills[0].name && skills[0].category) {
      return skills;
    }
    if (Array.isArray(skills) && typeof skills[0] === 'string') {
      return skills.map(s => {
        const [category, ...rest] = s.split(':');
        if (rest.length > 0) {
          return { name: rest.join(':').trim(), category: category.trim() };
        }
        return { name: s.trim(), category: 'Other' };
      });
    }
    if (typeof skills === 'string') {
      try {
        const arr = JSON.parse(skills);
        return normalizeSkills(arr);
      } catch {
        return [{ name: skills, category: 'Other' }];
      }
    }
    return [];
  };

  // Color map for skill categories
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

  // Listen for scroll to show/hide scroll up button
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get all unique categories from activities
  const allCategories = Array.from(new Set(
    savedActivities.flatMap(a => normalizeSkills(a.skills_supported).map(s => s.category))
  ));

  // Filtered activities
  const filteredActivities = categoryFilter
    ? savedActivities.filter(a => normalizeSkills(a.skills_supported).some(s => s.category === categoryFilter))
    : savedActivities;

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!student) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-4 text-emerald-800">Saved Activities for {student.name}</h2>
      <div className="mb-4 flex flex-wrap gap-2 items-center justify-end">
        <label className="font-semibold text-emerald-900 mr-2">Filter by Category:</label>
        <select
          className="border border-emerald-300 rounded px-2 py-1"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="">All</option>
          {allCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      {filteredActivities && filteredActivities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <div
              key={activity._id || Math.random()}
              className="border rounded-lg p-6 bg-gray-50 shadow transition hover:shadow-lg flex flex-col justify-between h-full relative"
            >
              {activity._id && (
                <button
                  className="absolute top-2 right-2 p-2 border border-transparent bg-transparent text-gray-400 rounded-full hover:bg-red-600 hover:text-white hover:border-red-600 z-10 transition-colors duration-200"
                  title="Delete Activity"
                  onClick={() => handleDeleteActivity(activity._id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              )}
              <div>
                <div className="font-semibold text-lg mb-2 text-emerald-900">
                  {activity['Title of Activity'] || activity.title || `Activity`}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Why it works:</span>{' '}
                  {activity['Why it works'] || activity.why_it_works || <span className="text-gray-400">N/A</span>}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Skills supported:</span>{' '}
                  <span className="flex flex-wrap gap-2 mt-1">
                    {normalizeSkills(activity.skills_supported).map((skill, sidx) => (
                      <span
                        key={sidx}
                        className={`px-2 py-1 rounded text-xs font-semibold mr-1 mb-1 ${skillCategoryColors[skill.category] || skillCategoryColors['Other']}`}
                        style={skill.category === 'Sensory Processing Skills' ? {
                          background: 'linear-gradient(90deg, #f472b6 0%, #fde68a 50%, #60a5fa 100%)',
                          color: '#fff',
                        } : {}}
                      >
                        {skill.name} <span className="opacity-60">({skill.category})</span>
                      </span>
                    ))}
                  </span>
                </div>
                {activity.date && (
                  <div className="text-xs text-gray-500 mb-1">
                    Saved: {new Date(activity.date).toLocaleString()}
                  </div>
                )}
                {activity.notes && (
                  <div className="text-xs text-gray-500 mb-1">
                    Notes: {activity.notes}
                  </div>
                )}
                <button
                  className={`mt-4 px-3 py-2 ${
                    compareActivities.some(a => a._id === activity._id)
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  } text-white rounded w-full flex items-center justify-center gap-2`}
                  onClick={() => handleCompare(activity)}
                >
                  {compareActivities.some(a => a._id === activity._id) ? (
                    <>
                      Selected
                      <span className="bg-white text-emerald-600 rounded-full w-5 h-5 flex items-center justify-center text-sm font-bold">
                        {compareActivities.findIndex(a => a._id === activity._id) + 1}
                      </span>
                    </>
                  ) : (
                    'Compare'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-600">No activities saved yet.</div>
      )}

      {/* Render the new comparison component */}
      <ActivityComparison
        compareActivities={compareActivities}
        setCompareActivities={setCompareActivities}
        setShowCompareCounter={setShowCompareCounter}
      />

      <button
        className="mt-8 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded"
        onClick={() => router.push('/students')}
      >
        Back
      </button>
      {showScroll && (
        <button
          className="fixed bottom-8 right-8 bg-emerald-700 hover:bg-emerald-900 text-white p-3 rounded-full shadow-lg z-50 transition"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SavedActivityPage;