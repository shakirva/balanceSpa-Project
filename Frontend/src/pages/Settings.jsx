import React, { useState } from 'react';

const Settings = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
    if (file) {
      setVideoPreview(URL.createObjectURL(file));
    } else {
      setVideoPreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!videoFile) {
      alert('Please select a video file.');
      return;
    }
    // Here you would handle the upload logic (e.g., send to server or save locally)
    alert('Video uploaded successfully!');
  };

  return (
    <div className="min-h-screen">
        <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="p-4 bg-white rounded-lg w-full max-w-md">
        
        <form onSubmit={handleSubmit}>
          <label className="block font-semibold mb-2">Upload Initial Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="mb-4 w-full text-white"
          />
          {videoPreview && (
            <video
              src={videoPreview}
              controls
              className="mb-4 w-full rounded"
              style={{ maxHeight: 240 }}
            />
          )}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md font-medium transition"
          >
            Save
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default Settings;