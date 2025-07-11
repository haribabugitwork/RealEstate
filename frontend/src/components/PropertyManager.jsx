import React, { useState } from 'react';
import CSVUploader from './CSVUploader';
import PropertyForm from './PropertyForm';
import '../styles/PropertyManager.css';

const PropertyManager = () => {
  const [activeTab, setActiveTab] = useState('bulk');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="property-manager">
      <div className="property-manager-header">
        <h2>Property Management</h2>
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'bulk' ? 'active' : ''}`}
            onClick={() => handleTabChange('bulk')}
          >
            <span className="tab-icon">📊</span>
            Bulk Upload (CSV)
          </button>
          <button 
            className={`tab-button ${activeTab === 'individual' ? 'active' : ''}`}
            onClick={() => handleTabChange('individual')}
          >
            <span className="tab-icon">➕</span>
            Add Individual Property
          </button>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'bulk' && (
          <div className="tab-panel">
            <div className="panel-header">
              <h3>Bulk Property Upload</h3>
              <p>Upload multiple properties at once using a CSV file</p>
            </div>
            <CSVUploader />
          </div>
        )}

        {activeTab === 'individual' && (
          <div className="tab-panel">
            <div className="panel-header">
              <h3>Add Individual Property</h3>
              <p>Add a single property with detailed information</p>
            </div>
            <PropertyForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyManager;