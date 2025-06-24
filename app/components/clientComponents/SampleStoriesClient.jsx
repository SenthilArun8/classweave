"use client";

import { useState } from 'react';
import { FaTimes, FaCopy, FaFilePdf, FaShare } from 'react-icons/fa';

function StoryModal({ story, onClose }) {
  if (!story) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold text-gray-900">{story.title}</h3>
                  <button type="button" className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none" onClick={onClose}>
                    <span className="sr-only">Close</span>
                    <FaTimes className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-base text-gray-700 whitespace-pre-line">{story.fullContent}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GeneratedStory({ story, onClose }) {
  // Add copy, download, share logic as in original
  const handleCopy = () => {
    navigator.clipboard.writeText(story.fullContent || '').then(() => alert('Copied!'));
  };
  // Placeholder for PDF/Share
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xl font-bold text-gray-900">Generated Story</h4>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
      </div>
      <div className="whitespace-pre-line text-gray-800 mb-4">{story.fullContent}</div>
      <div className="flex gap-4">
        <button onClick={handleCopy} className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"><FaCopy /> Copy</button>
        <button disabled className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded opacity-50 cursor-not-allowed"><FaFilePdf /> PDF</button>
        <button disabled className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded opacity-50 cursor-not-allowed"><FaShare /> Share</button>
      </div>
    </div>
  );
}

export default function SampleStoriesClient({ featuredStories }) {
  const [selectedStory, setSelectedStory] = useState(null);
  const [storyContext, setStoryContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedStory, setGeneratedStory] = useState(null);

  const handleGenerateStory = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate AI story generation
    setTimeout(() => {
      setGeneratedStory({ fullContent: `AI Story: ${storyContext}` });
      setLoading(false);
    }, 1200);
  };

  return (
    <section className="min-h-screen py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Featured Stories</h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">Discover heartwarming stories from our community</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {featuredStories.map((story) => (
            <div key={story.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => setSelectedStory(story)}>
              <div className="p-6">
                <div className="flex items-center">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">{story.category}</span>
                  <span className="ml-2 text-sm text-gray-500">{story.date}</span>
                </div>
                <h3 className="mt-2 text-xl font-semibold text-gray-900">{story.title}</h3>
                <p className="mt-3 text-base text-gray-500">{story.excerpt}</p>
                <div className="mt-4">
                  <span className="text-base font-medium text-emerald-600 hover:text-emerald-500">Read full story →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {!generatedStory ? (
          <div className="mt-16 bg-gray-50 rounded-lg shadow-md overflow-hidden">
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-900">Create Your Own Story</h3>
              <p className="mt-2 text-gray-600">Let our AI help you create a personalized story for your students or children.</p>
              <form onSubmit={handleGenerateStory} className="mt-6">
                <div>
                  <label htmlFor="story-context" className="block text-sm font-medium text-gray-700">What's the story about?</label>
                  <div className="mt-1">
                    <textarea id="story-context" rows={4} className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3" placeholder="E.g., A story about a brave little turtle who overcomes his fear of the dark..." value={storyContext} onChange={e => setStoryContext(e.target.value)} disabled={loading} />
                  </div>
                </div>
                <div className="mt-4">
                  <button type="submit" disabled={loading || !storyContext.trim()} className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${ (loading || !storyContext.trim()) ? 'opacity-70 cursor-not-allowed' : '' }`}>
                    {loading ? 'Generating...' : 'Generate Story'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <GeneratedStory story={generatedStory} onClose={() => setGeneratedStory(null)} />
        )}
      </div>
      {selectedStory && (
        <StoryModal story={selectedStory} onClose={() => setSelectedStory(null)} />
      )}
    </section>
  );
}
