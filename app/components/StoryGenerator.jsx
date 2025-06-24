'use client';

import { useState, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { FaTimes, FaCopy, FaShareAlt, FaFilePdf } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import { toast } from 'react-hot-toast';

// TypeScript types for better code completion and type safety
/**
 * @typedef {Object} Story
 * @property {string} title - The title of the story
 * @property {string} content - The content of the story
 * @property {string} [generatedAt] - ISO date string when the story was generated
 * @property {string} [context] - The context used to generate the story
 */

/**
 * @typedef {Object} StoryGeneratorProps
 * @property {Object} student - The student object
 * @property {string} student._id - Student ID
 * @property {string} student.name - Student name
 * @property {number} student.age_months - Student age in months
 * @property {string[]} [student.interests] - Student interests
 * @property {Object} [student.personality] - Student personality traits
 */

/**
 * Component for generating and managing AI-powered stories for students
 * @param {StoryGeneratorProps} props - Component props
 */
const StoryGenerator = ({ student }) => {
  // State management
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [context, setContext] = useState('');
  const [story, setStory] = useState(/** @type {Story | null} */ (null));
  const [lastInput, setLastInput] = useState('');
  const [saving, setSaving] = useState(false);
  const { token } = useUser();

  // Handlers
  const handleOpenModal = useCallback(() => {
    setShowModal(true);
    setContext('');
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setContext('');
  }, []);

  /**
   * Generate a story based on the provided context
   * @param {React.FormEvent} e - Form submission event
   */
  const handleGenerateStory = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Please log in to generate stories.');
      return;
    }

    const trimmedContext = context.trim();
    if (!trimmedContext) {
      toast.error('Please provide some context or scenario for the story.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/generate-story', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        credentials: 'include',
        body: JSON.stringify({
          studentName: student.name,
          age: student.age_months,
          context: trimmedContext,
          interests: student.interests || [],
          personality: student.personality || {}
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      const data = await response.json();
      setStory({
        ...data.story,
        context: trimmedContext
      });
      setLastInput(trimmedContext);
      setShowModal(false);
      toast.success('Story generated successfully!');
    } catch (error) {
      console.error('Error generating story:', error);
      toast.error('Failed to generate story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save the current story to the database
   */
  const handleSaveStory = async () => {
    if (!token || !story) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/students/${student._id}/stories`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        credentials: 'include',
        body: JSON.stringify({
          title: story.title,
          content: story.content,
          context: story.context || lastInput,
          studentName: student.name
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save story');
      }

      toast.success('Story saved successfully!');
    } catch (error) {
      console.error('Error saving story:', error);
      toast.error('Failed to save story. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Regenerate the story with the last used context
   */
  const handleRegenerateStory = async () => {
    if (!token || !lastInput) return;

    setLoading(true);
    try {
      const response = await fetch('/api/ai/generate-story', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        credentials: 'include',
        body: JSON.stringify({
          studentName: student.name,
          age: student.age_months,
          context: lastInput,
          interests: student.interests || [],
          personality: student.personality || {}
        })
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate story');
      }

      const data = await response.json();
      setStory({
        ...data.story,
        context: lastInput
      });
      toast.success('Story regenerated successfully!');
    } catch (error) {
      console.error('Error regenerating story:', error);
      toast.error('Failed to regenerate story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Download the current story as a PDF
   */
  const handleDownloadPdf = () => {
    if (!story) return;
    
    const doc = new jsPDF();
    const title = story.title || 'Story';
    const content = story.content || '';
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 15, 20);
    
    // Add content with word wrap
    const splitText = doc.splitTextToSize(content, 180);
    doc.setFontSize(12);
    doc.text(splitText, 15, 40);
    
    // Add footer
    const date = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Generated for ${student.name} on ${date}`, 15, doc.internal.pageSize.height - 10);
    
    // Save the PDF
    doc.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${student.name}.pdf`);
    toast.success('PDF downloaded successfully!');
  };

  /**
   * Copy the story to the clipboard
   */
  const handleCopyToClipboard = async () => {
    if (!story) return;
    
    try {
      await navigator.clipboard.writeText(`${story.title}\n\n${story.content}`);
      toast.success('Story copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy story to clipboard');
    }
  };

  /**
   * Share the story using the Web Share API
   */
  const handleShareStory = async () => {
    if (!story || !navigator.share) return;
    
    try {
      await navigator.share({
        title: story.title,
        text: `${story.title}\n\n${story.content}`,
        url: window.location.href
      });
    } catch (error) {
      // Sharing was cancelled or failed
      if (error.name !== 'AbortError') {
        console.error('Error sharing story:', error);
      }
    }
  };

  return (
    <div className="bg-white/90 p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-xl font-bold mb-4">Create a Story</h3>
      <p className="text-gray-700 mb-4">
        Generate a personalized story for {student.name} based on a specific context or scenario.
      </p>
      
      <button
        onClick={handleOpenModal}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded transition disabled:opacity-50"
      >
        {loading ? 'Generating Story...' : 'Create a Story'}
      </button>

      {/* Context Input Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-800">Create a Story for {student.name}</h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
                disabled={loading}
                aria-label="Close modal"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleGenerateStory} className="flex-1 flex flex-col p-4 overflow-hidden">
              <div className="mb-4">
                <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-2">
                  Context / Scenario
                </label>
                <textarea
                  id="context"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={`Describe what happened or the situation you'd like the story to be about. For example: "${student.name} was playing at the park when they found a mysterious key in the sandbox..."`}
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  disabled={loading}
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Provide details about the situation, event, or theme you'd like the story to be based on.
                </p>
              </div>

              <div className="mt-auto pt-4 border-t flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !context.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Story Display */}
      {story && story.title && story.content && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start mb-3">
            <h4 className="text-lg font-semibold">{story.title}</h4>
            <button 
              onClick={() => setStory(null)}
              className="text-gray-500 hover:text-gray-700"
              disabled={loading}
              aria-label="Close story"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
          <div className="prose max-w-none">
            <p className="whitespace-pre-line text-gray-800">{story.content}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            {/* Save Story Button */}
            <button
              onClick={handleSaveStory}
              disabled={saving || !token}
              className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded flex items-center gap-1 disabled:opacity-50"
              title={!token ? 'Login required to save stories' : 'Save this story'}
            >
              {saving ? 'Saving...' : 'Save Story'}
            </button>
            
            {/* Regenerate Story Button */}
            <button
              onClick={handleRegenerateStory}
              disabled={loading || !lastInput}
              className="text-sm bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-1 rounded flex items-center gap-1 disabled:opacity-50"
              title="Generate a new story with the same context"
            >
              Regenerate Story
            </button>
            
            {/* Download as PDF Button */}
            <button 
              onClick={handleDownloadPdf}
              className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded flex items-center gap-1"
              title="Download as PDF"
            >
              <FaFilePdf className="inline" /> PDF
            </button>
            
            {/* Copy to Clipboard Button */}
            <button
              onClick={handleCopyToClipboard}
              className="text-sm bg-green-100 hover:bg-green-200 text-green-800 p-1.5 rounded flex items-center justify-center"
              title="Copy story to clipboard"
            >
              <FaCopy className="w-4 h-4" />
            </button>
            
            {/* Share Button (Web Share API) */}
            {typeof navigator !== 'undefined' && navigator.share && (
              <button
                onClick={handleShareStory}
                className="text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 p-1.5 rounded flex items-center justify-center"
                title="Share story"
              >
                <FaShareAlt className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryGenerator;
