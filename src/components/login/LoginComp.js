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
  const [rememberMe, setRememberMe] = useState(true);

  const [formData, setFormData] = useState({
    userName: '',
    password: '',
  });

  useEffect(() => {
    setIsClient(true);

    // Redirect only from /login when token exists
    if (token && router.pathname === '/login') {
      router.push('/visitor-card');
    }
  }, [token, router]);

  // On client mount, pre-fill form if Remember Me was checked previously
  useEffect(() => {
    if (isClient) {
      const savedRemember = localStorage.getItem('rememberMe');
      if (savedRemember === 'true') {
        const savedUserName = localStorage.getItem('rememberedUserName') || '';
        const savedPassword = localStorage.getItem('rememberedPassword') || '';
        setFormData({ userName: savedUserName, password: savedPassword });
        setRememberMe(true);
      }
    }
  }, [isClient]);

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

      // If Remember Me is checked, save credentials; otherwise, clear them
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('rememberedUserName', formData.userName);
        localStorage.setItem('rememberedPassword', formData.password);
      } else {
        localStorage.setItem('rememberMe', 'false');
        localStorage.removeItem('rememberedUserName');
        localStorage.removeItem('rememberedPassword');
      }

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-100">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h1 className="text-3xl font-semibold text-center text-orange-800">Login</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-orange-700 text-lg font-medium">Username</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full p-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>
          <div>
            <label className="block text-orange-700 text-lg font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-orange-700">Remember Me</label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white bg-orange-500 hover:bg-orange-600 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-orange-300 ${loading ? "opacity-50" : ""}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}








