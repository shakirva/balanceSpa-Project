import React, { useState, useEffect } from 'react';
import axios from '../api/axios'; // ✅ shared axios instance

const Settings = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  useEffect(() => {
    axios
      .get('/api/settings/get-video', { responseType: 'blob' }) // ✅ no hardcoded base URL
      .then((res) => {
        const videoUrl = URL.createObjectURL(res.data);
        setVideoPreview(videoUrl);
      })
      .catch(() => {
        setVideoPreview(null);
      });
  }, []);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
    if (file) {
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) return alert('Please select a video file.');

    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      await axios.post('/api/settings/upload-video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, // ✅ required for file uploads
      });
      alert('Video uploaded successfully!');
    } catch (err) {
      console.error(err);
      alert('Video upload failed!');
    }
  };

  return (
    <div className="min-h-screen p-4">
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
  );
};

export default Settings;
