// src/components/CompanyEmployeeAllocation.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const CompanyEmployeeAllocation = ({ companyId }) => {
  const [company, setCompany] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compRes, empRes, propRes] = await Promise.all([
          axios.get(`/companies/${companyId}`),
          axios.get(`/companies/${companyId}/employees`),
          axios.get('/properties?status=available')
        ]);
        setCompany(compRes.data);
        setEmployees(empRes.data);
        setUnits(propRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [companyId]);

  const handleAssign = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await axios.post(`/companies/${companyId}/employees`, {
        email: selectedEmployee,
        businessTripDates: [{ unitId: selectedUnit, from: fromDate, to: toDate }]
      });
      setMessage('Assignment saved');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Assignment failed');
    }
  };

  if (!company) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto mt-6 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">{company.name} – Employee Allocation</h2>
      {message && <div className="mb-2 text-gray-700">{message}</div>}
      <form onSubmit={handleAssign} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Employee Email</label>
          <select
            value={selectedEmployee}
            onChange={e => setSelectedEmployee(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="" disabled>Select employee</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp.email}>{emp.email}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Unit</label>
          <select
            value={selectedUnit}
            onChange={e => setSelectedUnit(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="" disabled>Select unit</option>
            {units.map(u => (
              <option key={u._id} value={u._id}>{u.name}</option>
            ))}
          </select>
        </div>
        <div className="flex space-x-2">
          <div className="flex-1">
            <label className="block text-sm mb-1">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1">To</label>
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Assign Unit
        </button>
      </form>
    </div>
  );
};

export default CompanyEmployeeAllocation;
