import React, { useState, useRef } from "react";
import { useEventStore } from "../stores/eventStore";
import axios from "axios";

const UserAdd: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addUser, updateUserAvatar } = useEventStore();

  const handleAddUser = () => {
    if (userName.trim()) {
      const newUserId = addUser(userName.trim());
      setUserId(newUserId);
      setUserName("");
      // Open camera after adding user
      handleOpenCamera();
    }
  };

  const handleOpenCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera. Please check permissions.");
      setShowCamera(false);
    }
  };

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame on the canvas
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL with compression
      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.7); // Using JPEG with 70% quality for smaller size
      setCapturedImage(imageDataUrl);
      
      // Stop the camera stream
      const stream = video.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      video.srcObject = null;
    }
  };

  const compressImage = (dataUrl: string, maxWidth = 600): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions
        if (width > maxWidth) {
          const ratio = maxWidth / width;
          width = maxWidth;
          height = height * ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to compressed JPEG
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.src = dataUrl;
    });
  };

  const handleGenerateAiAvatar = async () => {
    if (!capturedImage || !userId) return;
    
    setIsGeneratingAvatar(true);
    setErrorMessage(null);
    setGeneratedAvatar(null);
    
    try {
      // Compress the image before sending
      const compressedImage = await compressImage(capturedImage);
      
      // Send the compressed image to the server for AI processing
      const response = await axios.post("http://localhost:6082/api/generate-avatar", {
        photoData: compressedImage
      });
      
      // Display the generated avatar
      if (response.data.avatarUrl) {
        setGeneratedAvatar(response.data.avatarUrl);
      }
    } catch (error: any) {
      console.error("Error generating AI avatar:", error);
      if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      } else if (error.response?.status === 429) {
        setErrorMessage("API rate limit exceeded. Please try again later.");
      } else {
        setErrorMessage("Failed to generate AI avatar. Please try again.");
      }
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  const handleSaveAvatar = () => {
    if (generatedAvatar && userId) {
      // Update the user's avatar with the generated AI image
      updateUserAvatar(userId, generatedAvatar);
      
      // Reset the component state
      setCapturedImage(null);
      setGeneratedAvatar(null);
      setShowCamera(false);
      setUserId(null);
    }
  };

  const handleCancel = () => {
    // Stop the camera stream if it's active
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    // Reset the component state
    setCapturedImage(null);
    setGeneratedAvatar(null);
    setShowCamera(false);
    setUserId(null);
  };

  return (
    <div className="mb-6">
      {!showCamera && !capturedImage && !generatedAvatar ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter user name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add
          </button>
        </div>
      ) : generatedAvatar ? (
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-full max-w-md">
            <img 
              src={generatedAvatar} 
              alt="AI Generated Avatar" 
              className="w-full rounded-lg shadow-md"
            />
          </div>
          <div className="text-center text-sm font-medium mb-2 text-green-600">
            Votre avatar IA a été généré avec succès!
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveAvatar}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
            >
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Enregistrer cet avatar
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center"
            >
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Annuler
            </button>
          </div>
        </div>
      ) : capturedImage ? (
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-full max-w-md">
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full rounded-lg shadow-md"
            />
          </div>
          {errorMessage && (
            <div className="text-red-500 text-sm font-medium mb-2">
              {errorMessage}
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleGenerateAiAvatar}
              disabled={isGeneratingAvatar}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center disabled:opacity-50"
            >
              {isGeneratingAvatar ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Generate My AI Profile
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center"
            >
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-full max-w-md">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg shadow-md"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCapturePhoto}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
            >
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Take Photo
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center"
            >
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAdd;