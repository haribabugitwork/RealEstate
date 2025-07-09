// src/components/ComplaintForm.jsx
import React, { useState } from 'react';
import axios from '../api/axios';

const ComplaintForm = () => {
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await axios.post('/complaints', { description });
      setMessage('Complaint submitted');
      setDescription('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Submission failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Raise a Complaint</h2>
      {message && <div className="mb-2 text-gray-700">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
