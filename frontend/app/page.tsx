'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Home() {
  const router = useRouter();

  // 🔒 Redirect authenticated users to /dashboard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      }
    });
    return () => unsubscribe(); // Cleanup
  }, [router]);

  return (
    <main className="min-h-screen bg-black text-gray-100 flex flex-col items-center px-4 md:px-8">
      {/* Navbar */}
      <header className="w-full max-w-7xl py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-sky-400">EduForecast</h1>
        <nav className="space-x-6 text-sm font-medium hidden md:block">
          <a href="#features" className="hover:text-sky-400 transition">Features</a>
          <a href="#how" className="hover:text-sky-400 transition">How it Works</a>
          <a href="#contact" className="hover:text-sky-400 transition">Contact</a>
        </nav>
        <a href="/auth" className="hidden md:inline-block px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition">
          Get Started
        </a>
      </header>

      {/* Hero Section */}
      <section className="text-center mt-20 max-w-2xl">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight text-white">
          Predict. Prevent. Empower.
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          EduForecast helps institutions forecast student dropouts using AI-powered insights. Make data-driven decisions to improve student success.
        </p>
        <a
          href="/predict"
          className="inline-block px-6 py-3 bg-sky-600 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-sky-700 transition"
        >
          Try Prediction Now
        </a>
      </section>

      {/* Features Preview */}
      <section id="features" className="mt-32 max-w-5xl w-full grid md:grid-cols-3 gap-8 text-center">
        <div className="bg-gray-900 shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2 text-sky-400">Dropout Prediction</h3>
          <p className="text-sm text-gray-400">Get instant dropout risk scores using your uploaded student data.</p>
        </div>
        <div className="bg-gray-900 shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2 text-sky-400">Data-Driven Insights</h3>
          <p className="text-sm text-gray-400">Understand key factors affecting student retention and success.</p>
        </div>
        <div className="bg-gray-900 shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2 text-sky-400">Visual Analytics</h3>
          <p className="text-sm text-gray-400">View trends and risk levels in interactive charts and dashboards.</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-32 text-center bg-gray-800 p-10 rounded-2xl w-full max-w-4xl shadow-sm">
        <h3 className="text-3xl font-bold mb-4 text-white">Ready to forecast student outcomes?</h3>
        <p className="text-gray-400 mb-6">Join EduForecast and start predicting student dropouts in minutes.</p>
        <a
          href="/auth"
          className="px-6 py-3 bg-sky-600 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-sky-700 transition"
        >
          Get Started
        </a>
      </section>

      {/* Footer */}
      <footer className="mt-32 py-10 text-sm text-gray-500">
        © {new Date().getFullYear()} EduForecast. All rights reserved.
      </footer>
    </main>
  );
}
