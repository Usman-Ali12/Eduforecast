'use client';

import { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const steps = [
  { label: 'Extract', description: 'Upload CSV data file' },
  { label: 'Transform', description: 'Clean and preprocess student data' },
  { label: 'Load', description: 'Save data to database' },
  { label: 'Predict', description: 'Run dropout prediction model' },
];

export default function UploadPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile && uploadedFile.type === 'text/csv') {
      setFile(uploadedFile);
      setError('');
    } else {
      setError('Please upload a valid CSV file.');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('No file selected.');
      return;
    }

    try {
      setLoading(true);
      setCurrentStep(1);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      setCurrentStep(2);
      await new Promise((r) => setTimeout(r, 1000));

      setCurrentStep(3);
      const resData = await res.json();
      setResults(resData);

      await new Promise((r) => setTimeout(r, 1000));
      setCurrentStep(4);
    } catch (err) {
      console.error(err);
      setError('Something went wrong during upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-12 text-black">
      <h1 className="text-4xl font-bold text-center">Dropout Prediction - ETL Pipeline</h1>

      {/* Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {steps.map((step, idx) => (
          <div
            key={step.label}
            className={`flex flex-col items-center text-center p-4 rounded-xl shadow-md border ${
              idx < currentStep
                ? 'bg-green-100 border-green-300'
                : idx === currentStep
                ? 'bg-yellow-50 border-yellow-300'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="mb-2">
              {idx < currentStep ? (
                <CheckCircle className="text-green-600 w-6 h-6" />
              ) : idx === currentStep ? (
                <Loader2 className="text-yellow-500 w-6 h-6 animate-spin" />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
              )}
            </div>
            <h3 className="font-semibold">{step.label}</h3>
            <p className="text-sm text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Upload Box */}
      <div className="p-8 rounded-xl border border-dashed border-gray-300 bg-white shadow-sm text-center space-y-4 max-w-2xl mx-auto">
        <div>
          <h2 className="text-2xl font-semibold">Upload your CSV</h2>
          <p className="text-sm text-gray-600">Make sure it contains required student attributes.</p>
        </div>

        <div className="w-full space-y-2">
          <Label htmlFor="csv-upload" className="text-sm font-medium">
            Choose CSV File
          </Label>
          <Input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="bg-white border-gray-300"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button
          size="lg"
          className="mt-4 w-full sm:w-auto"
          disabled={loading || !file}
          onClick={handleUpload}
        >
          {loading ? 'Processing...' : 'Start ETL + Predict'}
        </Button>
      </div>

      {/* Prediction Results */}
      {results.length > 0 && (
        <div className="w-full space-y-4">
          <h2 className="text-2xl font-semibold text-center">📊 Prediction Results</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-sm text-black">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3 border-b">Student ID</th>
                  <th className="p-3 border-b">Prediction</th>
                  <th className="p-3 border-b">Dropout Probability</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row) => (
                  <tr key={row.student_id} className="hover:bg-gray-50">
                    <td className="p-3 border-b">{row.student_id}</td>
                    <td
                      className={`p-3 border-b font-semibold ${
                        row.prediction === 'Dropout'
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}
                    >
                      {row.prediction}
                    </td>
                    <td className="p-3 border-b">{(row.probability_dropout * 100).toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
