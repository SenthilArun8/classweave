'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      setSuccess(response.data.message || 'Registration successful!');
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e6]">
      <div className="w-full max-w-md p-8 backdrop-blur-md bg-white/60 rounded-xl shadow-lg">
        <div className="flex flex-col items-center">
          <img alt="Your Company" src="/arts_craft.ico" className="h-10 w-auto" />
          <h2 className="mt-6 text-center text-2xl font-bold text-emerald-800">
            Create your account
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-700 text-sm">{success}</p>}
          {['name', 'email', 'password', 'confirmPassword'].map((field, idx) => (
            <div key={idx}>
              <label htmlFor={field} className="block text-sm font-medium text-emerald-900 capitalize">
                {field === 'confirmPassword' ? 'Confirm Password' : field}
              </label>
              <div className="mt-2">
                <input
                  id={field}
                  name={field}
                  type={field.includes('password') ? 'password' : 'text'}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-emerald-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          ))}
          <div>
            <button
              type="submit"
              className="w-full rounded-md bg-emerald-700 px-4 py-2 text-white font-semibold hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-800"
            >
              Register
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-emerald-800">
          Already have an account?{' '}
          <a href="/login" className="font-semibold hover:underline text-emerald-700">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
