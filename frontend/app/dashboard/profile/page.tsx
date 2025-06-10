'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const router = useRouter();

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      // Firebase user
      setUser(currentUser);
      setName(currentUser.displayName || '');
      setLoading(false);
    } else {
      // User might be logged in through DB (via session or JWT)
      fetch('/api/profile', {
        method: 'GET',
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          if (data?.name) {
            setUser(data);
            setName(data.name);
          }
        })
        .catch(() => {
          router.push('/auth/login');
        })
        .finally(() => setLoading(false));
    }
  }, [router]);

  const handleUpdate = async () => {
    setStatus('');
    try {
      if (auth.currentUser) {
        // Update Firebase displayName
        await updateProfile(auth.currentUser, { displayName: name });
        setStatus('Profile updated successfully (Firebase)');
      } else {
        // Update DB user via API
        const res = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name }),
        });

        if (!res.ok) throw new Error('Update failed');

        setStatus('Profile updated successfully (Database)');
      }
    } catch (err: any) {
      setStatus('Update failed: ' + err.message);
    }
  };

  if (loading) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>

      <label className="block mb-2 font-medium">Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleUpdate}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Save Changes
      </button>

      {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
    </div>
  );
}
