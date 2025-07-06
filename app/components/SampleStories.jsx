'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaCopy, FaFilePdf, FaShare } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

const featuredStories = [
  {
    id: 1,
    title: 'Emma\'s First Day',
    date: 'June 22, 2025',
    category: 'Individual Story',
    content: 'Emma walked into the classroom with wide eyes, clutching her favorite teddy bear. At first, she stayed close to the door, watching the other children play. Then, she noticed Sarah building with blocks. "Can I help?" Emma asked softly. Sarah smiled and nodded. Together, they built the tallest tower the class had ever seen! By snack time, Emma was laughing and sharing her animal crackers with her new friend. At pickup, Emma couldn\'t wait to tell her parents about her wonderful first day.'
  },
  {
    id: 2,
    title: 'Liam\'s Big Discovery',
    date: 'June 21, 2025',
    category: 'Individual Story',
    content: 'Liam has always been fascinated by dinosaurs, but today was special. During story time, Miss Anna read "The Dinosaur Who Lost Its Roar" - Liam\'s favorite book. His eyes lit up as he recognized the pictures. "That\'s a T-Rex!" he exclaimed, pointing excitedly. After the story, Liam spent the afternoon at the reading corner, carefully turning the pages and making up his own stories about the dinosaurs. He even helped his friend Mia sound out some of the words. It was a day of big discoveries and growing confidence for our little paleontologist!'
  },
  {
    id: 3,
    title: 'Our Class Garden Adventure',
    date: 'June 20, 2025',
    category: 'Class Story',
    content: 'Today, our class transformed into a team of gardeners! Each child was given their own small pot, soil, and flower seeds. We learned how to carefully plant the seeds and give them just the right amount of water. The children worked together to create a watering schedule and take turns caring for our new garden. Even though we got a little dirty, the laughter and excitement made it all worthwhile. We can\'t wait to watch our flowers grow together! This project taught us about responsibility, teamwork, and the magic of nature.'
  },
];

const SampleStories = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [storyContext, setStoryContext] = useState('');
  const [generatedStory, setGeneratedStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [discardedStories, setDiscardedStories] = useState([]);

  const handleInteraction = () => {
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 2000);
  };

  const handleGenerateStory = async (e) => {
    e.preventDefault();
    if (!storyContext.trim()) {
      toast.error('Please provide some context for the story.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          studentName: 'your child',
          age: 36,
          context: storyContext.trim(),
          interests: [],
          personality: 'curious and creative',
          isSampleStory: true,
          discardedStories: discardedStories
        })
      });

      if (!response.ok) throw new Error('Failed to generate story');

      const data = await response.json();
      setGeneratedStory({
        ...data.story,
        context: storyContext.trim(),
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error generating story:', error);
      toast.error('Failed to generate story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!generatedStory) return;
    const doc = new jsPDF();
    const title = generatedStory.title || 'Generated Story';
    doc.setFontSize(20);
    doc.text(title, 15, 20);
    doc.setFontSize(12);
    doc.text(doc.splitTextToSize(generatedStory.content || '', 180), 15, 40);
    doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
  };

  const handleShare = async () => {
    if (!generatedStory) return;
    const shareData = {
      title: generatedStory.title || 'Generated Story',
      text: generatedStory.content,
      url: window.location.href
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.title}\n\n${shareData.text}\n\nShared from ${shareData.url}`
        );
        toast.success('Story link copied to clipboard!');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        toast.error('Could not share the story. Please try again.');
      }
    }
  };

  const handleCopyToClipboard = async () => {
    if (!generatedStory) return;
    try {
      await navigator.clipboard.writeText(
        `${generatedStory.title || 'Generated Story'}\n\n${generatedStory.content}`
      );
      toast.success('Story copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy story to clipboard');
    }
  };

  const handleDiscardStory = () => {
    if (!generatedStory) return;
    
    // Add the story title to discarded stories list
    setDiscardedStories(prev => [...prev, generatedStory.title]);
    
    // Clear the current story
    setGeneratedStory(null);
    
    toast.success('Story discarded. Next generation will avoid similar stories.');
  };

  // Auto-rotate stories every 5 seconds
  useEffect(() => {
    if (isPaused || showStoryModal) return;
    const interval = setInterval(() => {
      setCurrentStoryIndex((prevIndex) => 
        prevIndex === featuredStories.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, showStoryModal]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f2] to-[#f3e9db] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-end mb-8 space-y-2">
          <button
            onClick={() => setShowStoryModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#294122] hover:bg-[#1a2e16] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#294122] transition-colors cursor-pointer"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Your Own Story
          </button>
          <p className="text-sm text-gray-600 max-w-xs text-right">
            Just give the AI some context and it will create a beautiful, engaging story for you.
          </p>
          <p className="text-xs text-gray-500 max-w-xs text-right mt-2">
            Don't worry, anything you create here won't be saved by us or shown below.
          </p>
        </div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Featured Stories from Our Classroom
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600 sm:mt-4">
            See what our students have been learning and creating
          </p>
        </div>
        
        <div className="relative w-full overflow-hidden py-12">
          <div className="relative
            before:absolute before:left-0 before:top-0 before:bottom-0 before:w-24 before:bg-gradient-to-r before:from-[#f8f6f2] before:to-transparent before:z-10 before:pointer-events-none
            after:absolute after:right-0 after:top-0 after:bottom-0 after:w-24 after:bg-gradient-to-l after:from-[#f8f6f2] after:to-transparent after:z-10 after:pointer-events-none">
            <div 
              className="flex overflow-x-auto snap-x snap-mandatory pb-8 -mx-8 px-8 scrollbar-hide"
              style={{
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {featuredStories.map((story, index) => (
                <div 
                  key={story.id}
                  className={`flex-shrink-0 w-10/12 sm:w-8/12 md:w-7/12 lg:w-5/12 px-4 transition-all duration-300 cursor-pointer ${
                    index === currentStoryIndex ? 'scale-100' : 'scale-90 opacity-80'
                  }`}
                  onClick={() => {
                    handleInteraction();
                    setCurrentStoryIndex(index);
                  }}
                  style={{
                    scrollSnapAlign: 'center',
                    scrollSnapStop: 'always'
                  }}
                >
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full flex flex-col">
                    <div className="p-8 flex-1 flex flex-col">
                      <span className="inline-block px-4 py-2 text-sm font-semibold text-[#294122] bg-[#FFEDD2] rounded-full mb-6 self-start">
                        {story.category}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {story.title}
                      </h3>
                      <div className="mt-4 mb-6">
                        <p className="text-gray-700 text-base">{story.content}</p>
                      </div>
                      <div className="mt-auto pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">{story.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {featuredStories.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  handleInteraction();
                  setCurrentStoryIndex(index);
                }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${index === currentStoryIndex ? 'bg-[#294122] w-8' : 'bg-gray-300 w-2.5'}`}
                aria-label={`Go to story ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <button 
            onClick={() => {
              handleInteraction();
              setCurrentStoryIndex(prev => (prev - 1 + featuredStories.length) % featuredStories.length);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#294122] rounded-full p-3 shadow-xl z-10 cursor-pointer"
            aria-label="Previous story"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={() => {
              handleInteraction();
              setCurrentStoryIndex(prev => (prev + 1) % featuredStories.length);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#294122] rounded-full p-3 shadow-xl z-10 cursor-pointer"
            aria-label="Next story"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Story Generation Modal */}
      {showStoryModal && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-800">Create a Story</h3>
              <button 
                onClick={() => setShowStoryModal(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                disabled={loading}
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            {!generatedStory ? (
              <form onSubmit={handleGenerateStory} className="flex-1 flex flex-col p-4 overflow-hidden">
                <div className="mb-4">
                  <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-2">
                    Story Context / Scenario
                  </label>
                  <textarea
                    id="context"
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Describe what you'd like the story to be about. For example: 'A story about a magical forest where animals can talk and go on adventures...'"
                    value={storyContext}
                    onChange={(e) => setStoryContext(e.target.value)}
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
                    onClick={() => setShowStoryModal(false)}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !storyContext.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Generating...' : 'Generate Story'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex-1 flex flex-col p-4 overflow-auto">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{generatedStory.title || 'Your Generated Story'}</h3>
                  <div className="flex space-x-2">
                    <button onClick={handleCopyToClipboard} className="p-2 text-gray-600 hover:text-gray-900 cursor-pointer" title="Copy to clipboard">
                      <FaCopy className="w-4 h-4" />
                    </button>
                    <button onClick={handleDiscardStory} className="p-2 text-orange-600 hover:text-orange-900 cursor-pointer" title="Discard story (won't be generated again)">
                      <FaTimes className="w-4 h-4" />
                    </button>
                    <button onClick={handleShare} className="p-2 text-gray-600 hover:text-gray-900 cursor-pointer" title="Share story">
                      <FaShare className="w-4 h-4" />
                    </button>
                    <button onClick={handleDownloadPDF} className="p-2 text-gray-600 hover:text-gray-900 cursor-pointer" title="Download as PDF">
                      <FaFilePdf className="w-4 h-4" />
                    </button>
                    <button onClick={() => setGeneratedStory(null)} className="p-2 text-gray-600 hover:text-gray-900 cursor-pointer" title="Close">
                      <FaTimes className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="prose max-w-none flex-1 overflow-auto">
                  <p className="whitespace-pre-line text-gray-800">{generatedStory.content}</p>
                </div>
                
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <p className="text-xs text-gray-400">Login to create even more personalized stories!</p>
                  <button
                    onClick={() => {
                      setGeneratedStory(null);
                      setStoryContext('');
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 cursor-pointer"
                  >
                    Create Another Story
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SampleStories;