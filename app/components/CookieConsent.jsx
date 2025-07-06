'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [userConsent, setUserConsent] = useState(null); // 'accepted' or 'declined'
  const [nonEssentialCookies, setNonEssentialCookies] = useState({
    marketing: true,
    analytics_enhancement: true,
    social_media: true
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures we're on the client before accessing localStorage
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      const consentStatus = localStorage.getItem('cookieConsent');
      const preferences = localStorage.getItem('cookiePreferences');
      
      if (consentStatus) {
        setUserConsent(consentStatus);
        if (consentStatus === 'accepted' || consentStatus === 'customized') {
          loadTrackingScripts();
        }
      } else {
        // Auto-accept essential cookies on first visit (no modal shown)
        localStorage.setItem('cookieConsent', 'accepted');
        setUserConsent('accepted');
        loadTrackingScripts();
        // Don't show the modal - setIsVisible(true) removed
      }
      
      if (preferences) {
        setNonEssentialCookies(JSON.parse(preferences));
      }
    }
  }, []);

  const loadTrackingScripts = () => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    // Essential cookies are always granted
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted'
      });
    }

    // Load Google AdSense
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const adsScript = document.createElement('script');
      adsScript.async = true;
      adsScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7943531569653927";
      adsScript.crossOrigin = "anonymous"; // Important for AdSense
      document.head.appendChild(adsScript);
    }
  };

  const handleAccept = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookieConsent', 'accepted');
    }
    setUserConsent('accepted');
    setIsVisible(false);
    loadTrackingScripts(); // Load scripts if accepted
  };

  const updatePreferences = (preferences) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
      localStorage.setItem('cookieConsent', 'customized');
      setNonEssentialCookies(preferences);
      setUserConsent('customized');
      
      // Essential cookies always granted
      if (window.gtag) {
        window.gtag('consent', 'update', {
          'analytics_storage': 'granted',
          'ad_storage': 'granted',
          'ad_user_data': 'granted',
          'ad_personalization': 'granted'
        });
      }
    }
    setShowPreferences(false);
    setIsVisible(false);
    loadTrackingScripts();
  };

  const handlePreferenceChange = (key, value) => {
    setNonEssentialCookies(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Don't render anything during SSR or if not visible
  if (!isClient) return null;
  
  if (!isVisible) return null;

  return (
    <div
      id="cookie-consent-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-heading"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/75 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl max-h-full">
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow-xl">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
            <h3 
              id="cookie-consent-heading"
              className="text-xl font-semibold text-gray-900"
            >
              Cookie Consent
            </h3>
            {/* No close button on cookie consent as users must make a choice */}
          </div>
          
          {/* Modal body */}
          <div className="p-4 md:p-5 space-y-4">
            <p className="text-base leading-relaxed text-gray-700">
              We use essential cookies for basic website functionality, analytics, and advertising. 
              You can accept all cookies or customize your preferences for optional features.
            </p>
            <p className="text-base leading-relaxed text-gray-700">
              By clicking "Accept All", you consent to our use of all cookies. You can learn more in our{' '}
              <Link 
                href="/privacy-policy" 
                className="text-emerald-600 hover:underline"
              >
                Privacy Policy
              </Link>.
            </p>
          </div>
          
          {/* Modal footer */}
          <div className="flex flex-col sm:flex-row items-center p-4 md:p-5 border-t border-gray-200 rounded-b gap-3">
            <button
              onClick={handleAccept}
              type="button"
              className="w-full sm:w-auto text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-200"
              aria-label="Accept all cookies"
            >
              Accept All Cookies
            </button>
            <button
              onClick={() => setShowPreferences(true)}
              type="button"
              className="w-full sm:w-auto py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-emerald-700 focus:z-10 focus:ring-4 focus:ring-gray-100 transition-colors duration-200"
              aria-label="Customize cookie preferences"
            >
              Customize Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Preferences Modal (embedded within CookieConsent)
  if (showPreferences) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/75">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Cookie Preferences
            </h3>
            <button
              onClick={() => setShowPreferences(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Back to cookie consent"
            >
              ✕
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
                className="flex-1 px-4 py-2 rounded-md text-sm font-medium bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
              >
                Save Preferences
              </button>
              <button
                onClick={() => setShowPreferences(false)}
                className="flex-1 px-4 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="cookie-consent-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-heading"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/75 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl max-h-full">
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow-xl">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
            <h3 
              id="cookie-consent-heading"
              className="text-xl font-semibold text-gray-900"
            >
              Cookie Consent
            </h3>
            {/* No close button on cookie consent as users must make a choice */}
          </div>
          
          {/* Modal body */}
          <div className="p-4 md:p-5 space-y-4">
            <p className="text-base leading-relaxed text-gray-700">
              We use essential cookies for basic website functionality, analytics, and advertising. 
              You can accept all cookies or customize your preferences for optional features.
            </p>
            <p className="text-base leading-relaxed text-gray-700">
              By clicking "Accept All", you consent to our use of all cookies. You can learn more in our{' '}
              <Link 
                href="/privacy-policy" 
                className="text-emerald-600 hover:underline"
              >
                Privacy Policy
              </Link>.
            </p>
          </div>
          
          {/* Modal footer */}
          <div className="flex flex-col sm:flex-row items-center p-4 md:p-5 border-t border-gray-200 rounded-b gap-3">
            <button
              onClick={handleAccept}
              type="button"
              className="w-full sm:w-auto text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-200"
              aria-label="Accept all cookies"
            >
              Accept All Cookies
            </button>
            <button
              onClick={() => setShowPreferences(true)}
              type="button"
              className="w-full sm:w-auto py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-emerald-700 focus:z-10 focus:ring-4 focus:ring-gray-100 transition-colors duration-200"
              aria-label="Customize cookie preferences"
            >
              Customize Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
