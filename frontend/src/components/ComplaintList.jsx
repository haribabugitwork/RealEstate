// src/components/ComplaintList.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/complaints');
        setComplaints(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/complaints/${id}`, { status });
      setComplaints((prev) =>
        prev.map(c => (c._id === id ? { ...c, status } : c))
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Complaints</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-left">Description</th>
            <th className="border px-4 py-2 text-left">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map(c => (
            <tr key={c._id}>
              <td className="border px-4 py-2">{c.description}</td>
              <td className="border px-4 py-2">{c.status}</td>
              <td className="border px-4 py-2 text-center">
                <select
                  value={c.status}
                  onChange={e => updateStatus(c._id, e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="open">Open</option>
                  <option value="inProgress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintList;
