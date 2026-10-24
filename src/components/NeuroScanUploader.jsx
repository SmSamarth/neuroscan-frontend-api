import React, { useState } from 'react';

export default function NeuroScanUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file selection and create a local preview
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null); // Clear previous results
    }
  };

  // Send the file to FastAPI
  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert("Please select an MRI scan first.");
      return;
    }

    setLoading(true);
    
    // Package the file exactly how FastAPI's UploadFile expects it
    const formData = new FormData();
    formData.append("file", selectedFile); 

    try {
      // Adjust the URL if testing the Alzheimer's endpoint
      const response = await fetch("http://127.0.0.1:8000/predict/tumor", {
        method: "POST",
        body: formData,
        // Note: Do NOT manually set 'Content-Type' headers when using FormData. 
        // The browser sets the correct multipart boundary automatically.
      });

      const data = await response.json();

      if (data.status === "success") {
        setResult(data);
      } else {
        console.error("API Error:", data);
        alert("Failed to analyze the scan.");
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Make sure your Uvicorn backend is running!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>NeuroScan Analyzer</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button 
          onClick={handleAnalyze} 
          disabled={!selectedFile || loading}
          style={{ marginLeft: '10px', padding: '5px 15px' }}
        >
          {loading ? "Analyzing..." : "Run AI Analysis"}
        </button>
      </div>

      {/* Show the original selected image before processing */}
      {preview && !result && (
        <div>
          <h4>Selected Image:</h4>
          <img src={preview} alt="MRI Preview" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}

      {/* Show the AI Results once the API responds */}
      {result && (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Diagnosis: {result.diagnosis}</h3>
          <p><strong>Confidence:</strong> {result.confidence}%</p>
          
          {/* Render the Base64 image directly into the src attribute */}
          {result.images?.gradcam && (
            <div>
              <h4>AI Heatmap (Grad-CAM):</h4>
              <img 
                src={result.images.gradcam} 
                alt="AI Analysis Heatmap" 
                style={{ maxWidth: '100%', height: 'auto', border: '2px solid red' }} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}