'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { FaArrowLeft, FaEye, FaTrash, FaDownload, FaCopy } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { jsPDF } from 'jspdf';

/**
 * SavedStoriesPage Component
 * 
 * Displays all saved stories for all students belonging to the authenticated user.
 * Provides functionality to view, delete, download, and copy stories.
 */
const SavedStoriesPage = () => {
  // State management
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedStory, setExpandedStory] = useState(null);
  
  // Next.js routing and authentication
  const router = useRouter();
  const { token } = useUser();

  // Fetch students and their saved stories
  useEffect(() => {
    const fetchStudentsWithSavedStories = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Check authentication
        if (!token) {
          setError('No authentication token found. Please log in.');
          setLoading(false);
          return;
        }

        // Fetch students
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
        
        // Filter students who have saved stories
        const studentsWithSavedStories = studentsData.filter(student => 
          student.saved_stories && student.saved_stories.length > 0
        );
        
        setStudents(studentsWithSavedStories);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load students with saved stories.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStudentsWithSavedStories();
    }
  }, [token]);

  // Delete a specific story
  const handleDeleteStory = async (studentId, storyIndex) => {
    try {
      const response = await fetch(`/api/students/${studentId}/saved-stories?storyIndex=${storyIndex}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete story');
      }

      // Update local state
      setStudents(prevStudents => 
        prevStudents.map(student => {
          if (student._id === studentId) {
            const updatedStories = [...student.saved_stories];
            updatedStories.splice(storyIndex, 1);
            return { ...student, saved_stories: updatedStories };
          }
          return student;
        }).filter(student => student.saved_stories.length > 0)
      );

      toast.success('Story deleted successfully!');
      setExpandedStory(null);
    } catch (err) {
      console.error('Error deleting story:', err);
      toast.error('Failed to delete story. Please try again.');
    }
  };

  // Download story as PDF
  const handleDownloadPdf = (story, studentName) => {
    const doc = new jsPDF();
    const title = story.title || 'Saved Story';
    const content = story.content || '';
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 15, 20);
    
    // Add content with word wrap
    const splitText = doc.splitTextToSize(content, 180);
    doc.setFontSize(12);
    doc.text(splitText, 15, 40);
    
    // Add footer
    const date = story.generatedAt ? new Date(story.generatedAt).toLocaleDateString() : new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Generated for ${studentName} on ${date}`, 15, doc.internal.pageSize.height - 10);
    
    // Save the PDF
    doc.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${studentName}.pdf`);
    toast.success('PDF downloaded successfully!');
  };

  // Copy story to clipboard
  const handleCopyToClipboard = async (story) => {
    try {
      await navigator.clipboard.writeText(`${story.title}\n\n${story.content}`);
      toast.success('Story copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy story to clipboard');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <div className="p-8 text-center">Loading saved stories...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-emerald-700 hover:text-emerald-800 transition-colors"
            aria-label="Go back"
          >
            <FaArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h2 className="text-3xl font-bold text-emerald-800">Saved Stories</h2>
        </div>
        <div className="text-sm text-gray-600">
          {students.length} student{students.length !== 1 ? 's' : ''} with saved stories
        </div>
      </div>

      {/* No stories message */}
      {students.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-600 mb-4">No saved stories found.</div>
          <button
            onClick={() => router.push('/students')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded transition-colors"
          >
            View Students
          </button>
        </div>
      ) : (
        /* Students and their stories */
        <div className="space-y-8">
          {students.map(student => (
            <div key={student._id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Student header */}
              <div className="bg-emerald-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-emerald-900">
                    {student.name}
                  </h3>
                  <div className="text-sm text-emerald-700">
                    {student.saved_stories.length} saved stor{student.saved_stories.length !== 1 ? 'ies' : 'y'}
                  </div>
                </div>
              </div>

              {/* Stories list */}
              <div className="divide-y divide-gray-200">
                {student.saved_stories.map((story, storyIndex) => (
                  <div key={storyIndex} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          {story.title || `Story ${storyIndex + 1}`}
                        </h4>
                        <p className="text-sm text-gray-500 mb-3">
                          Generated on {formatDate(story.generatedAt)}
                        </p>
                        {story.context && (
                          <p className="text-sm text-gray-600 mb-3">
                            <span className="font-medium">Context:</span> {story.context}
                          </p>
                        )}
                        
                        {/* Story preview */}
                        <div className="text-gray-700">
                          {expandedStory === `${student._id}-${storyIndex}` ? (
                            <div className="whitespace-pre-line">{story.content}</div>
                          ) : (
                            <div>
                              {story.content && story.content.length > 200 
                                ? `${story.content.substring(0, 200)}...` 
                                : story.content
                              }
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col space-y-2 ml-4">
                        <button
                          onClick={() => setExpandedStory(
                            expandedStory === `${student._id}-${storyIndex}` 
                              ? null 
                              : `${student._id}-${storyIndex}`
                          )}
                          className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                          title={expandedStory === `${student._id}-${storyIndex}` ? 'Collapse' : 'Expand'}
                        >
                          <FaEye className="w-4 h-4 mr-1" />
                          {expandedStory === `${student._id}-${storyIndex}` ? 'Collapse' : 'View Full'}
                        </button>
                        
                        <button
                          onClick={() => handleCopyToClipboard(story)}
                          className="flex items-center text-green-600 hover:text-green-800 text-sm"
                          title="Copy to clipboard"
                        >
                          <FaCopy className="w-4 h-4 mr-1" />
                          Copy
                        </button>
                        
                        <button
                          onClick={() => handleDownloadPdf(story, student.name)}
                          className="flex items-center text-purple-600 hover:text-purple-800 text-sm"
                          title="Download as PDF"
                        >
                          <FaDownload className="w-4 h-4 mr-1" />
                          PDF
                        </button>
                        
                        <button
                          onClick={() => handleDeleteStory(student._id, storyIndex)}
                          className="flex items-center text-red-600 hover:text-red-800 text-sm"
                          title="Delete story"
                        >
                          <FaTrash className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedStoriesPage;
