'use client';

import { useState, useEffect } from 'react';
import { FaCog, FaTimes } from 'react-icons/fa';

const ConsentSettings = () => {
  const [consentStatus, setConsentStatus] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [nonEssentialCookies, setNonEssentialCookies] = useState({
    marketing: true,
    analytics_enhancement: true,
    social_media: true
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const status = localStorage.getItem('cookieConsent');
      const preferences = localStorage.getItem('cookiePreferences');
      console.log('ConsentSettings loaded:', { status, preferences }); // Debug log
      setConsentStatus(status);
      if (preferences) {
        setNonEssentialCookies(JSON.parse(preferences));
      }
    }
  }, []);

  // Debug effect to track showPreferences changes
  useEffect(() => {
    console.log('showPreferences state changed to:', showPreferences);
  }, [showPreferences]);

  // Debug effect to track showSettings changes
  useEffect(() => {
    console.log('showSettings state changed to:', showSettings);
  }, [showSettings]);

  const updateConsent = (newStatus) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookieConsent', newStatus);
      setConsentStatus(newStatus);
      
      // Essential cookies are always granted
      if (window.gtag) {
        window.gtag('consent', 'update', {
          'analytics_storage': 'granted',
          'ad_storage': 'granted',
          'ad_user_data': 'granted',
          'ad_personalization': 'granted'
        });
      }
    }
    setShowSettings(false);
  };

  const updatePreferences = (preferences) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
      localStorage.setItem('cookieConsent', 'customized');
      setNonEssentialCookies(preferences);
      setConsentStatus('customized');
      
      // Essential cookies always granted, non-essential based on preferences
      if (window.gtag) {
        window.gtag('consent', 'update', {
          'analytics_storage': 'granted', // Essential
          'ad_storage': 'granted', // Essential
          'ad_user_data': 'granted', // Essential
          'ad_personalization': 'granted' // Essential
        });
      }
    }
    setShowPreferences(false);
    setShowSettings(false);
  };

  const handlePreferenceChange = (key, value) => {
    setNonEssentialCookies(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!isClient) return null;
  
  // For testing: always show the settings button
  // In production, this should check for consentStatus
  console.log('ConsentSettings: Current consent status:', consentStatus);

  console.log('ConsentSettings render state:', { 
    consentStatus, 
    showSettings, 
    showPreferences, 
    isClient 
  }); // Debug log

  return (
    <>
      {/* Consent Status Indicator */}
      <button
        onClick={() => {
          console.log('Settings gear button clicked!');
          setShowSettings(true);
        }}
        style={{ cursor: 'pointer', zIndex: 9999 }}
        className="fixed bottom-4 left-4 bg-emerald-700 hover:bg-emerald-800 text-white p-4 rounded-full shadow-xl border-2 border-white transition-all duration-200 transform hover:scale-110"
        title="Manage Cookie Preferences"
        aria-label="Manage Cookie Preferences"
      >
        <FaCog className="w-5 h-5" />
      </button>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/75">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Cookie Preferences
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close settings"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <p className="text-sm text-gray-600">
                Current status: <span className="font-semibold">
                  {consentStatus === 'accepted' ? 'All Cookies Accepted' : 
                   consentStatus === 'customized' ? 'Custom Preferences Set' : 'Cookies Acknowledged'}
                </span>
              </p>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Essential Analytics & Advertising</h4>
                <p className="text-sm text-gray-600">
                  These cookies are essential for our website to function properly and provide 
                  you with personalized content. They help us understand how visitors interact 
                  with our website and improve our services.
                </p>
                <p className="text-xs text-emerald-600 font-medium">
                  ✓ Always Active - Required for website functionality
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    console.log('Accept All Cookies clicked!');
                    updateConsent('accepted');
                  }}
                  type="button"
                  style={{ cursor: 'pointer' }}
                  className="flex-1 px-4 py-2 rounded-md text-sm font-medium bg-emerald-700 text-white hover:bg-emerald-800 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  Accept All Cookies
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Customize Preferences clicked - before state change'); // Debug log
                    console.log('Current showPreferences state:', showPreferences);
                    setShowPreferences(true);
                    console.log('Customize Preferences clicked - after state change'); // Debug log
                  }}
                  type="button"
                  style={{ cursor: 'pointer' }}
                  className="flex-1 px-4 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-emerald-700 transition-all duration-200 transform hover:scale-105"
                >
                  Customize Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showPreferences && showSettings && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/90">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Detailed Cookie Preferences
              </h3>
              <button
                onClick={() => {
                  console.log('Closing preferences modal');
                  setShowPreferences(false);
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                aria-label="Close preferences"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Essential Cookies */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Essential Cookies</h4>
                    <p className="text-sm text-gray-600">
                      Required for basic website functionality, analytics, and advertising.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled={true}
                      className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded opacity-50 cursor-not-allowed"
                    />
                    <span className="ml-2 text-xs text-emerald-600 font-medium">Always Active</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  Includes: Google Analytics, AdSense, core functionality cookies
                </div>
              </div>

              {/* Non-Essential Cookies */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Optional Cookies</h4>
                
                {/* Marketing Cookies */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800">Marketing & Targeting</h5>
                    <p className="text-sm text-gray-600">
                      Enhanced advertising and marketing campaign tracking.
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={nonEssentialCookies.marketing}
                      onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                      className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {nonEssentialCookies.marketing ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>

                {/* Analytics Enhancement */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800">Enhanced Analytics</h5>
                    <p className="text-sm text-gray-600">
                      Additional analytics for user behavior and performance insights.
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={nonEssentialCookies.analytics_enhancement}
                      onChange={(e) => handlePreferenceChange('analytics_enhancement', e.target.checked)}
                      className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {nonEssentialCookies.analytics_enhancement ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>

                {/* Social Media */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800">Social Media Integration</h5>
                    <p className="text-sm text-gray-600">
                      Social sharing features and embedded social media content.
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={nonEssentialCookies.social_media}
                      onChange={(e) => handlePreferenceChange('social_media', e.target.checked)}
                      className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {nonEssentialCookies.social_media ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => updatePreferences(nonEssentialCookies)}
                  className="flex-1 px-4 py-2 rounded-md text-sm font-medium bg-emerald-700 text-white hover:bg-emerald-800 hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105"
                >
                  Save Preferences
                </button>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="flex-1 px-4 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-all duration-200 cursor-pointer transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConsentSettings;
