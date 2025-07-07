/**
 * At Home Activity Generator Component
 * 
 * Interactive client component for generating personalized activities for children at home.
 * This component handles the form submission, AI generation, and activity display.
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';

/**
 * AtHomeActivityGenerator Component
 * 
 * Interactive form and activity generation functionality
 * 
 * @returns {JSX.Element} Activity generator form and results
 */
const AtHomeActivityGenerator = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    age: '',
    interests: '',
    personality: '',
    developmentalStage: '',
    availableTime: '',
    availableMaterials: '',
    learningGoals: '',
    activityType: '',
    activityLocation: '',
    desiredActivityLength: '',
    numberOfChildren: '',
    childDislikes: '',
    basicMaterials: []
  });
  const [parentInvolved, setParentInvolved] = useState('none'); // 'none', 'minimal', 'full'
  const [showAdditional, setShowAdditional] = useState(false);
  const [generatedActivity, setGeneratedActivity] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [showLearningOutcomes, setShowLearningOutcomes] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [discardedActivities, setDiscardedActivities] = useState([]);
  const resultsRef = useRef(null);

  // Scroll to results on mobile when activity is generated
  useEffect(() => {
    if (generatedActivity && window.innerWidth < 768) { // 768px is a common breakpoint for mobile
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [generatedActivity]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle material selection
  const handleMaterialToggle = (material) => {
    setFormData(prev => ({
      ...prev,
      basicMaterials: prev.basicMaterials.includes(material)
        ? prev.basicMaterials.filter(m => m !== material)
        : [...prev.basicMaterials, material]
    }));
  };

  // Generate activity based on form data
  const generateActivity = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');
    
    try {
      // Map selected basic materials to availableMaterials field
      const materialLabels = {
        paper: 'Paper/Cardboard',
        drawing: 'Crayons/Markers/Pencils',
        adhesive: 'Glue/Tape',
        scissors: 'Scissors',
        recyclables: 'Recyclables',
        kitchen: 'Kitchen Utensils',
        nature: 'Nature Items',
        fabric: 'Old Clothes/Fabric',
        water: 'Water',
        clay: 'Play Dough/Clay'
      };
      
      const selectedMaterialsText = formData.basicMaterials
        .map(id => materialLabels[id])
        .join(', ');
      
      const response = await fetch('/api/ai/generateHomeActivity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          numberOfChildren: formData.numberOfChildren || '1',
          availableMaterials: selectedMaterialsText || formData.availableMaterials,
          parentInvolved,
          discardedActivities
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate activity');
      }

      const data = await response.json();
      setGeneratedActivity(data.activity);
    } catch (error) {
      console.error('Error generating activity:', error);
      setError('Failed to generate activity. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset form and generated activity
  const resetForm = () => {
    setFormData({
      age: '',
      interests: '',
      personality: '',
      developmentalStage: '',
      availableTime: '',
      availableMaterials: '',
      learningGoals: '',
      activityType: '',
      activityLocation: '',
      desiredActivityLength: '',
      numberOfChildren: '',
      childDislikes: '',
      basicMaterials: []
    });
    setParentInvolved('none');
    setShowAdditional(false);
    setGeneratedActivity(null);
    setError('');
    setDiscardedActivities([]);
  };

  // Copy activity to clipboard
  const copyActivityToClipboard = async () => {
    if (!generatedActivity) return;

    try {
      const activityText = `
${generatedActivity.title}

${generatedActivity.description}

Materials Needed:
${generatedActivity.materials ? generatedActivity.materials.map(material => `• ${material}`).join('\n') : 'No specific materials listed'}

Instructions:
${generatedActivity.instructions ? generatedActivity.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n') : 'No instructions provided'}

Learning Outcomes:
${generatedActivity.learningOutcomes ? generatedActivity.learningOutcomes.map(outcome => `• ${outcome}`).join('\n') : 'No learning outcomes listed'}

Tips for Parents:
${generatedActivity.tips ? generatedActivity.tips.map(tip => `• ${tip}`).join('\n') : 'No tips provided'}

Generated on: ${new Date().toLocaleDateString()}
      `.trim();

      await navigator.clipboard.writeText(activityText);
      setIsCopied(true);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy activity:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = activityText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Discard current activity and generate a new one
  const discardActivity = () => {
    if (generatedActivity) {
      setDiscardedActivities(prev => [...prev, {
        title: generatedActivity.title,
        description: generatedActivity.description
      }]);
      generateActivity(new Event('submit'));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-16">
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mt-6">
          <h2 className="text-xl md:text-2xl font-bold text-emerald-800 mb-4 md:mb-6">
            Activity Specifications
          </h2>
          
          <form onSubmit={generateActivity} className="space-y-4 md:space-y-6">
            {/* Age */}
            <div>
              <label htmlFor="age" className="flex items-center text-sm font-medium text-emerald-700 mb-1 md:mb-2">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5L13.5 6L8.5 6L7 7.5L1 7V9L7 8.5V11C7 13.3 8.7 15 11 15H13C15.3 15 17 13.3 17 11V8.5L21 9ZM19 17V15.5L17 15L15.5 16.5V20.5L17 22H19V20L21 19V17H19Z"/>
                </svg>
                Child's Age *
              </label>
              <select
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base transition-colors hover:border-emerald-400"
              >
                <option value="">Choose your child's age range</option>
                <option value="2-3 years">2-3 years (Toddler)</option>
                <option value="3-4 years">3-4 years (Preschooler)</option>
                <option value="4-5 years">4-5 years (Pre-K)</option>
                <option value="5-6 years">5-6 years (Kindergarten)</option>
                <option value="6-7 years">6-7 years (1st Grade)</option>
                <option value="7-8 years">7-8 years (2nd Grade)</option>
                <option value="8-9 years">8-9 years (3rd Grade)</option>
                <option value="9-10 years">9-10 years (4th Grade)</option>
              </select>
            </div>

            {/* Activity Location */}
            <div>
              <label htmlFor="activityLocation" className="flex items-center text-sm font-medium text-emerald-700 mb-1 md:mb-2">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Activity Location *
              </label>
              <select
                id="activityLocation"
                name="activityLocation"
                value={formData.activityLocation}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base transition-colors hover:border-emerald-400"
              >
                <option value="">Where will the activity happen?</option>
                <option value="indoor">🏠 Indoor (Living room, bedroom, kitchen)</option>
                <option value="outdoor">🌳 Outdoor (Backyard, park, garden)</option>
                <option value="both">🏠🌳 Indoor & Outdoor (Flexible location)</option>
              </select>
            </div>

            {/* Desired Activity Length */}
            <div>
              <label htmlFor="desiredActivityLength" className="flex items-center text-sm font-medium text-emerald-700 mb-1 md:mb-2">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                How long should the activity last? *
              </label>
              <select
                id="desiredActivityLength"
                name="desiredActivityLength"
                value={formData.desiredActivityLength}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base transition-colors hover:border-emerald-400"
              >
                <option value="">Choose activity duration</option>
                <option value="10-20 minutes">10-20 minutes (Quick activity)</option>
                <option value="20-30 minutes">20-30 minutes (Short activity)</option>
                <option value="30-45 minutes">30-45 minutes (Medium activity)</option>
                <option value="45-60 minutes">45-60 minutes (Long activity)</option>
                <option value="1+ hours">1+ hours (Extended project)</option>
              </select>
            </div>

            {/* Parent Involvement Level */}
            <div>
              <label className="flex items-center text-sm font-medium text-emerald-700 mb-3">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                How much do you want to be involved? *
              </label>
              <div className="space-y-3">
                <label className="flex items-start p-3 border border-emerald-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="parentInvolvement"
                    value="none"
                    checked={parentInvolved === 'none'}
                    onChange={(e) => setParentInvolved(e.target.value)}
                    className="mt-1 mr-3 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-emerald-300 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="text-lg mr-2">🚀</span>
                      <span className="text-sm font-medium text-emerald-700">
                        Independent Play
                      </span>
                    </div>
                    <p className="text-xs text-emerald-600">
                      My child can do this completely on their own (safest materials only)
                    </p>
                  </div>
                </label>
                
                <label className="flex items-start p-3 border border-emerald-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="parentInvolvement"
                    value="minimal"
                    checked={parentInvolved === 'minimal'}
                    onChange={(e) => setParentInvolved(e.target.value)}
                    className="mt-1 mr-3 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-emerald-300 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="text-lg mr-2">👀</span>
                      <span className="text-sm font-medium text-emerald-700">
                        Light Supervision
                      </span>
                    </div>
                    <p className="text-xs text-emerald-600">
                      I'll be nearby for help but my child works mostly independently
                    </p>
                  </div>
                </label>
                
                <label className="flex items-start p-3 border border-emerald-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="parentInvolvement"
                    value="full"
                    checked={parentInvolved === 'full'}
                    onChange={(e) => setParentInvolved(e.target.value)}
                    className="mt-1 mr-3 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-emerald-300 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="text-lg mr-2">👥</span>
                      <span className="text-sm font-medium text-emerald-700">
                        Active Participation
                      </span>
                    </div>
                    <p className="text-xs text-emerald-600">
                      I want to be actively involved throughout the activity
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Available Time - Only show if parent involved is minimal or full */}
            {(parentInvolved === 'minimal' || parentInvolved === 'full') && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label htmlFor="availableTime" className="flex items-center text-sm font-medium text-blue-700 mb-2">
                  <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  How much time can you dedicate? *
                </label>
                <select
                  id="availableTime"
                  name="availableTime"
                  value={formData.availableTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors hover:border-blue-400 bg-white"
                >
                  <option value="">Select your available time</option>
                  <option value="15-30 minutes">⏱️ 15-30 minutes (Quick help)</option>
                  <option value="30-45 minutes">⏰ 30-45 minutes (Moderate involvement)</option>
                  <option value="45-60 minutes">🕐 45-60 minutes (Extended time)</option>
                  <option value="1+ hours">⏳ 1+ hours (Full participation)</option>
                </select>
              </div>
            )}

            {/* Activity Type */}
            <div>
              <label htmlFor="activityType" className="flex items-center text-sm font-medium text-emerald-700 mb-1 md:mb-2">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4 4 4 0 004-4V5z" />
                </svg>
                What type of activity do you prefer? (Optional)
              </label>
              <select
                id="activityType"
                name="activityType"
                value={formData.activityType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base transition-colors hover:border-emerald-400"
              >
                <option value="">🎯 Any type (Surprise me!)</option>
                <option value="craft">🎨 Arts & Crafts</option>
                <option value="science">🔬 Science Experiment</option>
                <option value="cooking">👩‍🍳 Cooking/Baking</option>
                <option value="game">🎲 Educational Game</option>
                <option value="physical">🏃‍♂️ Physical Activity</option>
                <option value="storytelling">📚 Storytelling</option>
                <option value="music">🎵 Music & Movement</option>
              </select>
            </div>

            {/* Basic Materials Available */}
            <div>
              <label className="flex items-center text-sm font-medium text-emerald-700 mb-3">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 002 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v2M7 7h10" />
                </svg>
                What basic materials do you have available? (Optional)
              </label>
              <p className="text-xs text-emerald-600 mb-3">Select any materials you have at home - this helps create more personalized activities</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                {[
                  { id: 'paper', label: 'Paper/Cardboard', icon: '📄' },
                  { id: 'drawing', label: 'Crayons/Markers', icon: '🖍️' },
                  { id: 'adhesive', label: 'Glue/Tape', icon: '📎' },
                  { id: 'scissors', label: 'Scissors', icon: '✂️' },
                  { id: 'recyclables', label: 'Recyclables', icon: '♻️' },
                  { id: 'kitchen', label: 'Kitchen Utensils', icon: '🥄' },
                  { id: 'nature', label: 'Nature Items', icon: '🍃' },
                  { id: 'fabric', label: 'Old Clothes/Fabric', icon: '👕' },
                  { id: 'water', label: 'Water', icon: '💧' },
                  { id: 'clay', label: 'Play Dough/Clay', icon: '🎨' }
                ].map((material) => (
                  <button
                    key={material.id}
                    type="button"
                    onClick={() => handleMaterialToggle(material.id)}
                    className={`p-3 border-2 rounded-lg transition-all duration-200 text-center touch-manipulation ${
                      formData.basicMaterials.includes(material.id)
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md'
                        : 'border-emerald-200 bg-white text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    <div className="text-lg mb-1">{material.icon}</div>
                    <div className="text-xs font-medium leading-tight">{material.label}</div>
                  </button>
                ))}
              </div>
              {formData.basicMaterials.length > 0 && (
                <div className="mt-3 p-2 bg-emerald-50 rounded-lg">
                  <p className="text-xs text-emerald-700">
                    ✓ Selected: {formData.basicMaterials.length} material{formData.basicMaterials.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>

            {/* Enhancement Options Dropdown */}
            <div className="border border-emerald-200 rounded-lg">
              <button
                type="button"
                onClick={() => setShowAdditional(!showAdditional)}
                className="w-full flex items-center justify-between p-3 md:p-4 text-left text-emerald-700 font-medium hover:bg-emerald-50 transition-colors active:bg-emerald-100 touch-manipulation"
              >
                <span className="text-sm md:text-base flex items-center">
                  <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Enhancement Options
                </span>
                <svg
                  className={`w-5 h-5 transition-transform ${showAdditional ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showAdditional && (
                <div className="p-3 md:p-4 border-t border-emerald-200 space-y-3 md:space-y-4">
                  {/* Number of Children */}
                  <div>
                    <label htmlFor="numberOfChildren" className="block text-sm font-medium text-emerald-700 mb-1 md:mb-2">
                      How many children will participate?
                    </label>
                    <select
                      id="numberOfChildren"
                      name="numberOfChildren"
                      value={formData.numberOfChildren}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 md:py-2 border border-emerald-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base md:text-sm"
                    >
                      <option value="">Select number of children (Default: 1)</option>
                      <option value="1">1 child (Solo activity)</option>
                      <option value="2">2 children (Pair activity)</option>
                      <option value="3-4">3-4 children (Small group)</option>
                      <option value="5+">5+ children (Large group activity)</option>
                    </select>
                  </div>

                  {/* Personality */}
                  <div>
                    <label htmlFor="personality" className="block text-sm font-medium text-emerald-700 mb-1 md:mb-2">
                      Personality Traits
                    </label>
                    <select
                      id="personality"
                      name="personality"
                      value={formData.personality}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 md:py-2 border border-emerald-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base md:text-sm"
                    >
                      <option value="">Select personality type</option>
                      <option value="active">Active & Energetic</option>
                      <option value="calm">Calm & Thoughtful</option>
                      <option value="creative">Creative & Imaginative</option>
                      <option value="social">Social & Outgoing</option>
                      <option value="analytical">Analytical & Curious</option>
                    </select>
                  </div>

                  {/* Interests */}
                  <div>
                    <label htmlFor="interests" className="block text-sm font-medium text-emerald-700 mb-1 md:mb-2">
                      Interests & Favorite Things
                    </label>
                    <textarea
                      id="interests"
                      name="interests"
                      value={formData.interests}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2.5 md:py-2 border border-emerald-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base md:text-sm resize-none"
                      placeholder="e.g., dinosaurs, princesses, building blocks, drawing, music..."
                    />
                  </div>

                  {/* Child Dislikes */}
                  <div>
                    <label htmlFor="childDislikes" className="block text-sm font-medium text-emerald-700 mb-1 md:mb-2">
                      Things Your Child Dislikes or Avoids
                    </label>
                    <textarea
                      id="childDislikes"
                      name="childDislikes"
                      value={formData.childDislikes}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2.5 md:py-2 border border-emerald-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base md:text-sm resize-none"
                      placeholder="e.g., loud noises, messy activities, certain textures, specific themes..."
                    />
                  </div>

                  {/* Developmental Stage */}
                  <div>
                    <label htmlFor="developmentalStage" className="block text-sm font-medium text-emerald-700 mb-1 md:mb-2">
                      Skills Focus
                    </label>
                    <select
                      id="developmentalStage"
                      name="developmentalStage"
                      value={formData.developmentalStage}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 md:py-2 border border-emerald-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base md:text-sm"
                    >
                      <option value="">Any skills area</option>
                      <option value="fine motor">Fine Motor Skills</option>
                      <option value="gross motor">Gross Motor Skills</option>
                      <option value="language">Language Development</option>
                      <option value="cognitive">Cognitive Skills</option>
                      <option value="social">Social Skills</option>
                      <option value="emotional">Emotional Development</option>
                    </select>
                  </div>

                  {/* Available Materials */}
                  <div>
                    <label htmlFor="availableMaterials" className="block text-sm font-medium text-emerald-700 mb-1 md:mb-2">
                      Available Materials at Home
                    </label>
                    <textarea
                      id="availableMaterials"
                      name="availableMaterials"
                      value={formData.availableMaterials}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2.5 md:py-2 border border-emerald-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base md:text-sm resize-none"
                      placeholder="e.g., paper, crayons, play dough, cardboard boxes, kitchen items..."
                    />
                  </div>

                  {/* Learning Goals */}
                  <div>
                    <label htmlFor="learningGoals" className="block text-sm font-medium text-emerald-700 mb-1 md:mb-2">
                      Learning Goals
                    </label>
                    <textarea
                      id="learningGoals"
                      name="learningGoals"
                      value={formData.learningGoals}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2.5 md:py-2 border border-emerald-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base md:text-sm resize-none"
                      placeholder="What would you like your child to learn or practice?"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 md:p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm md:text-base">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <button
                type="submit"
                disabled={isGenerating}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-emerald-300 disabled:to-emerald-400 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none touch-manipulation"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Your Perfect Activity...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate My Activity
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-4 border-2 border-emerald-600 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 hover:border-emerald-700 active:bg-emerald-100 transition-all duration-200 cursor-pointer text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 touch-manipulation flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Start Over
              </button>
            </div>
          </form>
          
          {/* Helpful Tips */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-4 mt-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <div>
                <h4 className="font-semibold text-emerald-800 mb-2">Quick Tips for Better Activities:</h4>
                <ul className="text-sm text-emerald-700 space-y-1">
                  <li>• The more details you provide in Enhancement Options, the more personalized your activity will be!</li>
                  <li>• Don't like an activity? Use "Generate Another" to get a different suggestion</li>
                  <li>• All activities are designed to be safe and age-appropriate</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div ref={resultsRef} className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mt-6">
          <h2 className="text-xl md:text-2xl font-bold text-emerald-800 mb-4 md:mb-6">
            Generated Activity
          </h2>
          
          {!generatedActivity && !isGenerating && (
            <div className="text-center py-8 md:py-12">
              <div className="text-4xl md:text-6xl mb-3 md:mb-4">🎨</div>
              <p className="text-emerald-600 text-base md:text-lg px-4">
                Fill out the form to generate a personalized activity for your child!
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="text-center py-8 md:py-12">
              <div className="animate-spin text-4xl md:text-6xl mb-3 md:mb-4">⚡</div>
              <p className="text-emerald-600 text-base md:text-lg px-4">
                Creating a perfect activity for your child...
              </p>
            </div>
          )}

          {generatedActivity && (
            <div className="space-y-4 md:space-y-6">
              {/* Activity Header */}
              <div className="bg-emerald-50 p-3 md:p-4 rounded-lg border border-emerald-200">
                <h3 className="text-lg md:text-xl font-bold text-emerald-800 mb-2">
                  {generatedActivity.title}
                </h3>
                <p className="text-emerald-700 text-sm md:text-base leading-relaxed">
                  {generatedActivity.description}
                </p>
              </div>

              {/* Instructions Section */}
              {generatedActivity.instructions && (
                <div className="bg-white p-3 md:p-4 rounded-lg border border-emerald-200">
                  <h4 className="font-semibold text-emerald-800 mb-2 md:mb-3 flex items-center text-sm md:text-base">
                    <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Instructions
                  </h4>
                  <ol className="list-decimal list-inside text-emerald-700 space-y-2 text-sm md:text-base">
                    {generatedActivity.instructions.map((instruction, index) => (
                      <li key={index} className="leading-relaxed">{instruction}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Materials Section */}
              {generatedActivity.materials && (
                <div className="bg-white p-3 md:p-4 rounded-lg border border-emerald-200">
                  <h4 className="font-semibold text-emerald-800 mb-2 md:mb-3 flex items-center text-sm md:text-base">
                    <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Materials Needed
                  </h4>
                  <ul className="list-disc list-inside text-emerald-700 space-y-1 text-sm md:text-base">
                    {generatedActivity.materials.map((material, index) => (
                      <li key={index} className="leading-relaxed">{material}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Learning Outcomes Dropdown */}
              {generatedActivity.learningOutcomes && (
                <div className="bg-white rounded-lg border border-emerald-200 shadow-sm">
                  <button
                    onClick={() => setShowLearningOutcomes(!showLearningOutcomes)}
                    className="w-full text-left p-3 md:p-4 font-semibold text-emerald-800 hover:bg-emerald-50 active:bg-emerald-100 transition-colors cursor-pointer flex items-center justify-between rounded-lg touch-manipulation"
                  >
                    <span className="flex items-center text-sm md:text-base">
                      <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Learning Outcomes
                    </span>
                    <svg 
                      className={`w-4 h-4 md:w-5 md:h-5 transform transition-transform flex-shrink-0 ${showLearningOutcomes ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showLearningOutcomes && (
                    <div className="p-3 md:p-4 pt-0 border-t border-emerald-200">
                      <ul className="list-disc list-inside text-emerald-700 space-y-2 text-sm md:text-base">
                        {generatedActivity.learningOutcomes.map((outcome, index) => (
                          <li key={index} className="leading-relaxed">{outcome}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Tips for Parents Dropdown */}
              {generatedActivity.tips && (
                <div className="bg-white rounded-lg border border-emerald-200 shadow-sm">
                  <button
                    onClick={() => setShowTips(!showTips)}
                    className="w-full text-left p-3 md:p-4 font-semibold text-emerald-800 hover:bg-emerald-50 active:bg-emerald-100 transition-colors cursor-pointer flex items-center justify-between rounded-lg touch-manipulation"
                  >
                    <span className="flex items-center text-sm md:text-base">
                      <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m-1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Tips for Parents
                    </span>
                    <svg 
                      className={`w-4 h-4 md:w-5 md:h-5 transform transition-transform flex-shrink-0 ${showTips ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showTips && (
                    <div className="p-3 md:p-4 pt-0 border-t border-emerald-200">
                      <ul className="list-disc list-inside text-emerald-700 space-y-2 text-sm md:text-base">
                        {generatedActivity.tips.map((tip, index) => (
                          <li key={index} className="leading-relaxed">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="bg-emerald-50 p-3 md:p-4 rounded-lg border border-emerald-200">
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                  <button
                    onClick={copyActivityToClipboard}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-3 md:px-4 rounded-lg transition-colors cursor-pointer flex items-center justify-center text-sm md:text-base touch-manipulation"
                  >
                    <FontAwesomeIcon 
                      icon={isCopied ? faCheck : faCopy} 
                      className="mr-2 text-sm md:text-base" 
                    />
                    {isCopied ? 'Copied!' : 'Copy Activity'}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold py-3 px-3 md:px-4 rounded-lg transition-colors cursor-pointer flex items-center justify-center text-sm md:text-base touch-manipulation"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Activity
                  </button>
                  <button
                    onClick={discardActivity}
                    className="flex-1 border-2 border-emerald-700 text-emerald-700 font-semibold py-3 px-3 md:px-4 rounded-lg hover:bg-emerald-50 active:bg-emerald-100 transition-colors cursor-pointer flex items-center justify-center text-sm md:text-base touch-manipulation"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="hidden sm:inline">Generate Another</span>
                    <span className="sm:hidden">New Activity</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default AtHomeActivityGenerator;
