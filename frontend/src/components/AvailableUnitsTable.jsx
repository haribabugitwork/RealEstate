// src/components/AvailableUnitsTable.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 10;

const AvailableUnitsTable = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // Debug: Check token on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token in localStorage:', token);
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        console.log('Token expires at:', new Date(payload.exp * 1000));
        console.log('Current time:', new Date());
        console.log('Is token expired?', payload.exp * 1000 < Date.now());
      } catch (e) {
        console.log('Error decoding token:', e);
      }
    } else {
      console.log('No token found in localStorage');
      console.log('Available localStorage keys:', Object.keys(localStorage));
    }
  }, []);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Making API request to: /property/properties?status=available');
        
        const res = await axios.get('/property/properties?status=available');
        console.log('API Response:', res.data);
        
        setUnits(res.data);
      } catch (err) {
        console.error('API Error:', err);
        console.error('Error response:', err.response);
        
        if (err.response?.status === 401) {
          setError('Authentication required. Please log in.');
          // Optionally redirect to login
          // navigate('/login');
        } else if (err.response?.status === 403) {
          setError('Access denied. You do not have permission to view this data.');
        } else {
          setError(`Failed to load properties: ${err.response?.data?.message || err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUnits();
  }, [navigate]);

  const start = (page - 1) * PAGE_SIZE;
  const paginated = units.slice(start, start + PAGE_SIZE);
  const totalPages = Math.ceil(units.length / PAGE_SIZE);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleLogin = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2">Loading properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
        <div className="space-x-2">
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (units.length === 0) {
    return (
      <div className="p-4">
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No available properties found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Available Properties</h2>
        <p className="text-gray-600">{units.length} properties found</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="border-b px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="border-b px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="border-b px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="border-b px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginated.map(unit => (
              <tr key={unit._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{unit.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {unit.location?.address || 'Address not available'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {unit.type || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => navigate(`/properties/${unit._id}`)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <span className="text-sm text-gray-500">
              ({units.length} total items)
            </span>
          </div>
          
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Debug info - remove in production */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm">
        <h3 className="font-bold mb-2">Debug Info:</h3>
        <p>Token exists: {localStorage.getItem('token') ? 'Yes' : 'No'}</p>
        <p>Units loaded: {units.length}</p>
        <p>Current page: {page}</p>
        <p>Total pages: {totalPages}</p>
      </div>
    </div>
  );
};

export default AvailableUnitsTable;