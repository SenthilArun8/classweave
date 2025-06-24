'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [userConsent, setUserConsent] = useState(null); // 'accepted' or 'declined'
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures we're on the client before accessing localStorage
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      const consentStatus = localStorage.getItem('cookieConsent');
      if (consentStatus) {
        setUserConsent(consentStatus);
        if (consentStatus === 'accepted') {
          loadTrackingScripts();
        }
      } else {
        // Show the modal if no consent has been recorded
        setIsVisible(true);
      }
    }
  }, []);

  const loadTrackingScripts = () => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    // Load Google Analytics
    if (!document.querySelector('script[src*="googletagmanager.com"]')) {
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-SKNEMBN5EP";
      document.head.appendChild(gaScript);

      gaScript.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-SKNEMBN5EP');
      };
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

  const handleDecline = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookieConsent', 'declined');
    }
    setUserConsent('declined');
    setIsVisible(false);
    // No scripts loaded if declined
  };

  // Don't render anything during SSR or if not visible
  if (!isClient || !isVisible) return null;

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
              We use cookies to improve your experience on our site, analyze site usage, and serve personalized ads. 
              By clicking "Accept", you consent to our use of cookies. You can learn more in our{' '}
              <Link 
                href="/privacy-policy" 
                className="text-emerald-600 hover:underline"
              >
                Privacy Policy
              </Link>.
            </p>
            <p className="text-base leading-relaxed text-gray-700">
              Your choices here help us understand how our site is used and enhance your experience. 
              We value your privacy.
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
              onClick={handleDecline}
              type="button"
              className="w-full sm:w-auto py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-emerald-700 focus:z-10 focus:ring-4 focus:ring-gray-100 transition-colors duration-200"
              aria-label="Decline non-essential cookies"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
