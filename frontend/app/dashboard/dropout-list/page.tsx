'use client';

import { useEffect, useState } from 'react';
 import { Progress } from "@/app/components/ui/progress"; // Make sure the path is correct

export default function DropoutList() {
  const [dropouts, setDropouts] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); 
  const [progress, setProgress] = useState(13); // Simulated loading progress

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchDropouts = async () => {
      try {
        setLoading(true);

        // Simulate progress bar increment
        interval = setInterval(() => {
          setProgress((prev) => (prev < 95 ? prev + 5 : prev));
        }, 150);

        const res = await fetch('/api/dropouts');
        if (!res.ok) throw new Error('Fetch failed');
        const data = await res.json();
        setDropouts(data);
      } catch (err) {
        console.error('Client fetch error:', err);
        setError('Failed to fetch dropout data');
      } finally {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => setLoading(false), 300); // Smooth transition
      }
    };

    fetchDropouts();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-shadow-white text-center">
        Dropout Predictions
      </h1>

      {error && (
        <p className="mb-6 text-center text-red-700 font-semibold border border-red-300 rounded-md p-4 bg-red-50 max-w-lg mx-auto">
          {error}
        </p>
      )}

      {loading ? (
        <div className="w-full max-w-md mx-auto">
          <Progress value={progress} className="h-2 animate-pulse" />
          <p className="mt-4 text-center text-gray-500">Loading dropouts...</p>
        </div>
      ) : dropouts.length === 0 ? (
        <p className="text-center text-gray-600">No dropout predictions found.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {dropouts.map((d) => (
              <li
                key={d.id}
                className={`flex flex-col justify-between p-5 rounded-lg border ${
                  d.predictedDropout
                    ? 'border-red-400 bg-red-50 shadow-md'
                    : 'border-gray-300 bg-white shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`w-4 h-4 rounded-full ${
                      d.predictedDropout ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    aria-label={d.predictedDropout ? 'At Risk' : 'Safe'}
                  />
                  <h3 className="text-lg font-semibold text-gray-900">{d.studentName}</h3>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-700 font-medium">
                  <span className={d.predictedDropout ? 'text-red-600' : 'text-green-600'}>
                    {d.predictedDropout ? 'At Risk' : 'Safe'}
                  </span>
                  <time dateTime={d.predictionDate}>
                    {new Date(d.predictionDate).toLocaleString()}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
