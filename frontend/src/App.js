import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import Dashboard from './components/Dashboard';
import AvailableUnitsTable from './components/AvailableUnitsTable';
import CSVUploader from './components/CSVUploader';
import PropertyManager from './components/PropertyManager';

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

        {/* Dashboard layout + nested routes */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/" replace />}
        >
          <Route path="propertyloader" element={<PropertyManager />} />
          {/* Future content components can go here */}
          { <Route path="viewproperties" element={<AvailableUnitsTable />} /> }
          {/* <Route path="tenantdetails" element={<TenantDetails />} /> */}
          {/* <Route path="contractsexpiry" element={<ContractsExpiry />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
