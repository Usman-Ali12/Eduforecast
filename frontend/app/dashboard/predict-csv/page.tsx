"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import {
  AlertCircle,
  CheckCircle,
  FileCheck,
  FileUp,
  Info,
  Loader2,
  Download,
} from "lucide-react";

export default function UploadCSVPage() {
  const [file, setFile] = useState<File | null>(null);
  const [predictions, setPredictions] = useState<
    { student_id: number; prediction: string; probability_dropout: number }[]
  >([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      setFile(acceptedFiles[0]);
      setPredictions([]);
      setError("");
      setSuccessMsg("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
  });

  const predictAndSave = async () => {
    if (!file) {
      setError("Please select a CSV file first.");
      return;
    }

    setLoading(true);
    setProgress(20);
    setError("");
    setSuccessMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const predictRes = await fetch("http://localhost:5000/predict-csv", {
        method: "POST",
        body: formData,
      });

      if (!predictRes.ok) throw new Error("Prediction failed from backend.");
      const predictedData = await predictRes.json();
      setPredictions(predictedData);
      setProgress(60);

      const saveRes = await fetch("/api/dashboard/save-predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ predictions: predictedData }),
      });

      if (!saveRes.ok) throw new Error("Saving to database failed.");
      const { count } = await saveRes.json();
      setSuccessMsg(`Successfully saved ${count} prediction${count > 1 ? "s" : ""}.`);
      setProgress(100);
    } catch (err) {
      console.error(err);
      setError((err as Error).message || "Unexpected error occurred.");
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const handleDownload = () => {
    if (!predictions.length) return;

    const csv =
      "Student ID,Prediction,Probability\n" +
      predictions
        .map(
          (p) =>
            `${p.student_id},${p.prediction},${Math.round(
              p.probability_dropout * 100
            )}%`
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "predictions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-10 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 justify-center mb-6">
        <FileUp className="w-7 h-7 text-blue-600" />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
          Dropout Risk Predictor
        </h1>
      </div>
      <p className="text-center text-gray-600 mb-8">
        Upload student records in CSV format to analyze dropout risks using ML.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-blue-600">
            <Info className="w-5 h-5" />
            CSV Format Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Ensure your file includes a <code className="bg-gray-100 px-1 py-0.5 rounded">student_id</code> column and other trained features (e.g., attendance, GPA, department, etc.).
          </p>
        </CardContent>
      </Card>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors mb-6 ${
          isDragActive ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-white"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          {file ? (
            <span className="flex items-center justify-center gap-2 text-blue-600 font-medium">
              <FileCheck className="w-5 h-5" />
              {file.name}
            </span>
          ) : isDragActive ? (
            "Drop the CSV file here..."
          ) : (
            "Drag & drop your CSV file here, or click to browse."
          )}
        </p>
      </div>

      {progress > 0 && (
        <div className="mb-6">
          <Progress value={progress} />
        </div>
      )}

      <div className="flex gap-4 justify-center mb-8 flex-wrap">
        <Button onClick={predictAndSave} disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </span>
          ) : (
            "Predict & Save"
          )}
        </Button>
        <Button variant="outline" onClick={handleDownload} disabled={!predictions.length}>
          <Download className="w-4 h-4 mr-1" />
          Download CSV
        </Button>
      </div>

      {error && (
        <div className="flex items-center justify-center gap-2 text-red-600 mb-6 font-medium">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {successMsg && (
        <div className="flex items-center justify-center gap-2 text-green-700 mb-6 font-medium">
          <CheckCircle className="w-5 h-5" />
          {successMsg}
        </div>
      )}

      {predictions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prediction Results</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full border text-sm text-left text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Student ID</th>
                  <th className="px-4 py-2 border">Prediction</th>
                  <th className="px-4 py-2 border">Probability</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((p) => (
                  <tr
                    key={p.student_id}
                    className={
                      p.prediction === "Dropout Risk"
                        ? "bg-red-50 text-red-700 font-medium"
                        : "text-gray-800"
                    }
                  >
                    <td className="px-4 py-2 border">{p.student_id}</td>
                    <td className="px-4 py-2 border">{p.prediction}</td>
                    <td className="px-4 py-2 border">
                      {Math.round(p.probability_dropout * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
