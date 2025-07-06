'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';

const SAMPLE_STUDENT_IDS = [
  '683d57f853223cfb0c1e5723',
  '683d590053223cfb0c1e5724',
];

const Navbar = () => {
  // Hooks
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const { user, logout, token } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // Check if a link is active
  const isActive = (path) => {
    return pathname === path;
  };

  // Generate link class based on active state
  const linkClass = (path) => {
    return isActive(path)
      ? 'bg-black text-[#FFEDD2] hover:bg-[#FFBBA6] hover:text-[#294122] rounded-md px-3 py-2'
      : 'text-[#FFEDD2] hover:bg-[#FFBBA6] hover:text-[#294122] rounded-md px-3 py-2';
  };

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      setStudentsLoading(true);
      try {
        let fetchedStudents = [];
        if (user) {
          // Fetch user's students if logged in
          const response = await fetch('/api/students', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          });
          
          if (response.ok) {
            const data = await response.json();
            fetchedStudents = Array.isArray(data) ? data : [];
          }
        } else {
          // Fetch sample students if not logged in
          const sampleStudentRequests = SAMPLE_STUDENT_IDS.map(id =>
            fetch(`/api/students/sample/${id}`, { credentials: 'include' })
              .then(res => res.ok ? res.json() : null)
              .catch(error => {
                console.error(`Error fetching sample student ${id}:`, error);
                return null;
              })
          );
          fetchedStudents = (await Promise.all(sampleStudentRequests)).filter(Boolean);
        }
        setStudents(fetchedStudents);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setStudentsLoading(false);
      }
    };

    fetchStudents();
  }, [user, token]);

  // Handle logout
  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      // Clear user context
      logout();
      
      // Redirect to home page
      router.push('/');
      router.refresh(); // Refresh to update the UI
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="bg-[#294122] border-b border-emerald-500 w-full">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-between md:items-stretch md:justify-start w-full">
            <Link href="/" className="flex flex-shrink-0 items-center mr-4">
              <span className="block text-[#FFEDD2] text-xl sm:text-2xl font-bold ml-2 whitespace-nowrap">
                Daycare Activity Automation
              </span>
            </Link>
            
            {/* Hamburger for mobile */}
            <button
              className="sm:hidden ml-auto text-[#FFEDD2] focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
            
            {/* Desktop nav */}
            <div className="hidden sm:flex flex-1 justify-end">
              <ul className="flex flex-row space-x-2 items-center">
                <li>
                  <Link href="/" className={linkClass('/')}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/students" className={linkClass('/students')}>
                    {user ? 'Your Students' : 'Sample Students'}
                  </Link>
                </li>
                <li>
                  <Link href="/add-student" className={linkClass('/add-student')}>
                    Add Student
                  </Link>
                </li>
                <li>
                  <Link href="/at-home" className={linkClass('/at-home')}>
                    At Home
                  </Link>
                </li>
                <li className="relative">
                  <Popover>
                    <PopoverButton className={`${linkClass('')} font-semibold focus:outline-none flex items-center`}>
                      Activities
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </PopoverButton>
                    <PopoverPanel className="absolute left-0 mt-2 w-56 rounded-md bg-white shadow-lg z-20">
                      <div className="py-1">
                        <Link
                          href="/all-saved-activities"
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                          {user ? 'Saved Activities' : 'Sample Saved Activities'}
                        </Link>
                        <Link
                          href="/discarded-activities"
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                          {user ? 'Discarded Activities' : 'Sample Discarded Activities'}
                        </Link>
                      </div>
                    </PopoverPanel>
                  </Popover>
                </li>
                {user ? (
                  <li className="relative">
                    <Popover>
                      <PopoverButton className="text-[#FFEDD2] hover:bg-[#FFBBA6] hover:text-[#294122] rounded-md px-2 py-2 font-semibold focus:outline-none flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                      </PopoverButton>
                      <PopoverPanel anchor="bottom" className="absolute right-0 mt-2 min-w-[8rem] rounded-xl bg-[#294122] shadow-lg divide-y divide-white/5 z-20 flex flex-col items-center">
                        <div className="p-2 w-full flex justify-center">
                          <button
                            onClick={handleLogout}
                            className="block w-24 text-center px-2 py-2 rounded-lg font-semibold text-[#FFEDD2] hover:bg-[#FFBBA6] hover:text-[#294122] transition"
                          >
                            Logout
                          </button>
                        </div>
                      </PopoverPanel>
                    </Popover>
                  </li>
                ) : (
                  <li>
                    <Link href="/login" className={linkClass('/login')}>
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Mobile sidebar */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex sm:hidden">
            <div className="w-64 bg-[#294122] h-full shadow-lg p-6 flex flex-col">
              <button
                className="self-end mb-6 text-[#FFEDD2]"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <ul className="flex flex-col space-y-4">
                <li>
                  <Link 
                    href="/" 
                    className={linkClass('/')} 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/students" 
                    className={linkClass('/students')}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {user ? 'Your Students' : 'Sample Students'}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/add-student" 
                    className={linkClass('/add-student')}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Add Student
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/at-home" 
                    className={linkClass('/at-home')}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    At Home
                  </Link>
                </li>
                <li className="pt-2">
                  <div className="pl-3 text-[#FFEDD2] font-semibold">
                    {user ? 'Saved Activities' : 'Sample Activities'}
                  </div>
                  {studentsLoading ? (
                    <div className="pl-6 text-sm text-[#FFEDD2]">Loading students...</div>
                  ) : (user && students.length === 0) ? (
                    <div className="pl-6 py-2 text-sm bg-yellow-50/10 text-yellow-200 rounded">
                      Add students to view their saved activities
                    </div>
                  ) : (
                    <ul className="mt-2">
                      {students.map((student) => (
                        <li key={student._id}>
                          <Link
                            href={`/saved-activities/${student._id}`}
                            className="block pl-6 w-full text-left text-[#FFEDD2] hover:bg-[#FFBBA6] hover:text-[#294122] py-2 text-sm rounded"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {student.name} {!user && '(Sample)'}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
                {user ? (
                  <li>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="text-[#FFEDD2] hover:bg-[#FFBBA6] hover:text-[#294122] rounded-md px-3 py-2 w-full text-left"
                    >
                      Logout
                    </button>
                  </li>
                ) : (
                  <li>
                    <Link 
                      href="/login" 
                      className={linkClass('/login')}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            <div 
              className="flex-1" 
              onClick={() => setIsMobileMenuOpen(false)} 
              onKeyDown={(e) => e.key === 'Escape' && setIsMobileMenuOpen(false)}
              role="button"
              tabIndex={0}
              aria-label="Close menu"
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
