// Enhanced PropertyForm component with all original fields
  const PropertyForm = () => {
    const [formData, setFormData] = useState({
      propertyName: '',
      propertyType: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      bedrooms: '',
      bathrooms: '',
      squareFootage: '',
      rentAmount: '',
      securityDeposit: '',
      availableDate: '',
      description: '',
      amenities: '',
      petPolicy: '',
      parkingSpaces: '',
      status: 'available'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitStatus(null);

      try {
        // Simulate API call for demo
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setSubmitStatus({ type: 'success', message: 'Property added successfully!' });
        // Reset form
        setFormData({
          propertyName: '',
          propertyType: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          bedrooms: '',
          bathrooms: '',
          squareFootage: '',
          rentAmount: '',
          securityDeposit: '',
          availableDate: '',
          description: '',
          amenities: '',
          petPolicy: '',
          parkingSpaces: '',
          status: 'available'
        });
      } catch (error) {
        setSubmitStatus({ type: 'error', message: 'Network error. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    };

    const resetForm = () => {
      setFormData({
        propertyName: '',
        propertyType: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        bedrooms: '',
        bathrooms: '',
        squareFootage: '',
        rentAmount: '',
        securityDeposit: '',
        availableDate: '',
        description: '',
        amenities: '',
        petPolicy: '',
        parkingSpaces: '',
        status: 'available'
      });
      setSubmitStatus(null);
    };

    return (
      <div className="container-fluid">
        <div onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <div className="card mb-4 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <div className="card-header border-0 py-3" 
                 style={{ background: 'linear-gradient(to right, #e3f2fd, #f3e5f5)', borderRadius: '15px 15px 0 0' }}>
              <h5 className="mb-0 fw-bold text-primary d-flex align-items-center">
                <Building2 size={20} className="me-2" />
                Basic Information
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Property Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="propertyName"
                    value={formData.propertyName}
                    onChange={handleInputChange}
                    placeholder="Enter property name"
                    style={{ borderRadius: '8px' }}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Property Type <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    style={{ borderRadius: '8px' }}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="studio">Studio</option>
                    <option value="villa">Villa</option>
                    <option value="penthouse">Penthouse</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information Section */}
          <div className="card mb-4 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <div className="card-header border-0 py-3" 
                 style={{ background: 'linear-gradient(to right, #e3f2fd, #f3e5f5)', borderRadius: '15px 15px 0 0' }}>
              <h5 className="mb-0 fw-bold text-primary d-flex align-items-center">
                <MapPin size={20} className="me-2" />
                Address Information
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Street Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter full street address"
                    style={{ borderRadius: '8px' }}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    City <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    style={{ borderRadius: '8px' }}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    State <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                    style={{ borderRadius: '8px' }}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    ZIP Code <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="Enter ZIP code"
                    style={{ borderRadius: '8px' }}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Property Details Section */}
          <div className="card mb-4 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <div className="card-header border-0 py-3" 
                 style={{ background: 'linear-gradient(to right, #e3f2fd, #f3e5f5)', borderRadius: '15px 15px 0 0' }}>
              <h5 className="mb-0 fw-bold text-primary d-flex align-items-center">
                <Home size={20} className="me-2" />
                Property Details
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Bedrooms</label>
                  <input
                    type="number"
                    className="form-control"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    placeholder="Number of bedrooms"
                    style={{ borderRadius: '8px' }}
                    min="0"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Bathrooms</label>
                  <input
                    type="number"
                    className="form-control"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    placeholder="Number of bathrooms"
                    style={{ borderRadius: '8px' }}
                    min="0"
                    step="0.5"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Square Footage</label>
                  <input
                    type="number"
                    className="form-control"
                    name="squareFootage"
                    value={formData.squareFootage}
                    onChange={handleInputChange}
                    placeholder="Square footage"
                    style={{ borderRadius: '8px' }}
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Financial Information Section */}
          <div className="card mb-4 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <div className="card-header border-0 py-3" 
                 style={{ background: 'linear-gradient(to right, #e3f2fd, #f3e5f5)', borderRadius: '15px 15px 0 0' }}>
              <h5 className="mb-0 fw-bold text-primary d-flex align-items-center">
                <DollarSign size={20} className="me-2" />
                Financial Information
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Monthly Rent ($) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="rentAmount"
                    value={formData.rentAmount}
                    onChange={handleInputChange}
                    placeholder="Monthly rent amount"
                    style={{ borderRadius: '8px' }}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Security Deposit ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="securityDeposit"
                    value={formData.securityDeposit}
                    onChange={handleInputChange}
                    placeholder="Security deposit amount"
                    style={{ borderRadius: '8px' }}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="card mb-4 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <div className="card-header border-0 py-3" 
                 style={{ background: 'linear-gradient(to right, #e3f2fd, #f3e5f5)', borderRadius: '15px 15px 0 0' }}>
              <h5 className="mb-0 fw-bold text-primary d-flex align-items-center">
                <Calendar size={20} className="me-2" />
                Additional Information
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    Available Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="availableDate"
                    value={formData.availableDate}
                    onChange={handleInputChange}
                    style={{ borderRadius: '8px' }}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Parking Spaces</label>
                  <input
                    type="number"
                    className="form-control"
                    name="parkingSpaces"
                    value={formData.parkingSpaces}
                    onChange={handleInputChange}
                    placeholder="Number of parking spaces"
                    style={{ borderRadius: '8px' }}
                    min="0"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    style={{ borderRadius: '8px' }}
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Under Maintenance</option>
                  </select>
                </div>
              </div>
              
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold">Amenities</label>
                  <textarea
                    className="form-control"
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleInputChange}
                    placeholder="List amenities (e.g., Pool, Gym, Parking, Air Conditioning, etc.)"
                    style={{ borderRadius: '8px' }}
                    rows="3"
                  />
                  <div className="form-text">Separate multiple amenities with commas</div>
                </div>
                
                <div className="col-12">
                  <label className="form-label fw-semibold">Pet Policy</label>
                  <textarea
                    className="form-control"
                    name="petPolicy"
                    value={formData.petPolicy}
                    onChange={handleInputChange}
                    placeholder="Describe pet policy (e.g., Pets allowed with deposit, No pets, etc.)"
                    style={{ borderRadius: '8px' }}
                    rows="2"
                  />
                </div>
                
                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Property Description
                  </label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide a detailed description of the property, including unique features, nearby amenities, and any other relevant information"
                    style={{ borderRadius: '8px' }}
                    rows="4"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Status */}
          {submitStatus && (
            <div className={`alert ${submitStatus.type === 'success' ? 'alert-success' : 'alert-danger'} border-0 mb-4`}
                 style={{ borderRadius: '10px' }}>
              <div className="d-flex align-items-center">
                {submitStatus.type === 'success' ? (
                  <div className="rounded-circle p-2 me-3" style={{ background: '#d4edda' }}>
                    <Check size={16} style={{ color: '#155724' }} />
                  </div>
                ) : (
                  <div className="rounded-circle p-2 me-3" style={{ background: '#f8d7da' }}>
                    <X size={16} style={{ color: '#721c24' }} />
                  </div>
                )}
                <span className="fw-semibold">{submitStatus.message}</span>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '15px' }}>
            <div className="card-body p-4">
              <div className="d-flex gap-3 justify-content-end">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary px-4 py-2 fw-semibold d-flex align-items-center"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  style={{ borderRadius: '10px' }}
                >
                  <RefreshCw size={16} className="me-2" />
                  Reset Form
                </button>
                <button 
                  type="button" 
                  className="btn text-white px-5 py-2 fw-bold d-flex align-items-center"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{ 
                    background: isSubmitting ? '#6c757d' : 'linear-gradient(to right, #28a745, #20c997)',
                    border: 'none',
                    borderRadius: '10px'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      Adding Property...
                    </>
                  ) : (
                    <>
                      <Plus size={16} className="me-2" />
                      Add Property
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };import React, { useState } from 'react';
import { Upload, Plus, FileSpreadsheet, Home, Building2, MapPin, DollarSign, Calendar, Check, X, RefreshCw } from 'lucide-react';

const PropertyManager = () => {
  const [activeTab, setActiveTab] = useState('bulk');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // CSV Uploader component
  const CSVUploader = () => {
    const [csvFile, setCsvFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      setCsvFile(file);
      setUploadStatus(null);
    };

    const handleUpload = async () => {
      if (!csvFile) {
        setUploadStatus({ type: 'error', message: 'Please select a CSV file first' });
        return;
      }

      setIsUploading(true);
      setUploadStatus(null);

      try {
        // Simulate file processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        setUploadStatus({ type: 'success', message: 'Properties uploaded successfully!' });
        setCsvFile(null);
        // Reset file input
        document.querySelector('input[type="file"]').value = '';
      } catch (error) {
        setUploadStatus({ type: 'error', message: 'Failed to upload properties. Please try again.' });
      } finally {
        setIsUploading(false);
      }
    };

    const downloadSampleCSV = () => {
      const csvHeaders = 'propertyName,propertyType,address,city,state,zipCode,bedrooms,bathrooms,squareFootage,rentAmount,securityDeposit,availableDate,description,amenities,petPolicy,parkingSpaces,status,images';
      
      const sampleData = [
        'Modern Downtown Apartment,apartment,"123 Main Street, Suite 4A",New York,NY,10001,2,2,850,2500,5000,2024-08-01,"Beautiful modern apartment with city views and premium amenities","Pool,Gym,Parking,Air Conditioning,Balcony","Pets allowed with $500 deposit and monthly pet rent",1,available,"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop;https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"',
        'Suburban Family House,house,456 Oak Avenue,Los Angeles,CA,90210,4,3,2200,4500,9000,2024-09-15,"Spacious family home in quiet neighborhood with excellent schools","Garden,Garage,Fireplace,School District,Large Yard","No pets allowed",2,available,"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop;https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop;https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop"',
        'Downtown Luxury Condo,condo,789 Business Plaza,Chicago,IL,60601,2,2,1200,3200,6400,2024-07-20,"Luxury condo in business district with stunning city views","Concierge,Rooftop Deck,Gym,Pool,Doorman","Small pets under 25lbs allowed with deposit",1,available,"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop"',
        'Cozy Studio Apartment,studio,"321 Student Drive, Unit 12",Austin,TX,78701,1,1,500,1200,2400,2024-08-10,"Perfect studio for students or young professionals","High Speed Internet,Laundry,Study Area,Security","Cats allowed, no dogs",0,available,"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop;https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=300&fit=crop"',
        'Executive Penthouse,penthouse,555 Skyline Tower,Miami,FL,33101,3,3,1800,6500,13000,2024-09-01,"Executive penthouse with panoramic ocean views","Ocean View,Private Elevator,Rooftop Pool,Concierge,Valet","No pets policy",2,available,"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop;https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=300&fit=crop"',
        'Charming Townhouse,townhouse,678 Maple Street,Seattle,WA,98101,3,2.5,1600,3800,7600,2024-08-25,"Charming townhouse with modern updates and private patio","Patio,Parking,Near Transit,Updated Kitchen,Fireplace","Dogs and cats welcome with deposit",1,available,"https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&h=300&fit=crop"',
        'Luxury Villa,villa,999 Estate Drive,San Diego,CA,92101,5,4,3200,8500,17000,2024-10-01,"Magnificent luxury villa with pool and gardens","Pool,Garden,Garage,City View,Security,Guest House","All pets welcome",3,available,"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop;https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop;https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"',
        'Rented Family Home,house,246 Elm Street,Denver,CO,80201,4,3,2000,3500,7000,2024-06-01,"Beautiful family home currently occupied","Backyard,School District,2-Car Garage,Deck","Pet friendly with restrictions",2,occupied,"https://images.unsplash.com/photo-1558618666-fbd19c4cd7c7?w=400&h=300&fit=crop;https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop"'
      ];

      const csvContent = csvHeaders + '\n' + sampleData.join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'property_bulk_upload_template.csv';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setUploadStatus({ type: 'success', message: 'CSV template downloaded successfully! Check your downloads folder.' });
    };

    return (
      <div className="container-fluid">
        {/* CSV Format Instructions */}
        <div className="alert border-0 mb-4" 
             style={{ background: 'linear-gradient(to right, #e3f2fd, #f3e5f5)' }}>
          <h6 className="fw-bold text-primary mb-3">
            <FileSpreadsheet size={16} className="me-2" />
            CSV Format Requirements
          </h6>
          <div className="row g-3">
            <div className="col-md-6">
              <h6 className="fw-semibold text-primary mb-2">Required Columns:</h6>
              <ul className="small text-muted mb-0">
                <li><strong>propertyName:</strong> Name of the property</li>
                <li><strong>propertyType:</strong> apartment, house, condo, townhouse, studio, villa, penthouse</li>
                <li><strong>address:</strong> Full street address</li>
                <li><strong>city:</strong> City name</li>
                <li><strong>state:</strong> State abbreviation or full name</li>
                <li><strong>zipCode:</strong> ZIP or postal code</li>
                <li><strong>bedrooms:</strong> Number of bedrooms (numeric)</li>
                <li><strong>bathrooms:</strong> Number of bathrooms (can be decimal like 2.5)</li>
                <li><strong>squareFootage:</strong> Square footage (numeric)</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h6 className="fw-semibold text-primary mb-2">Additional Columns:</h6>
              <ul className="small text-muted mb-0">
                <li><strong>rentAmount:</strong> Monthly rent amount (numeric)</li>
                <li><strong>securityDeposit:</strong> Security deposit amount (numeric)</li>
                <li><strong>availableDate:</strong> Available date (YYYY-MM-DD format)</li>
                <li><strong>description:</strong> Property description</li>
                <li><strong>amenities:</strong> Comma-separated list of amenities</li>
                <li><strong>petPolicy:</strong> Pet policy description</li>
                <li><strong>parkingSpaces:</strong> Number of parking spaces (numeric)</li>
                <li><strong>status:</strong> available, occupied, or maintenance</li>
                <li><strong>images:</strong> Image URLs separated by semicolons (;)</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-white rounded">
            <h6 className="fw-semibold text-success mb-2">Sample CSV Format:</h6>
            <code className="small d-block text-break">
              propertyName,propertyType,address,city,state,zipCode,bedrooms,bathrooms,squareFootage,rentAmount,securityDeposit,availableDate,description,amenities,petPolicy,parkingSpaces,status,images
            </code>
            <div className="mt-2 p-2 bg-light rounded">
              <small className="text-muted">
                <strong>Images Format Example:</strong><br/>
                <code>"https://example.com/image1.jpg;https://example.com/image2.jpg;https://example.com/image3.jpg"</code>
              </small>
            </div>
          </div>
          
          <div className="mt-3 d-flex gap-2 flex-wrap">
            <button 
              type="button"
              onClick={downloadSampleCSV}
              className="btn btn-primary d-flex align-items-center fw-semibold"
              style={{ borderRadius: '8px' }}
            >
              <FileSpreadsheet size={16} className="me-2" />
              Download CSV Template
            </button>
            <div className="small text-muted d-flex align-items-center">
              <span className="badge bg-success me-2">8 Sample Properties</span>
              Complete template with real examples ready to use
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label fw-semibold">Select CSV File</label>
            <input 
              type="file" 
              className="form-control" 
              accept=".csv"
              onChange={handleFileChange}
              style={{ borderRadius: '8px' }} 
            />
            <div className="form-text">
              Upload a CSV file containing property information. Make sure all required columns are included.
            </div>
          </div>
          
          {csvFile && (
            <div className="col-12">
              <div className="alert alert-info border-0" style={{ borderRadius: '8px' }}>
                <div className="d-flex align-items-center">
                  <FileSpreadsheet size={16} className="me-2" />
                  <span className="fw-semibold">Selected file: {csvFile.name}</span>
                </div>
                <small className="text-muted">File size: {(csvFile.size / 1024).toFixed(2)} KB</small>
              </div>
            </div>
          )}

          {/* Upload Status */}
          {uploadStatus && (
            <div className="col-12">
              <div className={`alert ${uploadStatus.type === 'success' ? 'alert-success' : 'alert-danger'} border-0`}
                   style={{ borderRadius: '8px' }}>
                <div className="d-flex align-items-center">
                  {uploadStatus.type === 'success' ? (
                    <Check size={16} className="me-2" />
                  ) : (
                    <X size={16} className="me-2" />
                  )}
                  <span className="fw-semibold">{uploadStatus.message}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="col-12">
            <button 
              type="button"
              onClick={handleUpload}
              disabled={!csvFile || isUploading}
              className="btn w-100 fw-bold text-white py-3" 
              style={{ 
                background: (!csvFile || isUploading) ? '#6c757d' : 'linear-gradient(to right, #1976d2, #1565c0)', 
                borderRadius: '10px', 
                border: 'none' 
              }}
            >
              {isUploading ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Processing CSV File...
                </>
              ) : (
                <>
                  <Upload size={18} className="me-2" />
                  Upload Properties from CSV
                </>
              )}
            </button>
          </div>
        </div>

        {/* Additional Tips */}
        <div className="mt-4">
          <div className="card border-0" style={{ background: 'rgba(255, 255, 255, 0.7)', borderRadius: '10px' }}>
            <div className="card-body p-3">
              <h6 className="fw-bold text-dark mb-2">💡 Pro Tips for CSV Upload:</h6>
              <ul className="small text-muted mb-0">
                <li>Ensure your CSV file uses comma separators</li>
                <li>Use double quotes around text that contains commas</li>
                <li>Date format should be YYYY-MM-DD (e.g., 2024-08-15)</li>
                <li>Numeric fields should contain only numbers (no currency symbols)</li>
                <li>For amenities, separate multiple items with commas</li>
                <li><strong>For images, separate multiple URLs with semicolons (;)</strong></li>
                <li>Image URLs should be direct links to jpg, png, or webp files</li>
                <li>Property types must match the allowed values exactly</li>
                <li>Test image URLs before uploading to ensure they work</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-vh-100 position-relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container-fluid py-5" style={{ maxWidth: '1400px' }}>
        {/* Header Section */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-white mb-3 d-flex align-items-center justify-content-center">
            <Home size={56} className="me-3" style={{ color: '#fff' }} />
            Property Management
          </h1>
          <p className="lead text-white-50 mb-0">
            Manage your properties efficiently with bulk uploads or individual additions
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8">
            <div className="d-flex gap-3 p-3 rounded-4 shadow-lg" 
                 style={{ 
                   background: 'rgba(255, 255, 255, 0.95)',
                   backdropFilter: 'blur(10px)'
                 }}>
              <button
                onClick={() => handleTabChange('bulk')}
                className={`btn fw-bold px-4 py-3 rounded-3 flex-fill d-flex align-items-center justify-content-center ${
                  activeTab === 'bulk' ? 'text-white' : ''
                }`}
                style={activeTab === 'bulk' ? 
                  { 
                    background: 'linear-gradient(to right, #1976d2, #1565c0)',
                    border: 'none',
                    boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)',
                    transform: 'translateY(-2px)'
                  } : 
                  { 
                    color: '#1976d2',
                    background: 'transparent',
                    border: '2px solid #e3f2fd',
                    transition: 'all 0.3s ease'
                  }
                }
                onMouseEnter={(e) => {
                  if (activeTab !== 'bulk') {
                    e.target.style.background = 'rgba(25, 118, 210, 0.1)';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'bulk') {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                <FileSpreadsheet size={20} className="me-2" />
                Bulk Upload (CSV)
              </button>
              
              <button
                onClick={() => handleTabChange('individual')}
                className={`btn fw-bold px-4 py-3 rounded-3 flex-fill d-flex align-items-center justify-content-center ${
                  activeTab === 'individual' ? 'text-white' : ''
                }`}
                style={activeTab === 'individual' ? 
                  { 
                    background: 'linear-gradient(to right, #1976d2, #1565c0)',
                    border: 'none',
                    boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)',
                    transform: 'translateY(-2px)'
                  } : 
                  { 
                    color: '#1976d2',
                    background: 'transparent',
                    border: '2px solid #e3f2fd',
                    transition: 'all 0.3s ease'
                  }
                }
                onMouseEnter={(e) => {
                  if (activeTab !== 'individual') {
                    e.target.style.background = 'rgba(25, 118, 210, 0.1)';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'individual') {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                <Plus size={20} className="me-2" />
                Add Individual Property
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {activeTab === 'bulk' && (
              <div className="card border-0 shadow-lg" 
                   style={{ 
                     borderRadius: '20px',
                     background: 'rgba(255, 255, 255, 0.95)',
                     backdropFilter: 'blur(10px)',
                     animation: 'fadeIn 0.5s ease-in'
                   }}>
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                         style={{ 
                           width: '80px', 
                           height: '80px', 
                           background: 'linear-gradient(to right, #e3f2fd, #f3e5f5)' 
                         }}>
                      <FileSpreadsheet size={36} style={{ color: '#1976d2' }} />
                    </div>
                    <h3 className="fw-bold text-dark mb-2">Bulk Property Upload</h3>
                    <p className="text-muted mb-0">
                      Upload multiple properties at once using a CSV file for efficient bulk management
                    </p>
                  </div>
                  
                  {/* CSV Upload Instructions */}
                  <div className="alert border-0 mb-4" 
                       style={{ background: 'linear-gradient(to right, #e3f2fd, #f3e5f5)' }}>
                    <h6 className="fw-bold text-primary mb-2">
                      <Upload size={16} className="me-2" />
                      CSV Format Requirements
                    </h6>
                    <div className="small text-muted">
                      <p className="mb-1">Your CSV file should include the following columns:</p>
                      <code className="d-block p-2 bg-white rounded">
                        title, address, price, type, bedrooms, bathrooms, area, features, description, images, status
                      </code>
                    </div>
                  </div>
                  
                  <CSVUploader />
                </div>
              </div>
            )}

            {activeTab === 'individual' && (
              <div className="card border-0 shadow-lg" 
                   style={{ 
                     borderRadius: '20px',
                     background: 'rgba(255, 255, 255, 0.95)',
                     backdropFilter: 'blur(10px)',
                     animation: 'fadeIn 0.5s ease-in'
                   }}>
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                         style={{ 
                           width: '80px', 
                           height: '80px', 
                           background: 'linear-gradient(to right, #e8f5e8, #f0fff0)' 
                         }}>
                      <Building2 size={36} style={{ color: '#28a745' }} />
                    </div>
                    <h3 className="fw-bold text-dark mb-2">Add Individual Property</h3>
                    <p className="text-muted mb-0">
                      Add a single property with detailed information and custom specifications
                    </p>
                  </div>
                  
                  {/* Property Form Tips */}
                  <div className="alert border-0 mb-4" 
                       style={{ background: 'linear-gradient(to right, #e8f5e8, #f0fff0)' }}>
                    <h6 className="fw-bold text-success mb-2">
                      <Plus size={16} className="me-2" />
                      Property Information Tips
                    </h6>
                    <div className="small text-muted">
                      <ul className="mb-0 ps-3">
                        <li>Provide detailed property descriptions for better visibility</li>
                        <li>Upload high-quality images to attract more tenants</li>
                        <li>Include all amenities and features in the property details</li>
                      </ul>
                    </div>
                  </div>
                  
                  <PropertyForm />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        .btn:hover {
          transition: all 0.3s ease;
        }

        .card {
          transition: all 0.3s ease;
        }

        .form-control:focus,
        .form-select:focus {
          border-color: #1976d2;
          box-shadow: 0 0 0 0.2rem rgba(25, 118, 210, 0.25);
        }

        @media (max-width: 768px) {
          .display-4 {
            font-size: 2rem;
          }
          
          .btn {
            font-size: 0.875rem;
            padding: 0.75rem 1rem !important;
          }
          
          .card-body {
            padding: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyManager;