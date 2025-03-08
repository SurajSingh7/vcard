'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser, setToken } from '@/store/authSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function LoginComp() {
  const dispatch = useDispatch();
  const router = useRouter();
  const loading = useSelector((state) => state.auth.loading);
  const { token } = useSelector((state) => state.auth);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Redirect only from /login when token exists
    if (token && router.pathname === '/login') {
      router.push('/visitor-card');
    }
  }, [token, router]);

  const [formData, setFormData] = useState({
    userName: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const response = await axios.post('/api/auth/login', formData);
      const { token, user } = response.data;

      dispatch(setToken(token));
      dispatch(setUser(user));

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Login successful');

      // Trigger login event and redirect
      localStorage.setItem('loginEvent', Date.now());
      router.push('/visitor-card');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid credentials');
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (!isClient) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-300 via-blue-500 to-purple-600">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md space-y-6"
      >
        <h1 className="text-3xl font-semibold text-center text-gray-800">Login</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-lg font-medium">Username</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-lg font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white bg-green-600 hover:bg-green-700 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-500 ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
