/**
 * At Home Activity Generator Component
 * 
 * Interactive client component for generating personalized activities for children at home.
 * This component handles the form submission, AI generation, and activity display.
 */

'use client';

import React, { useState } from 'react';
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
    childDislikes: ''
  });
  const [parentInvolved, setParentInvolved] = useState(false);
  const [showAdditional, setShowAdditional] = useState(false);
  const [generatedActivity, setGeneratedActivity] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [showLearningOutcomes, setShowLearningOutcomes] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [discardedActivities, setDiscardedActivities] = useState([]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Generate activity based on form data
  const generateActivity = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');
    
    try {
      const response = await fetch('/api/ai/generateHomeActivity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
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
      childDislikes: ''
    });
    setParentInvolved(false);
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
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-emerald-800 mb-4 md:mb-6">
            Activity Specifications
          </h2>
          
          <form onSubmit={generateActivity} className="space-y-4 md:space-y-6">
            {/* Age */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-emerald-700 mb-1 md:mb-2">
                Child's Age
              </label>
              <select
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 md:py-2 border border-emerald-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base md:text-sm"
                required
              >
                <option value="">Select age</option>
                <option value="2-3 years">2-3 years</option>
                <option value="3-4 years">3-4 years</option>
                <option value="4-5 years">4-5 years</option>
                <option value="5-6 years">5-6 years</option>
                <option value="6-7 years">6-7 years</option>
              </select>
            </div>

            {/* Activity Location */}
            <div>
              <label htmlFor="activityLocation" className="block text-sm font-medium text-emerald-700 mb-1 md:mb-2">
                Activity Location
              </label>
              <select
                id="activityLocation"
                name="activityLocation"
                value={formData.activityLocation}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 md:py-2 border border-emerald-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base md:text-sm"
                required
              >
                <option value="">Select location</option>
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
                <option value="both">Indoor & Outdoor</option>
              </select>
            </div>

            {/* Desired Activity Length */}
            <div>
              <label htmlFor="desiredActivityLength" className="block text-sm font-medium text-emerald-700 mb-1 md:mb-2">
                Desired Activity Length
              </label>
              <select
                id="desiredActivityLength"
                name="desiredActivityLength"
                value={formData.desiredActivityLength}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 md:py-2 border border-emerald-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base md:text-sm"
                required
              >
                <option value="">Select duration</option>
                <option value="10-20 minutes">10-20 minutes</option>
                <option value="20-30 minutes">20-30 minutes</option>
                <option value="30-45 minutes">30-45 minutes</option>
                <option value="45-60 minutes">45-60 minutes</option>
                <option value="1+ hours">1+ hours</option>
              </select>
            </div>

            {/* Number of Children */}
            <div>
              <label htmlFor="numberOfChildren" className="block text-sm font-medium text-emerald-700 mb-1 md:mb-2">
                Number of Children for Activity
              </label>
              <select
                id="numberOfChildren"
                name="numberOfChildren"
                value={formData.numberOfChildren}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 md:py-2 border border-emerald-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base md:text-sm"
                required
              >
                <option value="">Select number</option>
                <option value="1">1 child (solo activity)</option>
                <option value="2">2 children</option>
                <option value="3-4">3-4 children</option>
                <option value="5+">5+ children (group activity)</option>
              </select>
            </div>

            {/* Parent Involvement Checkbox */}
            <div>
              <label className="flex items-start md:items-center">
                <input
                  type="checkbox"
                  checked={parentInvolved}
                  onChange={(e) => setParentInvolved(e.target.checked)}
                  className="mt-1 md:mt-0 mr-3 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-emerald-300 rounded flex-shrink-0"
                />
                <span className="text-sm font-medium text-emerald-700 leading-snug">
                  Parent-involved activities (requires supervision/participation)
                </span>
              </label>
            </div>

            {/* Available Time - Only show if parent involved is checked */}
            {parentInvolved && (
              <div>
                <label htmlFor="availableTime" className="block text-sm font-medium text-emerald-700 mb-1 md:mb-2">
                  Available Time for Activity
                </label>
                <select
                  id="availableTime"
                  name="availableTime"
                  value={formData.availableTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 md:py-2 border border-emerald-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base md:text-sm"
                  required={parentInvolved}
                >
                  <option value="">Select duration</option>
                  <option value="15-30 minutes">15-30 minutes</option>
                  <option value="30-45 minutes">30-45 minutes</option>
                  <option value="45-60 minutes">45-60 minutes</option>
                  <option value="1+ hours">1+ hours</option>
                </select>
              </div>
            )}

            {/* Activity Type */}
            <div>
              <label htmlFor="activityType" className="block text-sm font-medium text-emerald-700 mb-1 md:mb-2">
                Activity Type Preference
              </label>
              <select
                id="activityType"
                name="activityType"
                value={formData.activityType}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 md:py-2 border border-emerald-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base md:text-sm"
              >
                <option value="">Any type</option>
                <option value="craft">Arts & Crafts</option>
                <option value="science">Science Experiment</option>
                <option value="cooking">Cooking/Baking</option>
                <option value="game">Educational Game</option>
                <option value="physical">Physical Activity</option>
                <option value="storytelling">Storytelling</option>
                <option value="music">Music & Movement</option>
              </select>
            </div>

            {/* Enhancement Options Dropdown */}
            <div className="border border-emerald-200 rounded-lg">
              <button
                type="button"
                onClick={() => setShowAdditional(!showAdditional)}
                className="w-full flex items-center justify-between p-3 md:p-4 text-left text-emerald-700 font-medium hover:bg-emerald-50 transition-colors active:bg-emerald-100 touch-manipulation"
              >
                <span className="text-sm md:text-base">Enhancement Options</span>
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
                  {/* ...existing additional fields... */}
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
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-semibold py-3 md:py-3 px-4 md:px-6 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed text-base md:text-base touch-manipulation"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Activity...
                  </span>
                ) : (
                  'Generate Activity'
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 md:px-6 py-3 md:py-3 border-2 border-emerald-700 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer text-base md:text-base touch-manipulation"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
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

              {/* Materials Section */}
              {generatedActivity.materials && (
                <div className="bg-white p-3 md:p-4 rounded-lg border border-emerald-200">
                  <h4 className="font-semibold text-emerald-800 mb-2 md:mb-3 flex items-center text-sm md:text-base">
                    <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
