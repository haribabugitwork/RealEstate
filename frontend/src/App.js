import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import Dashboard from './components/Dashboard';
import AvailableUnitsTable from './components/AvailableUnitsTable';
import CSVUploader from './components/CSVUploader';
import PropertyManager from './components/PropertyManager';
import PropertyStatusTabs from './components/PropertyStatusTabs';
import TenantDetails from './components/TenantDetails';
import OTPVerification from './components/OTPVerification';

// Placeholder for future components:
// import ViewProperties from './components/ViewProperties';
// import TenantDetails from './components/TenantDetails';
// import ContractsExpiry from './components/ContractsExpiry';

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        {/* Login route */}
        <Route path="/" element={<LoginComponent />} />
        <Route path="/auth" element={<LoginComponent />} />
        
        {/* OTP Verification route - TOP LEVEL, not nested */}
        <Route path="/otp-verification" element={<OTPVerification />} />
        
        {/* Dashboard layout + nested routes */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/" replace />}
        >
          <Route path="propertyloader" element={<PropertyManager />} />
          <Route path="viewproperties" element={<PropertyStatusTabs />} />
          <Route path="tenantdetails" element={<TenantDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;