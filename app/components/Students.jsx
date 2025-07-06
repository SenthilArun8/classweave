'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Student from './Student';
import Spinner from './Spinner';
import BlurredBackground from './BlurredBackground';
import StudentsAddButton from './clientComponents/StudentsAddButton';
import { useUser } from '@/contexts/UserContext';

const SAMPLE_STUDENT_IDS = [
  '683d57f853223cfb0c1e5723',
  '683d590053223cfb0c1e5724',
];

const Students = ({ isHome = false }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        let fetchedStudents = [];
        
        if (user) {
          // Fetch user's actual students if logged in
          const response = await fetch(
            isHome ? '/api/students?limit=3' : '/api/students',
            {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              credentials: 'include',
            }
          );

          if (!response.ok) {
            throw new Error('Failed to fetch students');
          }

          const data = await response.json();
          fetchedStudents = Array.isArray(data) ? data : data.students || [];
        } else {
          // Fetch sample students if not logged in
          const sampleStudentRequests = SAMPLE_STUDENT_IDS.map(id =>
            fetch(`/api/students/sample/${id}`, { 
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              }
            })
              .then(res => res.ok ? res.json() : null)
              .catch(error => {
                console.error(`Error fetching sample student ${id}:`, error);
                return null;
              })
          );
          
          const sampleStudents = await Promise.all(sampleStudentRequests);
          fetchedStudents = sampleStudents.filter(Boolean);
          
          // If it's for home page, limit to 3 (though we only have 2 sample students)
          if (isHome) {
            fetchedStudents = fetchedStudents.slice(0, 3);
          }
        }
        
        setStudents(fetchedStudents);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching students:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [isHome, user, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-10">
        {user ? (
          <>
            <p>No students found.</p>
            <StudentsAddButton />
          </>
        ) : (
          <p>Unable to load sample students. Please try again later.</p>
        )}
      </div>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {isHome 
              ? 'Featured Students' 
              : user 
                ? 'Your Students' 
                : 'Sample Students'}
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            {isHome 
              ? 'See how Classweave personalizes learning experiences' 
              : user
                ? 'Manage your students and their learning journeys'
                : 'Explore these sample student profiles to see how our platform works'}
          </p>
          {!user && !isHome && (
            <p className="mt-2 text-sm text-emerald-600 font-medium">
              Create an account to add your own students and unlock personalized features!
            </p>
          )}
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <Student key={student._id} student={student} />
          ))}
        </div>

        {isHome && students.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              href="/students"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
            >
              View All Students
              <svg
                className="ml-2 -mr-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        )}

        {!user && !isHome && students.length > 0 && (
          <div className="mt-10 text-center space-y-4">
            <p className="text-gray-600">Ready to create personalized experiences for your own students?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Sign Up Free
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-3 border border-emerald-600 text-base font-medium rounded-md text-emerald-600 bg-white hover:bg-emerald-50"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Students;
