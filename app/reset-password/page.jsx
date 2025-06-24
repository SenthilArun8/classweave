'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

function ResetPasswordContent() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/auth/reset-password/${token}`, { password });
      setMessage(res.data.message);
      setPassword('');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e6]">
      <div className="w-full max-w-md p-8 backdrop-blur-md bg-white/60 rounded-xl shadow-lg">
        <h2 className="mt-6 text-center text-2xl font-bold text-emerald-800">
          Reset Your Password
        </h2>
        {message && <p className="text-green-600 text-sm">{message}</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-emerald-900">
              New Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
                className="w-full rounded-md border border-emerald-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full rounded-md bg-emerald-700 px-4 py-2 text-white font-semibold hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-800"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e6]">
        <div className="text-emerald-700 text-center">Loading...</div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
