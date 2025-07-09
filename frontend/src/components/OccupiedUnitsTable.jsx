// src/components/OccupiedUnitsTable.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const OccupiedUnitsTable = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOccupied = async () => {
      try {
        const res = await axios.get('/properties?status=occupied');
        setUnits(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOccupied();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Occupied Units</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-left">Unit Name</th>
            <th className="border px-4 py-2 text-left">Tenant Email</th>
            <th className="border px-4 py-2 text-left">Tenant Name</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {units.map(unit => (
            <tr key={unit._id}>
              <td className="border px-4 py-2">{unit.name}</td>
              <td className="border px-4 py-2">{unit.tenantId?.email || 'N/A'}</td>
              <td className="border px-4 py-2">{unit.tenantId?.name || 'N/A'}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => {/* Placeholder for details action */}}
                  className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OccupiedUnitsTable;
