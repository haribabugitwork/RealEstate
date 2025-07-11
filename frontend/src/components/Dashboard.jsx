import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow px-4">
        <div className="container-fluid justify-content-between">
          <div className="navbar-brand fw-bold fs-4">
            <div>Real</div>
            <div>Estates</div>
          </div>
          <div className="d-flex gap-4 fw-semibold">
            <a href="#" className="text-dark text-decoration-none">Home</a>
            <Link to="/" className="text-dark text-decoration-none">Logout</Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="d-flex flex-grow-1" style={{ height: 'calc(100vh - 70px)' }}>
        {/* Sidebar */}
        <div className="bg-dark text-white" style={{ width: '250px', paddingTop: '10px' }}>
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link
                to="propertyloader"
                className="nav-link text-light px-3 py-2"
                style={{ color: '#ccc' }}
              >
                Property Loader
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="viewproperties"
                className="nav-link text-light px-3 py-2"
                style={{ color: '#ccc' }}
              >
                View Properties
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="tenantdetails"
                className="nav-link text-light px-3 py-2"
                style={{ color: '#ccc' }}
              >
                View Tenant Details
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="contractsexpiry"
                className="nav-link text-light px-3 py-2"
                style={{ color: '#ccc' }}
              >
                View Contracts Expire <br /> in two months
              </Link>
            </li>
          </ul>
        </div>

        {/* Outlet Content */}
        <div className="flex-grow-1 p-4 bg-light overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
