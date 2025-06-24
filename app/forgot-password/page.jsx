'use client';

import { useState } from 'react';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setMessage(res.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e6]">
      <div className="w-full max-w-md p-8 backdrop-blur-md bg-white/60 rounded-xl shadow-lg">
        <div className="flex flex-col items-center">
          <h2 className="mt-6 text-center text-2xl font-bold text-emerald-800">
            Forgot Password
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {message && <p className="text-green-600 text-sm">{message}</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-emerald-900">
              Enter your email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
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
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
