'use client';

import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

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
  // For legacy/AI categories (fallbacks)
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
 * Normalizes skills data from different formats into a consistent array of objects
 * @param {Array|string|Object} skills - The skills data to normalize
 * @returns {Array} Array of normalized skill objects with name and category
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
      // If array of objects with name and category
      if (skills.length > 0 && typeof skills[0] === 'object' && skills[0] !== null) {
        return skills.map(skill => ({
          name: skill.name || 'Unnamed Skill',
          category: skill.category || 'Other'
        }));
      }
      // If array of strings
      if (typeof skills[0] === 'string') {
        return skills.map(name => ({
          name,
          category: 'Other'
        }));
      }
    }
  } catch (error) {
    console.error('Error normalizing skills:', error);
  }
  
  return [];
};

/**
 * Extracts unique skill names from an activity
 * @param {Object} activity - The activity object
 * @returns {Set} Set of unique skill names
 */
const getSkillNames = (activity) => {
  const skills = activity['Skills supported'] || activity.skills_supported || [];
  return new Set(normalizeSkills(skills).map(skill => skill.name));
};

/**
 * Component that compares two activities and displays their differences
 */
const ActivityComparison = ({ compareActivities, setCompareActivities, setShowCompareCounter }) => {
  const compareRef = useRef(null);

  // Scroll to comparison when two activities are selected
  useEffect(() => {
    if (compareActivities.length === 2) {
      const timer = setTimeout(() => {
        compareRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [compareActivities]);

  // Don't render if no activities are selected for comparison
  if (compareActivities.length === 0) {
    return null;
  }

  // Handle clearing the comparison
  const handleClearComparison = () => {
    setCompareActivities([]);
    setShowCompareCounter?.(false);
  };

  // Render skill badges with appropriate styling
  const renderSkillBadges = (activity) => {
    const skills = normalizeSkills(activity['Skills supported'] || activity.skills_supported || []);
    
    if (skills.length === 0) {
      return <span className="text-gray-400">N/A</span>;
    }

    return (
      <div className="flex flex-wrap gap-2 mt-1">
        {skills.map((skill, idx) => (
          <span
            key={idx}
            className={`px-2 py-1 rounded text-xs font-semibold ${
              skillCategoryColors[skill.category] || skillCategoryColors['Other']
            }`}
            style={skill.category === 'Sensory Processing Skills' ? {
              background: 'linear-gradient(90deg, #f472b6 0%, #fde68a 50%, #60a5fa 100%)',
              color: '#fff',
            } : {}}
          >
            {skill.name} {skill.category !== 'Other' && (
              <span className="opacity-60">({skill.category})</span>
            )}
          </span>
        ))}
      </div>
    );
  };

  // Render the comparison view when two activities are selected
  const renderComparisonView = () => {
    if (compareActivities.length !== 2) return null;

    const [a1, a2] = compareActivities;
    const a1Skills = getSkillNames(a1);
    const a2Skills = getSkillNames(a2);
    
    const onlyA1 = [...a1Skills].filter(x => !a2Skills.has(x));
    const onlyA2 = [...a2Skills].filter(x => !a1Skills.has(x));
    const both = [...a1Skills].filter(x => a2Skills.has(x));

    return (
      <div ref={compareRef} className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-lg shadow">
        <h3 className="text-xl font-bold text-emerald-800 mb-4 text-center">Activity Comparison</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {compareActivities.map((activity, idx) => (
            <div key={`${activity._id || idx}`} className="border rounded-lg p-4 bg-white shadow flex flex-col">
              <div className="font-semibold text-lg mb-2 text-emerald-900">
                {activity['Title of Activity'] || activity.title || `Activity ${idx + 1}`}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Why it works:</span>{' '}
                {activity['Why it works'] || activity.why_it_works || <span className="text-gray-400">N/A</span>}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Skills supported:</span>
                {renderSkillBadges(activity)}
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
            </div>
          ))}
        </div>

        {/* Venn Diagram for Skills Supported */}
        <div className="flex flex-col items-center my-8">
          <h4 className="text-lg font-semibold text-emerald-700 mb-2">Skills Supported Venn Diagram</h4>
          <div className="relative flex items-center justify-center w-full max-w-xl mb-4 sm:flex-row flex-col sm:h-48 h-[28rem]">
            {/* Left circle */}
            <div className="absolute sm:left-12 left-1/2 sm:top-0 top-8 sm:translate-x-0 -translate-x-1/2 sm:w-44 sm:h-44 w-36 h-36 rounded-full bg-emerald-200 opacity-70 flex flex-col items-center justify-center border-2 border-emerald-400" style={{zIndex: 1}}>
              {onlyA1.length > 0 ? onlyA1.map((s, i) => (
                <span key={i} className="text-xs text-emerald-800 bg-white/70 rounded px-2 py-0.5 my-0.5 whitespace-nowrap">{s}</span>
              )) : <span className="text-xs text-gray-400">None</span>}
            </div>
            {/* Right circle */}
            <div className="absolute sm:right-12 left-1/2 sm:top-0 bottom-8 sm:translate-x-0 -translate-x-1/2 sm:w-44 sm:h-44 w-36 h-36 rounded-full bg-indigo-200 opacity-70 flex flex-col items-center justify-center border-2 border-indigo-400" style={{zIndex: 1}}>
              {onlyA2.length > 0 ? onlyA2.map((s, i) => (
                <span key={i} className="text-xs text-indigo-800 bg-white/70 rounded px-2 py-0.5 my-0.5 whitespace-nowrap">{s}</span>
              )) : <span className="text-xs text-gray-400">None</span>}
            </div>
            {/* Overlapping area - centered */}
            <div className="absolute sm:left-1/2 left-1/2 sm:top-0 top-1/2 sm:-translate-x-1/2 -translate-x-1/2 sm:translate-y-0 -translate-y-1/2 sm:w-44 sm:h-44 w-36 h-36 rounded-full bg-yellow-100 opacity-90 flex flex-col items-center justify-center border-2 border-yellow-400" style={{zIndex: 2}}>
              {both.length > 0 ? both.map((s, i) => (
                <span key={i} className="text-xs text-yellow-800 bg-white/70 rounded px-2 py-0.5 my-0.5 whitespace-nowrap">{s}</span>
              )) : <span className="text-xs text-gray-400">None</span>}
            </div>
          </div>
          {/* Legend below the circles */}
          <div className="flex flex-row items-center justify-center gap-4 sm:gap-8 mt-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full bg-emerald-200 border-2 border-emerald-400" />
              <span className="text-sm font-semibold text-emerald-900">
                {a1['Title of Activity'] || a1.title || 'Activity 1'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full bg-yellow-100 border-2 border-yellow-400" />
              <span className="text-sm font-semibold text-yellow-900">Both</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full bg-indigo-200 border-2 border-indigo-400" />
              <span className="text-sm font-semibold text-indigo-900">
                {a2['Title of Activity'] || a2.title || 'Activity 2'}
              </span>
            </div>
          </div>
        </div>

        <button
          className="mt-6 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded block mx-auto transition-colors"
          onClick={handleClearComparison}
        >
          Clear Comparison
        </button>
      </div>
    );
  };

  return (
    <>
      {/* Floating comparison counter */}
      {compareActivities.length < 2 && compareActivities.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-full shadow-lg animate-bounce z-50">
          Select {2 - compareActivities.length} more activity to compare
        </div>
      )}

      {renderComparisonView()}
    </>
  );
};

// Prop type validation
ActivityComparison.propTypes = {
  compareActivities: PropTypes.arrayOf(PropTypes.object).isRequired,
  setCompareActivities: PropTypes.func.isRequired,
  setShowCompareCounter: PropTypes.func,
};

export default ActivityComparison;
