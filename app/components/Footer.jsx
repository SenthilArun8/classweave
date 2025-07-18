import Link from 'next/link';

/**
 * Footer component with SEO metadata for Next.js
 * @component
 * @description Main footer component containing business information, navigation links, and structured data for SEO
 */
const Footer = () => {
  const business = {
    name: 'ClassWeave',
    email: 'classweaveai@gmail.com',
    description: 'ClassWeave is an innovative educational platform that provides seamless and interactive learning experiences for educators, students, and parents.',
    keywords: ['education', 'learning platform', 'student management', 'educational technology', 'classroom tools', 'activity generation'],
    url: 'https://classweave.vercel.app/',
  };

  // Structured data for SEO (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": business.name,
    "description": business.description,
    "email": business.email,
    "url": business.url,
    "sameAs": [],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": business.email,
      "contactType": "customer service"
    }
  };

      
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      <footer 
        className="bg-[#162114] text-[#FFEDD2] py-10 px-4 sm:px-6 lg:px-8"
        role="contentinfo"
        aria-label="Site footer"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Business Details */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4 text-[#FFEDD2]">Contact Us</h3>
            <p className="mb-2">{business.name}</p>
            <p className="mb-2">
              Email:{' '}
              <a 
                href={`mailto:${business.email}`} 
                className="hover:text-[#FFBBA6] transition-colors duration-200"
                aria-label={`Send email to ${business.email}`}
              >
                {business.email}
              </a>
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4 text-[#FFEDD2]">Quick Links</h3>
            <nav aria-label="Footer navigation">
              <ul>
                <li className="mb-2">
                  <Link 
                    href="/" 
                    className="hover:text-[#FFBBA6] transition-colors duration-200 block"
                    aria-label="Go to homepage"
                  >
                    Home
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    href="/about" 
                    className="hover:text-[#FFBBA6] transition-colors duration-200 block"
                    aria-label="Learn about ClassWeave"
                  >
                    About Us
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    href="/under-construction" 
                    className="hover:text-[#FFBBA6] transition-colors duration-200 block"
                    aria-label="Contact ClassWeave"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* About Us */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-bold mb-4 text-[#FFEDD2]">About ClassWeave</h3>
            <p className="text-sm">
              {business.description}
            </p>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-[#294122] text-center text-sm text-[#FFEDD2] opacity-75">
          © {new Date().getFullYear()} {business.name}. All rights reserved. Developed by Senthil Kirthieswar
        </div>
      </footer>
    </>
  );
};

export default Footer;

