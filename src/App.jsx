import React, { useState } from 'react';
import { runAnalysis } from './services/api';
import ResultCard from './components/ResultCard';

export default function App() {
    const [file, setFile] = useState(null);
    const [scanType, setScanType] = useState('comprehensive');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setResult(null); // Clear previous results on new file
        setError(null);  // Clear previous errors
    };

    const handleProtocolChange = (e) => {
        setScanType(e.target.value);
        setResult(null); // Clear previous results on protocol change
        setError(null);  // Clear previous errors
    };

    const handleRunAnalysis = async () => {
        if (!file) {
            setError("Please upload an MRI scan first.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Calls http://localhost:8000/predict/{scanType}
            const data = await runAnalysis(file, scanType);
            
            // DEBUG: Logs the exact payload from FastAPI
            console.log("API Response in App.jsx:", data); 
            
            setResult(data);
        } catch (err) {
            console.error(err);
            // Use the specific error message thrown by our updated api.js if available
            setError(err.message || "Analysis failed. Ensure the FastAPI server is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{ color: '#1e3a8a', fontSize: '2.5rem', marginBottom: '5px' }}>NeuroScan AI</h1>
            <p style={{ color: '#4b5563', fontSize: '1.2rem', marginBottom: '30px' }}>Advanced MRI Analysis for Tumor & Alzheimer's Detection</p>

            <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '30px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>Select Screening Protocol</label>
                    <select 
                        value={scanType} 
                        onChange={handleProtocolChange}
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                    >
                        <option value="comprehensive">Comprehensive (Alzheimer's + Tumor)</option>
                        <option value="tumor">Brain Tumor Only</option>
                        <option value="alzheimer">Alzheimer's Disease Only</option>
                    </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>Upload MRI Scan (JPEG/PNG)</label>
                    <input 
                        type="file" 
                        accept="image/jpeg, image/png" 
                        onChange={handleFileChange}
                        style={{ width: '100%', padding: '10px', backgroundColor: '#fff', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />
                </div>

                {error && <p style={{ color: '#dc2626', fontWeight: 'bold' }}>{error}</p>}

                <button 
                    onClick={handleRunAnalysis}
                    disabled={loading}
                    style={{ width: '100%', padding: '12px', backgroundColor: loading ? '#9ca3af' : '#3b82f6', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                    {loading ? 'Analyzing Scan...' : 'Run Analysis'}
                </button>
            </div>

            {/* Passes the raw JSON payload and the selected dropdown string directly to ResultCard */}
            <ResultCard result={result} scanType={scanType} />
        </div>
    );
}