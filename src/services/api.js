import axios from 'axios';

const API_BASE_URL = "http://localhost:8000"; // Adjust if your FastAPI runs on a different port

export const runAnalysis = async (file, scanType) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${API_BASE_URL}/predict/${scanType}`, formData, {
            headers: { 
                "Content-Type": "multipart/form-data" 
            }
        });
        
        return response.data;
    } catch (error) {
        console.error("Error analyzing scan:", error);
        
        // Extract the specific error message from the FastAPI backend if it exists
        if (error.response) {
            // The server responded with a status code outside the 2xx range (e.g., 400 Bad Request)
            const serverMessage = error.response.data.detail || `Server error: ${error.response.status}`;
            throw new Error(serverMessage);
        } else if (error.request) {
            // The request was made but no response was received (e.g., backend is offline)
            throw new Error("No response from server. Is the backend running?");
        } else {
            // Something else triggered an error
            throw new Error("An unexpected error occurred while analyzing the image.");
        }
    }
};