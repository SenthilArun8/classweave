import Link from 'next/link';

// Metadata for 404 page
export const metadata = {
  title: '404 - Page Not Found | ClassWeave',
  description: 'Sorry, the page you are looking for could not be found. Return to ClassWeave to continue exploring our educational platform.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f2] to-[#f3e9db] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-yellow-400 text-6xl mb-6">⚠️</div>
          <h1 className="text-4xl font-bold text-emerald-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, the page you are looking for could not be found. It might have been moved, deleted, or you entered the wrong URL.
          </p>
          <div className="space-y-4">
            <Link
              href="/"
              className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Go Home
            </Link>
            <Link
              href="/about"
              className="block w-full bg-white hover:bg-gray-50 text-emerald-600 font-semibold py-3 px-6 rounded-lg border-2 border-emerald-600 transition-colors duration-200"
            >
              Learn About ClassWeave
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
