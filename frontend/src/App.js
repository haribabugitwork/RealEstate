import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import AvailableUnitsTable from './components/AvailableUnitsTable';

function App() {
  // simple auth check
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route
          path="/dashboard"
          element={
            token ? (
              // replace this with your real dashboard layout
              <div className="p-4">
                <h1 className="text-2xl mb-4">Dashboard</h1>
                <AvailableUnitsTable />
              </div>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
