'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

function VedaAILogo() {
  return (
    <svg
      width="136"
      height="40"
      viewBox="19.7142 1.85519 134 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <rect
        x="19.7142"
        y="1.85519"
        width="40"
        height="40"
        rx="10"
        fill="url(#vedaBg)"
      />

      <g filter="url(#vedaShadow)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M42.4413 30.2153C42.4413 30.2153 43.1688 32.1573 43.8355 32.2789H35.4112C33.7141 32.2789 32.1993 31.3079 31.714 29.487L26.805 14.9207C26.805 14.9207 26.381 13.1606 25.7143 12.8571H34.3204C36.0175 12.9179 37.1691 13.5247 37.8357 15.7706L42.4413 30.2153Z"
          fill="white"
        />
        <path
          opacity="0.2"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M42.4413 30.2153C42.4413 30.2153 43.1688 32.1573 43.8355 32.2789H35.4112C33.7141 32.2789 32.1993 31.3079 31.714 29.487L26.805 14.9207C26.805 14.9207 26.381 13.1606 25.7143 12.8571H34.3204C36.0175 12.9179 37.1691 13.5247 37.8357 15.7706L42.4413 30.2153Z"
          fill="url(#vedaVShade)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M37.0471 30.2149C37.0471 30.2149 36.3196 32.1569 35.6529 32.2784H44.0772C45.7743 32.2784 47.2891 31.3074 47.7744 29.4865L52.6231 14.9207C52.6231 14.9207 53.0471 13.1606 53.7138 12.8571H45.168C43.4709 12.8571 42.3801 13.464 41.7134 15.7098L37.0471 30.2149Z"
          fill="white"
        />
      </g>

      <text
        x="68"
        y="31"
        fontFamily='"Bricolage Grotesque", Arial, sans-serif'
        fontSize="28"
        fontWeight="700"
        letterSpacing="-0.06em"
        fill="#303030"
      >
        VedaAI
      </text>

      <defs>
        <linearGradient id="vedaBg" x1="39.7142" y1="1.85519" x2="39.7142" y2="41.8552">
          <stop stopColor="#E56820" />
          <stop offset="1" stopColor="#D45E3E" />
        </linearGradient>

        <linearGradient id="vedaVShade" x1="34.7749" y1="11.2061" x2="34.7749" y2="33.9908">
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.33" stopColor="white" stopOpacity="0" />
          <stop offset="0.76" stopColor="#0E1513" />
          <stop offset="1" stopColor="#0E1513" />
        </linearGradient>

        <filter id="vedaShadow" x="0" y="0" width="79.4281" height="70.8503">
          <feDropShadow dx="0" dy="4.28571" stdDeviation="4.28571" floodOpacity="0.2" />
          <feDropShadow dx="0" dy="8.57143" stdDeviation="8.57143" floodOpacity="0.15" />
          <feDropShadow dx="0" dy="12.8571" stdDeviation="12.8571" floodOpacity="0.1" />
        </filter>
      </defs>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      setAuth(data.user, data.token);
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mt-auto">
        <div className="flex justify-center mb-8">
          <VedaAILogo />
        </div>

        <h2 className="text-center text-xl font-bold text-gray-900 mb-2">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md mb-auto">
        <div className="bg-white py-10 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[24px] sm:px-10 border border-gray-100">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3.5 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all bg-gray-50/50"
                placeholder="teacher@school.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3.5 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all bg-gray-50/50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-[#1a1a1a] hover:bg-black hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-bold text-orange-600 hover:text-orange-500 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}