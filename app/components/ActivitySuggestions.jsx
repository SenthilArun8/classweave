'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

/**
 * Color map for skill categories
 */
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

/**
 * Normalizes skills data from various formats to a consistent array of objects
 * @param {Array|string|Object} skills - The skills data to normalize
 * @returns {Array<{name: string, category: string}>} Array of normalized skill objects
 */
const normalizeSkills = (skills) => {
  if (!skills) return [];
  
  try {
    // Handle string input (might be JSON string)
    if (typeof skills === 'string') {
      try {
        skills = JSON.parse(skills);
      } catch (e) {
        // If it's not JSON, treat as a single skill name
        return [{ name: skills, category: 'Other' }];
      }
    }

    // Handle array input
    if (Array.isArray(skills)) {
      return skills.map(skill => {
        // Handle object with name and category
        if (typeof skill === 'object' && skill !== null) {
          return {
            name: skill.name || skill.skill || 'Unnamed Skill',
            category: skill.category || 'Other'
          };
        }
        // Handle string items in array
        if (typeof skill === 'string') {
          // Try to split by colon for "category: name" format
          if (skill.includes(':')) {
            const [category, ...nameParts] = skill.split(':');
            return {
              name: nameParts.join(':').trim() || 'Unnamed Skill',
              category: category.trim() || 'Other'
            };
          }
          return { name: skill.trim() || 'Unnamed Skill', category: 'Other' };
        }
        return { name: 'Unnamed Skill', category: 'Other' };
      }).filter(skill => skill.name && skill.category);
    }
  } catch (error) {
    console.error('Error normalizing skills:', error);
  }
  
  return [];
};

/**
 * Extracts activity titles from a response object or array
 * @param {Array|Object} arr - The response data
 * @returns {string[]} Array of activity titles
 */
const getActivityTitles = (arr) => {
  if (!arr) return [];
  const activities = Array.isArray(arr) ? arr : Object.values(arr).flat();
  return activities.map(a => a?.['Title of Activity'] || a?.title || a?.name || '').filter(Boolean);
};

/**
 * Extracts an array from a response object if it contains an array property
 * @param {Object|Array} resp - The response to extract array from
 * @returns {Array|null} The extracted array or null if none found
 */
const getCarouselArray = (resp) => {
  if (Array.isArray(resp)) return resp;
  if (resp && typeof resp === 'object') {
    const arrKey = Object.keys(resp).find(
      k => Array.isArray(resp[k]) && resp[k].length > 0
    );
    if (arrKey) return resp[arrKey];
  }
  return null;
};

/**
 * Component that generates and displays AI-suggested activities for a student
 */
const ActivitySuggestions = ({ student }) => {
  const router = useRouter();
  const { token } = useUser();
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [saveStatus, setSaveStatus] = useState('');
  const [previousPrompt, setPreviousPrompt] = useState(null);
  const [previousActivities, setPreviousActivities] = useState([]);

  // Get the current activity array from the response
  const carouselArray = response ? getCarouselArray(response) : null;
  
  // Check if this is a sample student (read-only)
  const isSampleStudent = student && (student._id === '683d57f853223cfb0c1e5723' || student._id === '683d590053223cfb0c1e5724');
  
  // Check if student has a recent activity
  const hasRecentActivity = student.recent_activity &&
    student.recent_activity.name &&
    student.recent_activity.result &&
    student.recent_activity.difficulty_level &&
    student.recent_activity.observations;

  /**
   * Builds a prompt for the AI based on student data
   * @returns {string} The formatted prompt
   */
  const buildPrompt = () => {
    return `{
  "toddler_description": "${student.toddler_description}",
  "name": "${student.name}",
  "age_months": ${student.age_months},
  "personality": "${student.personality || 'unknown'}",
  "developmental_stage": "${student.developmental_stage}",
  "recent_activity": {
    "name": "${student.recent_activity.name || 'unknown'}",
    "result": "${student.recent_activity.result || 'unknown'}",   
    "difficulty_level": "${student.recent_activity.difficulty_level || 'unknown'}",
    "observations": "${student.recent_activity.observations || 'unknown'}"
  },
  "interests": "${JSON.stringify(student.interests || [])}",
  "preferred_learning_style": "${JSON.stringify(student.preferred_learning_style || 'unknown')}",
  "social_behavior": "${student.social_behavior || 'unknown'}",
  "energy_level": "${student.energy_level || 'unknown'}",
  "goals": "${JSON.stringify(student.goals || [])}",
  "activity_history": "${JSON.stringify(student.activity_history || [])}"
}`;
  };

  /**
   * Handles generating activity suggestions
   */
  const handleGenerate = async () => {
    setLoading(true);
    setCarouselIndex(0);
    
    try {
      let promptToSend = '';
      let discardedActivities = [];
      
      // If this is the first time or student changed, use full prompt
      if (!previousPrompt || previousPrompt.studentId !== student._id) {
        promptToSend = buildPrompt();
        setPreviousPrompt({ studentId: student._id, prompt: promptToSend });
        setPreviousActivities([]);
      } else {
        // On subsequent clicks, only send a short prompt and the previous activities
        const prevTitles = getActivityTitles(previousActivities.length ? previousActivities : carouselArray);
        promptToSend = `With the same instructions and the same recent_activity as before, give me some more activity suggestions. Do not repeat any of these: ${prevTitles.join(', ')}.`;
        discardedActivities = prevTitles;
      }
      
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          prompt: promptToSend,
          discardedActivities
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate activities');
      }
      
      const data = await response.json();
      setResponse(data.response);
      const arr = getCarouselArray(data.response);
      if (arr) setPreviousActivities(arr);
      
    } catch (err) {
      setResponse(`Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles saving an activity to the student's profile
   */
  const handleSaveActivity = async () => {
    if (!carouselArray || !carouselArray[carouselIndex]) return;
    
    setSaveStatus('');
    const raw = carouselArray[carouselIndex];
    const skills = normalizeSkills(raw['Skills supported'] || raw.skills_supported);
    
    if (!skills.length) {
      setSaveStatus('Cannot save: No valid skills supported for this activity.');
      setTimeout(() => setSaveStatus(''), 5000);
      return;
    }
    
    const activity = {
      title: raw['Title of Activity'] || raw.title || '',
      why_it_works: raw['Why it works'] || raw.why_it_works || '',
      skills_supported: skills,
      date: new Date().toISOString(),
      notes: raw['Notes'] || raw.notes || '',
    };
    
    try {
      const response = await fetch(`/api/students/${student._id}/saved-activity`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ activity })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save activity');
      }
      
      setSaveStatus('Activity saved!');
      setTimeout(() => setSaveStatus(''), 3000);
      
      // Remove the saved activity from the carousel
      if (carouselArray.length > 1) {
        const newArray = [...carouselArray];
        newArray.splice(carouselIndex, 1);
        setResponse(Array.isArray(response) ? newArray : { ...response, [Object.keys(response)[0]]: newArray });
        setCarouselIndex(i => Math.min(i, newArray.length - 1));
      } else {
        setResponse('');
        setCarouselIndex(0);
      }
      
      // Refresh the student data
      router.refresh();
      
    } catch (err) {
      const backendMsg = err.response?.data?.error || err.message;
      setSaveStatus('Failed to save activity: ' + backendMsg);
      setTimeout(() => setSaveStatus(''), 7000);
    }
  };

  /**
   * Handles discarding an activity
   */
  const handleDiscardActivity = async () => {
    if (!carouselArray || !carouselArray[carouselIndex]) return;
    
    setSaveStatus('');
    const raw = carouselArray[carouselIndex];
    const skills = normalizeSkills(raw['Skills supported'] || raw.skills_supported);
    
    if (!skills.length) {
      setSaveStatus('Cannot discard: No valid skills supported for this activity.');
      setTimeout(() => setSaveStatus(''), 5000);
      return;
    }
    
    const activity = {
      title: raw['Title of Activity'] || raw.title || '',
      why_it_works: raw['Why it works'] || raw.why_it_works || '',
      skills_supported: skills,
      date: new Date().toISOString(),
      notes: raw['Notes'] || raw.notes || '',
    };
    
    try {
      const response = await fetch(`/api/students/${student._id}/discarded-activity`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ activity })
      });
      
      if (!response.ok) {
        throw new Error('Failed to discard activity');
      }
      
      setSaveStatus('Activity discarded!');
      setTimeout(() => setSaveStatus(''), 3000);
      
      // Remove the discarded activity from the carousel
      if (carouselArray.length > 1) {
        const newArray = [...carouselArray];
        newArray.splice(carouselIndex, 1);
        setResponse(Array.isArray(response) ? newArray : { ...response, [Object.keys(response)[0]]: newArray });
        setCarouselIndex(i => Math.min(i, newArray.length - 1));
      } else {
        setResponse('');
        setCarouselIndex(0);
      }
      
    } catch (err) {
      const backendMsg = err.response?.data?.error || err.message;
      setSaveStatus('Failed to discard activity: ' + backendMsg);
      setTimeout(() => setSaveStatus(''), 7000);
    }
  };

  /**
   * Renders a skill badge with appropriate styling
   * @param {Object} skill - The skill to render
   * @param {number} index - The index of the skill
   * @returns {JSX.Element} The rendered skill badge
   */
  const renderSkillBadge = (skill, index) => {
    const isSensory = skill.category === 'Sensory Processing Skills';
    const baseClass = 'px-2 py-1 rounded text-xs font-semibold';
    const categoryClass = isSensory 
      ? 'text-white' 
      : skillCategoryColors[skill.category] || skillCategoryColors['Other'];
    
    return (
      <span
        key={index}
        className={`${baseClass} ${categoryClass} ${isSensory ? 'inline-block' : ''}`}
        style={isSensory ? {
          background: 'linear-gradient(90deg, #f472b6 0%, #fde68a 50%, #60a5fa 100%)',
        } : {}}
      >
        {skill.name} <span className="opacity-60">({skill.category})</span>
      </span>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-xl font-bold mb-4">AI Activity Suggestions for {student.name}</h3>
      
      {!hasRecentActivity ? (
        <>
          <div className="mb-4 text-amber-700 bg-amber-100 border border-amber-300 rounded p-4">
            No recent activity found for this student.<br />
            Please <b>add a recent activity</b> by editing the student profile before generating suggestions.
          </div>
          <a
            href={`/edit-student/${student._id}#recent-activity`}
            className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-4 py-2 rounded mb-2 transition"
          >
            Add Recent Activity
          </a>
        </>
      ) : (
        <>
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:opacity-50"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Suggest Activities'}
          </button>
          
          {carouselArray ? (
            <div className="mt-4 border p-4 bg-gray-50 rounded relative flex flex-col items-center">
              <div className="w-full max-w-md">
                <div className="border rounded-lg p-4 bg-white shadow">
                  <div className="font-bold text-lg mb-2">
                    {carouselArray[carouselIndex]?.['Title of Activity'] || carouselArray[carouselIndex]?.title || 'Untitled Activity'}
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold">Why it works:</span>{' '}
                    {carouselArray[carouselIndex]?.['Why it works'] || carouselArray[carouselIndex]?.why_it_works || 'No description available.'}
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold">Skills supported:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {normalizeSkills(
                        carouselArray[carouselIndex]?.['Skills supported'] || 
                        carouselArray[carouselIndex]?.skills_supported || []
                      ).map((skill, idx) => renderSkillBadge(skill, idx))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <button
                      className="flex-1 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded transition disabled:opacity-50"
                      onClick={handleSaveActivity}
                      disabled={isSampleStudent}
                    >
                      Save Activity
                    </button>
                    <button
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition disabled:opacity-50"
                      onClick={handleDiscardActivity}
                      disabled={isSampleStudent}
                    >
                      Discard
                    </button>
                  </div>
                  
                  {saveStatus && (
                    <div className={`mt-2 text-sm text-center ${
                      saveStatus.includes('saved') ? 'text-emerald-700' : 
                      saveStatus.includes('discarded') ? 'text-blue-700' : 'text-red-600'
                    }`}>
                      {saveStatus}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <button
                    className="px-3 py-1 bg-emerald-600 text-white rounded disabled:opacity-50"
                    onClick={() => setCarouselIndex(i => Math.max(i - 1, 0))}
                    disabled={carouselIndex === 0}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-500">
                    {carouselIndex + 1} / {carouselArray.length}
                  </span>
                  <button
                    className="px-3 py-1 bg-emerald-600 text-white rounded disabled:opacity-50"
                    onClick={() => setCarouselIndex(i => Math.min(i + 1, carouselArray.length - 1))}
                    disabled={carouselIndex === carouselArray.length - 1}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          ) : response ? (
            <div className="mt-4 whitespace-pre-wrap text-gray-700 border p-4 bg-gray-50 rounded">
              <pre>{typeof response === 'string' ? response : JSON.stringify(response, null, 2)}</pre>
            </div>
          ) : null}
          
          {isSampleStudent && (
            <div className="mt-2 text-sm text-amber-700">
              Note: This is a sample student. You cannot save or discard activities for sample students.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ActivitySuggestions;
