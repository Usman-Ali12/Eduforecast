'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase'; // Adjust if needed
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google sign-up failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#000000] font-lato">
            Auto<span className="text-[#2B7FFF]">Forecast</span>
          </h1>
          <h2 className="mt-6 text-xl font-bold text-[#000000] font-lato">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-[#9B9B9B] font-lato">
            Forecast dropout risk—drive student retention with AI
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#42C59A]"
            required
          />
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#42C59A]"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white rounded-lg py-3 font-semibold hover:opacity-90 transition"
          >
            Sign Up
          </button>
        </form>

        <button
          onClick={handleGoogleSignUp}
          className="w-full border border-gray-300 rounded-lg py-3 font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition"
        >
          <img src="/G_logo.webp" alt="Google" className="w-5 h-5" />
          Sign up with Google
        </button>

        <p className="text-center text-sm text-[#9B9B9B]">
          Already have an account?{' '}
          <span
            className="text-[#2B7FFF] font-medium cursor-pointer hover:underline"
            onClick={() => router.push('/auth/login')}
          >
            Log in
          </span>
        </p>

        <p className="text-center text-xs text-[#2a2a2e]">
          Need help?{' '}
          <a href="mailto:support@EduForecast.com" className="text-[#2B7FFF] font-medium">
            support@EduForecast.com
          </a>
        </p>
        <p className="text-center text-xs text-[#2B7FFF]">© EduForecast 2025</p>
      </div>
    </div>
  );
}
