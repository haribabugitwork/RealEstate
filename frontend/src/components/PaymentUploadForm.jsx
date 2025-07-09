// src/components/PaymentUploadForm.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const PaymentUploadForm = () => {
  const [tenants, setTenants] = useState([]);
  const [tenantId, setTenantId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [chequeNumber, setChequeNumber] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Fetch tenants list
    axios.get('/users?role=Tenant')
      .then(res => setTenants(res.data))
      .catch(err => console.error(err));

    // Fetch next cheque number
    axios.get('/payments/nextChequeNumber')
      .then(res => setChequeNumber(res.data.nextChequeNumber))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await axios.post('/payments', {
        tenantId,
        amount: parseFloat(amount),
        date,
        chequeNumber
      });
      setSuccess('Payment uploaded successfully');
      // Optionally fetch next number
      const res = await axios.get('/payments/nextChequeNumber');
      setChequeNumber(res.data.nextChequeNumber);
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Upload Payment</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Tenant</label>
          <select
            value={tenantId}
            onChange={e => setTenantId(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="" disabled>Select tenant</option>
            {tenants.map(t => (
              <option key={t._id} value={t._id}>{t.email}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Amount</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Cheque Number</label>
          <input
            type="text"
            value={chequeNumber}
            readOnly
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
};

export default PaymentUploadForm;
