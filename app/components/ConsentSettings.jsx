'use client';

import { useState, useEffect } from 'react';
import { FaCog, FaTimes } from 'react-icons/fa';

const ConsentSettings = () => {
  const [consentStatus, setConsentStatus] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const status = localStorage.getItem('cookieConsent');
      setConsentStatus(status);
    }
  }, []);

  const updateConsent = (newStatus) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookieConsent', newStatus);
      setConsentStatus(newStatus);
      
      if (window.gtag) {
        if (newStatus === 'accepted') {
          window.gtag('consent', 'update', {
            'analytics_storage': 'granted',
            'ad_storage': 'granted',
            'ad_user_data': 'granted',
            'ad_personalization': 'granted'
          });
        } else {
          window.gtag('consent', 'update', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied'
          });
        }
      }
    }
    setShowSettings(false);
    // Reload page to ensure all scripts are properly loaded/unloaded
    window.location.reload();
  };

  if (!isClient || !consentStatus) return null;

  return (
    <>
      {/* Consent Status Indicator */}
      <button
        onClick={() => setShowSettings(true)}
        className="fixed bottom-4 left-4 z-40 bg-emerald-700 hover:bg-emerald-800 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
        title="Manage Cookie Preferences"
        aria-label="Manage Cookie Preferences"
      >
        <FaCog className="w-4 h-4" />
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
                  {consentStatus === 'accepted' ? 'Cookies Accepted' : 'Cookies Declined'}
                </span>
              </p>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Analytics & Advertising</h4>
                <p className="text-sm text-gray-600">
                  These cookies help us understand how visitors interact with our website 
                  and show you relevant advertisements.
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => updateConsent('accepted')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    consentStatus === 'accepted'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-emerald-50'
                  }`}
                >
                  Accept All
                </button>
                <button
                  onClick={() => updateConsent('declined')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    consentStatus === 'declined'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Decline
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
