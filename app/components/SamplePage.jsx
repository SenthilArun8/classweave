'use client';

import { useEffect, useState } from 'react';
import Student from './Student';

const SAMPLE_STUDENT_IDS = [
  '683d57f853223cfb0c1e5723',
  '683d590053223cfb0c1e5724',
];

const SamplePage = () => {
  const [sampleStudents, setSampleStudents] = useState([null, null]);
  const [sampleLoading, setSampleLoading] = useState(true);
  const [sampleError, setSampleError] = useState(null);

  useEffect(() => {
    setSampleLoading(true);
    Promise.all(
      SAMPLE_STUDENT_IDS.map(id =>
        fetch(`/api/students/sample/${id}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .catch(error => {
            console.error(`Error fetching student ${id}:`, error);
            return null; // Return null for failed requests
          })
      )
    )
      .then(dataArr => {
        setSampleStudents(dataArr.filter(Boolean)); // Filter out null values
        setSampleLoading(false);
      })
      .catch(err => {
        console.error('Error in Promise.all:', err);
        setSampleError(err.message || 'Failed to fetch student data');
        setSampleLoading(false);
      });
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center bg-white px-0 py-0">
      <div className="flex flex-col md:flex-row w-full max-w-7xl h-full items-stretch">
        {/* Left: Huge header */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 md:py-0 bg-white">
          <div className="space-y-6 text-left">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold text-emerald-800 leading-tight md:leading-[1.1] animate-fade-in" style={{ fontFamily: 'Mozer-SemiBold, sans-serif' }}>
              <span className="block">Test it.</span>
              <span className="block text-emerald-600">Trust it.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-md animate-fade-in delay-200">
              Try out student examples and see how AI can streamline your planning in seconds for free!
            </p>
          </div>
        </div>
        {/* Right: Vertical stack of sample students */}
        <div className="flex-1 flex flex-col gap-8 justify-center items-end px-6 py-12 md:py-0 bg-white">
          {/* Add padding before the first card */}
          <div className="pt-8" />
          {sampleLoading ? (
            <div className="text-emerald-700 text-center">Loading sample students...</div>
          ) : sampleError ? (
            <div className="text-red-600 text-center">{sampleError}</div>
          ) : (
            sampleStudents.map((student, idx) => (
              student && (
                <div key={SAMPLE_STUDENT_IDS[idx]} className="w-full max-w-md">
                  <Student student={student} />
                </div>
              )
            ))
          )}
          {/* Add padding after the last card */}
          <div className="pb-8" />
        </div>
      </div>
    </section>
  );
};

export default SamplePage;