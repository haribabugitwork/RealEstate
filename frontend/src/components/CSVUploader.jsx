import React, { useState } from 'react';
import axiosInstance from '../api/axios'; // Import your configured axios instance

const CSVUploader = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    console.log('Making API request to: /property/properties/bulk-upload');
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      setStatus('Uploading...');
      console.log('Making API request to: /property/properties/bulk-upload');
      
      // Use your configured axios instance and remove the Content-Type header
      const res = await axiosInstance.post('/property/properties/bulk-upload', formData, {
        headers: { 
          'Content-Type': undefined // Let browser set the boundary automatically
        },
      });
      
      console.log('API Response:', res.data);
      setStatus(res.data.message);
    } catch (err) {
      console.error(err);
      setStatus('❌ Upload failed');
    }
  };

  return (
    <div className="container mt-4">
      <h4>Upload CSV to Seed Properties</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".csv"
          className="form-control mb-2"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit" className="btn btn-success">Upload</button>
      </form>
      {status && <div className="mt-3 alert alert-info">{status}</div>}
    </div>
  );
};

export default CSVUploader;