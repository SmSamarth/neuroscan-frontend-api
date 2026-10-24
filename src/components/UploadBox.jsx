import React, { useState } from 'react';
import UploadBox from './components/UploadBox';
import ResultCard from './components/ResultCard';

export default function App() {
  const [scanResult, setScanResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  // Default to comprehensive, but handleAnalysisComplete will override this
  const [scanType, setScanType] = useState('comprehensive');

  const handleAnalysisComplete = (data, url, type) => {
    // Crucial: Clear old results first to avoid UI flickering
    setScanResult(null); 
    
    // Set new state
    setScanResult(data);
    setPreviewUrl(url);
    setScanType(type); // This 'type' comes from the dropdown selection in UploadBox
  };

  const handleReset = () => {
    setScanResult(null);
    setPreviewUrl(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            NeuroScan <span className="text-blue-600">AI</span>
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Advanced MRI Analysis for Tumor & Alzheimer's Detection
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          <UploadBox onAnalysisComplete={handleAnalysisComplete} onReset={handleReset} />
        </div>

        {/* Results Section */}
        {scanResult && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ResultCard 
              result={scanResult} 
              previewUrl={previewUrl} 
              scanType={scanType} 
            />
          </div>
        )}
        
        {/* Footer / Info Section */}
        {!scanResult && (
          <div className="text-center text-gray-400 text-sm italic">
            Upload a high-resolution MRI scan (T1/T2 weighted) to begin analysis.
          </div>
        )}
      </div>
    </div>
  );
}