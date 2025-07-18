import React, { useState } from 'react';
import { Home, MapPin, DollarSign, Calendar, User, Phone, Mail, ChevronLeft, ChevronRight, UserPlus, X, Check, Plus, Trash2, CreditCard, RefreshCw, Hash } from 'lucide-react';

const PropertyStatusTabs = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [currentPage, setCurrentPage] = useState(1);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [tenantForm, setTenantForm] = useState({
    name: '',
    phone: '',
    email: '',
    leaseStart: '',
    leaseEnd: '',
    cautionDeposit: '',
    checks: [],
    numberOfChecks: '',
    firstCheckNumber: '',
    checkAmount: ''
  });
  const itemsPerPage = 6;

  // Initial property data with state management
  const [properties, setProperties] = useState({
    available: [
      {
        id: 1,
        title: "Modern Downtown Apartment",
        address: "123 Main Street, Downtown",
        price: "$1,200/month",
        type: "Apartment",
        bedrooms: 2,
        bathrooms: 2,
        area: "850 sq ft",
        features: ["Parking", "Gym", "Pool", "Pet Friendly"],
        description: "Beautiful modern apartment with city views and premium amenities.",
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"]
      },
      {
        id: 2,
        title: "Cozy Suburban House",
        address: "456 Oak Avenue, Suburbs",
        price: "$2,500/month",
        type: "House",
        bedrooms: 3,
        bathrooms: 2,
        area: "1,200 sq ft",
        features: ["Garden", "Garage", "Fireplace"],
        description: "Charming house with a beautiful garden and quiet neighborhood.",
        images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop"]
      },
      {
        id: 3,
        title: "Studio Loft",
        address: "789 Art District, Creative Quarter",
        price: "$800/month",
        type: "Studio",
        bedrooms: 1,
        bathrooms: 1,
        area: "500 sq ft",
        features: ["High Ceilings", "Exposed Brick", "Natural Light"],
        description: "Artistic studio loft perfect for creative professionals.",
        images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"]
      },
      {
        id: 6,
        title: "Beachfront Condo",
        address: "101 Ocean Drive, Coastal",
        price: "$1,800/month",
        type: "Condo",
        bedrooms: 2,
        bathrooms: 2,
        area: "950 sq ft",
        features: ["Beach Access", "Pool", "Balcony", "Ocean View"],
        description: "Stunning beachfront condo with panoramic ocean views.",
        images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop"]
      },
      {
        id: 7,
        title: "Mountain Cabin",
        address: "567 Pine Trail, Mountain View",
        price: "$1,500/month",
        type: "Cabin",
        bedrooms: 3,
        bathrooms: 2,
        area: "1,100 sq ft",
        features: ["Fireplace", "Deck", "Mountain View", "Hiking Trails"],
        description: "Peaceful mountain retreat with stunning natural surroundings.",
        images: ["https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop"]
      },
      {
        id: 8,
        title: "Urban Loft",
        address: "234 Industrial Blvd, Arts District",
        price: "$1,400/month",
        type: "Loft",
        bedrooms: 2,
        bathrooms: 1,
        area: "1,000 sq ft",
        features: ["High Ceilings", "Exposed Brick", "Skylights", "Art Gallery"],
        description: "Converted warehouse loft in the heart of the arts district.",
        images: ["https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop"]
      },
      {
        id: 9,
        title: "Luxury Villa",
        address: "890 Hillside Drive, Exclusive Hills",
        price: "$4,500/month",
        type: "Villa",
        bedrooms: 5,
        bathrooms: 4,
        area: "3,200 sq ft",
        features: ["Pool", "Garden", "Garage", "City View", "Security"],
        description: "Magnificent luxury villa with premium amenities and breathtaking views.",
        images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop"]
      },
      {
        id: 10,
        title: "Townhouse Central",
        address: "345 Central Park, Midtown",
        price: "$2,200/month",
        type: "Townhouse",
        bedrooms: 3,
        bathrooms: 3,
        area: "1,500 sq ft",
        features: ["Patio", "Parking", "Near Transit", "Updated Kitchen"],
        description: "Modern townhouse in prime location with easy access to downtown.",
        images: ["https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&h=300&fit=crop"]
      },
      {
        id: 11,
        title: "Garden Apartment",
        address: "678 Rose Street, Garden District",
        price: "$1,100/month",
        type: "Apartment",
        bedrooms: 1,
        bathrooms: 1,
        area: "650 sq ft",
        features: ["Garden View", "Laundry", "Pet Friendly", "Quiet"],
        description: "Charming garden apartment in peaceful residential area.",
        images: ["https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=300&fit=crop"]
      },
      {
        id: 12,
        title: "Riverside Cottage",
        address: "123 River Lane, Riverside",
        price: "$1,300/month",
        type: "Cottage",
        bedrooms: 2,
        bathrooms: 1,
        area: "800 sq ft",
        features: ["River View", "Dock", "Garden", "Fireplace"],
        description: "Quaint cottage by the river with private dock access.",
        images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"]
      },
      {
        id: 13,
        title: "City Penthouse",
        address: "999 Tower Street, Financial District",
        price: "$3,800/month",
        type: "Penthouse",
        bedrooms: 3,
        bathrooms: 3,
        area: "2,000 sq ft",
        features: ["Rooftop", "City View", "Concierge", "Gym"],
        description: "Luxurious penthouse with stunning city skyline views.",
        images: ["https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=300&fit=crop"]
      },
      {
        id: 14,
        title: "Suburban Ranch",
        address: "456 Meadow Lane, Suburbia",
        price: "$2,000/month",
        type: "House",
        bedrooms: 4,
        bathrooms: 2,
        area: "1,800 sq ft",
        features: ["Large Yard", "Garage", "Family Room", "School District"],
        description: "Spacious ranch-style home perfect for families.",
        images: ["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop"]
      }
    ],
    rented: [
      {
        id: 4,
        title: "Luxury Penthouse",
        address: "321 Skyline Drive, Uptown",
        price: "$3,500/month",
        type: "Penthouse",
        bedrooms: 3,
        bathrooms: 3,
        area: "1,800 sq ft",
        features: ["Rooftop Terrace", "Concierge", "City Views"],
        description: "Stunning penthouse with panoramic city views and luxury amenities.",
        tenant: {
          name: "John Smith",
          phone: "(555) 123-4567",
          email: "john.smith@email.com",
          leaseStart: "2024-01-15",
          leaseEnd: "2024-12-31"
        },
        images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"]
      },
      {
        id: 5,
        title: "Family Home",
        address: "654 Elm Street, Family District",
        price: "$2,800/month",
        type: "House",
        bedrooms: 4,
        bathrooms: 3,
        area: "2,000 sq ft",
        features: ["Backyard", "School District", "2-Car Garage"],
        description: "Perfect family home in excellent school district with large backyard.",
        tenant: {
          name: "Sarah Johnson",
          phone: "(555) 987-6543",
          email: "sarah.johnson@email.com",
          leaseStart: "2024-03-01",
          leaseEnd: "2025-02-28"
        },
        images: ["https://images.unsplash.com/photo-1558618666-fbd19c4cd7c7?w=400&h=300&fit=crop"]
      }
    ]
  });

  // Reset to page 1 when switching tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Open tenant allocation modal
  const openTenantModal = (property) => {
    setSelectedProperty(property);
    setShowTenantModal(true);
    setTenantForm({
      name: '',
      phone: '',
      email: '',
      leaseStart: '',
      leaseEnd: '',
      cautionDeposit: '',
      checks: [],
      numberOfChecks: '',
      firstCheckNumber: '',
      checkAmount: ''
    });
  };

  // Close tenant modal
  const closeTenantModal = () => {
    setShowTenantModal(false);
    setSelectedProperty(null);
    setTenantForm({
      name: '',
      phone: '',
      email: '',
      leaseStart: '',
      leaseEnd: '',
      cautionDeposit: '',
      checks: [],
      numberOfChecks: '',
      firstCheckNumber: '',
      checkAmount: ''
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTenantForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Generate all checks automatically
  const generateAllChecks = () => {
    const { numberOfChecks, firstCheckNumber, checkAmount, leaseStart } = tenantForm;
    
    if (!numberOfChecks || !firstCheckNumber || !checkAmount || !leaseStart) {
      alert('Please fill in Number of Checks, First Check Number, Check Amount, and Lease Start Date');
      return;
    }

    const numChecks = parseInt(numberOfChecks);
    const startCheckNum = parseInt(firstCheckNumber);
    const amount = parseFloat(checkAmount);
    const startDate = new Date(leaseStart);

    if (numChecks <= 0 || numChecks > 60) {
      alert('Number of checks must be between 1 and 60');
      return;
    }

    const newChecks = [];
    for (let i = 0; i < numChecks; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);
      
      newChecks.push({
        id: Date.now() + i,
        checkNumber: (startCheckNum + i).toString(),
        amount: amount,
        dueDate: dueDate.toISOString().split('T')[0],
        isGenerated: true
      });
    }

    setTenantForm(prev => ({
      ...prev,
      checks: newChecks
    }));
  };

  // Clear all generated checks
  const clearAllChecks = () => {
    setTenantForm(prev => ({
      ...prev,
      checks: []
    }));
  };

  // Add single manual check
  const addManualCheck = () => {
    const lastCheck = tenantForm.checks[tenantForm.checks.length - 1];
    const nextCheckNumber = lastCheck ? 
      (parseInt(lastCheck.checkNumber) + 1).toString() : 
      tenantForm.firstCheckNumber || '';

    const newCheck = {
      id: Date.now(),
      checkNumber: nextCheckNumber,
      amount: tenantForm.checkAmount || '',
      dueDate: '',
      isGenerated: false
    };
    
    setTenantForm(prev => ({
      ...prev,
      checks: [...prev.checks, newCheck]
    }));
  };

  // Remove specific check
  const removeCheck = (checkId) => {
    setTenantForm(prev => ({
      ...prev,
      checks: prev.checks.filter(check => check.id !== checkId)
    }));
  };

  // Handle individual check changes
  const handleCheckChange = (checkId, field, value) => {
    setTenantForm(prev => ({
      ...prev,
      checks: prev.checks.map(check => 
        check.id === checkId 
          ? { ...check, [field]: value, isGenerated: false }
          : check
      )
    }));
  };

  // Calculate total amount
  const getTotalAmount = () => {
    return tenantForm.checks.reduce((total, check) => {
      return total + (parseFloat(check.amount) || 0);
    }, 0).toFixed(2);
  };

  // Allocate tenant to property
  const allocateTenant = () => {
    if (!selectedProperty || !tenantForm.name || !tenantForm.phone || !tenantForm.email || !tenantForm.leaseStart || !tenantForm.leaseEnd || !tenantForm.cautionDeposit) {
      alert('Please fill in all required tenant information fields including caution deposit');
      return;
    }

    if (tenantForm.checks.length > 0) {
      const invalidChecks = tenantForm.checks.some(check => 
        !check.checkNumber || !check.amount || !check.dueDate
      );
      if (invalidChecks) {
        alert('Please fill in all check details (Check Number, Amount, and Due Date)');
        return;
      }
    }

    const updatedProperty = {
      ...selectedProperty,
      tenant: { 
        ...tenantForm,
        cautionDeposit: parseFloat(tenantForm.cautionDeposit) || 0,
        checks: tenantForm.checks.map(check => ({
          ...check,
          amount: parseFloat(check.amount) || 0
        }))
      }
    };

    setProperties(prev => ({
      available: prev.available.filter(p => p.id !== selectedProperty.id),
      rented: [...prev.rented, updatedProperty]
    }));

    closeTenantModal();
    
    const remainingAvailable = properties.available.length - 1;
    const maxPage = Math.ceil(remainingAvailable / itemsPerPage);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage);
    } else if (remainingAvailable === 0) {
      setCurrentPage(1);
    }
  };

  // Make property available again
  const makeAvailable = (property) => {
    if (window.confirm(`Are you sure you want to make "${property.title}" available again?`)) {
      const { tenant, ...propertyWithoutTenant } = property;
      
      setProperties(prev => ({
        available: [...prev.available, propertyWithoutTenant],
        rented: prev.rented.filter(p => p.id !== property.id)
      }));
    }
  };

  // Get current properties based on active tab
  const currentProperties = properties[activeTab];
  
  // Calculate pagination
  const totalPages = Math.ceil(currentProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProperties = currentProperties.slice(startIndex, endIndex);

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const PropertyCard = ({ property, status }) => (
    <div className="card h-100 shadow-lg border-0" style={{ borderRadius: '15px', overflow: 'hidden', transition: 'all 0.3s ease', transform: 'scale(1)' }}
         onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
         onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div className="position-relative">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="card-img-top"
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <div className="position-absolute top-0 end-0 m-3">
          <span className="badge rounded-pill fs-6 fw-bold text-white border border-white border-2"
            style={{
              background: status === 'available' 
                ? 'linear-gradient(to right, #28a745, #20c997)' 
                : 'linear-gradient(to right, #dc3545, #e74c3c)',
              padding: '8px 12px'
            }}>
            {status === 'available' ? 'Available' : 'Rented'}
          </span>
        </div>
      </div>
      
      <div className="card-body p-4">
        <h5 className="card-title fw-bold text-dark mb-3">{property.title}</h5>
        
        <div className="d-flex align-items-center text-muted mb-2">
          <MapPin size={16} className="me-2" />
          <small>{property.address}</small>
        </div>
        
        <div className="d-flex align-items-center mb-3">
          <div className="d-inline-flex align-items-center px-3 py-1 rounded-3 shadow-sm" 
               style={{ background: 'linear-gradient(to right, #e3f2fd, #f3e5f5)', border: '1px solid #bbdefb' }}>
            <DollarSign size={18} style={{ color: '#1976d2' }} className="me-1" />
            <span className="fs-5 fw-bold" style={{ color: '#1976d2', whiteSpace: 'nowrap' }}>
              {property.price}
            </span>
          </div>
        </div>
        
        <div className="row g-2 mb-3 small text-muted">
          <div className="col-6">Type: {property.type}</div>
          <div className="col-6">Area: {property.area}</div>
          <div className="col-6">Bedrooms: {property.bedrooms}</div>
          <div className="col-6">Bathrooms: {property.bathrooms}</div>
        </div>
        
        <p className="card-text text-muted small mb-3">{property.description}</p>
        
        <div className="d-flex flex-wrap gap-2 mb-4">
          {property.features.map((feature, index) => (
            <span 
              key={index}
              className="badge rounded-pill small fw-normal border"
              style={{ 
                background: 'linear-gradient(to right, #e3f2fd, #f3e5f5)',
                color: '#1976d2',
                borderColor: '#90caf9',
                padding: '6px 12px'
              }}
            >
              {feature}
            </span>
          ))}
        </div>
        
        {status === 'available' ? (
          <button
            onClick={() => openTenantModal(property)}
            className="btn btn-primary w-100 fw-bold d-flex align-items-center justify-content-center py-2"
            style={{ 
              background: 'linear-gradient(to right, #1976d2, #1565c0)',
              border: 'none',
              borderRadius: '10px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(to right, #1565c0, #0d47a1)';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(to right, #1976d2, #1565c0)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <UserPlus size={18} className="me-2" />
            Allocate Tenant
          </button>
        ) : (
          <div>
            <div className="border-top pt-3 mb-3">
              <h6 className="fw-bold text-dark mb-3">Tenant Information</h6>
              <div className="small text-muted">
                <div className="d-flex align-items-center mb-1">
                  <User size={16} style={{ color: '#1976d2' }} className="me-2" />
                  <span>{property.tenant.name}</span>
                </div>
                <div className="d-flex align-items-center mb-1">
                  <Phone size={16} style={{ color: '#1976d2' }} className="me-2" />
                  <span>{property.tenant.phone}</span>
                </div>
                <div className="d-flex align-items-center mb-1">
                  <Mail size={16} style={{ color: '#1976d2' }} className="me-2" />
                  <span>{property.tenant.email}</span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <Calendar size={16} style={{ color: '#1976d2' }} className="me-2" />
                  <span>Lease: {property.tenant.leaseStart} to {property.tenant.leaseEnd}</span>
                </div>
                {property.tenant.cautionDeposit && (
                  <div className="d-flex align-items-center mb-3">
                    <DollarSign size={16} style={{ color: '#28a745' }} className="me-2" />
                    <span className="fw-semibold text-success">
                      Caution Deposit: ${property.tenant.cautionDeposit}
                    </span>
                  </div>
                )}
                {property.tenant.checks && property.tenant.checks.length > 0 && (
                  <div className="mt-3 pt-2 border-top">
                    <div className="d-flex align-items-center mb-2">
                      <CreditCard size={16} style={{ color: '#1976d2' }} className="me-2" />
                      <span className="fw-semibold">Post-Dated Checks ({property.tenant.checks.length})</span>
                    </div>
                    <div className="small">
                      {property.tenant.checks.slice(0, 3).map((check, index) => (
                        <div key={index} className="d-flex justify-content-between bg-light p-2 rounded mb-1">
                          <span>Check #{check.checkNumber}</span>
                          <span className="fw-semibold">${check.amount}</span>
                          <span>{check.dueDate}</span>
                        </div>
                      ))}
                      {property.tenant.checks.length > 3 && (
                        <div className="text-center text-muted">
                          +{property.tenant.checks.length - 3} more checks
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => makeAvailable(property)}
              className="btn btn-warning w-100 fw-bold d-flex align-items-center justify-content-center py-2"
              style={{ 
                background: 'linear-gradient(to right, #ff9800, #f57c00)',
                border: 'none',
                borderRadius: '10px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(to right, #f57c00, #ef6c00)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(to right, #ff9800, #f57c00)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <Home size={18} className="me-2" />
              Make Available
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-4" style={{ maxWidth: '1400px' }}>
      <div className="mb-5">
        <h1 className="display-5 fw-bold d-flex align-items-center mb-4"
            style={{ 
              background: 'linear-gradient(to right, #1976d2, #7b1fa2)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
          <Home size={48} style={{ color: '#1976d2' }} className="me-3" />
          Property Management Dashboard
        </h1>
        
        {/* Tab Navigation */}
        <div className="d-flex gap-2 p-2 rounded-4 shadow-sm" 
             style={{ background: 'linear-gradient(to right, #e3f2fd, #f3e5f5)' }}>
          <button
            onClick={() => handleTabChange('available')}
            className={`btn fw-bold px-4 py-3 rounded-3 flex-fill ${
              activeTab === 'available' ? 'text-white' : ''
            }`}
            style={activeTab === 'available' ? 
              { 
                background: 'linear-gradient(to right, #1976d2, #1565c0)',
                border: 'none',
                boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)'
              } : 
              { 
                color: '#1976d2',
                background: 'transparent',
                border: 'none'
              }
            }
          >
            Available ({properties.available.length})
          </button>
          <button
            onClick={() => handleTabChange('rented')}
            className={`btn fw-bold px-4 py-3 rounded-3 flex-fill ${
              activeTab === 'rented' ? 'text-white' : ''
            }`}
            style={activeTab === 'rented' ? 
              { 
                background: 'linear-gradient(to right, #1976d2, #1565c0)',
                border: 'none',
                boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)'
              } : 
              { 
                color: '#1976d2',
                background: 'transparent',
                border: 'none'
              }
            }
          >
            Rented ({properties.rented.length})
          </button>
        </div>
      </div>

      {/* Properties Count and Pagination Info */}
      {currentProperties.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="text-muted small">
            Showing {startIndex + 1}-{Math.min(endIndex, currentProperties.length)} of {currentProperties.length} properties
          </div>
          <div className="text-muted small">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}

      {/* Properties Grid */}
      <div className="row g-4 mb-5">
        {paginatedProperties.map((property) => (
          <div key={property.id} className="col-lg-4 col-md-6">
            <PropertyCard 
              property={property} 
              status={activeTab} 
            />
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-2">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="btn btn-outline-primary d-flex align-items-center px-3 py-2"
            style={{ borderRadius: '10px' }}
          >
            <ChevronLeft size={18} className="me-1" />
            Previous
          </button>

          <div className="d-flex gap-1">
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              const isCurrentPage = pageNumber === currentPage;
              
              return (
                <button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  className={`btn px-3 py-2 fw-bold ${isCurrentPage ? 'btn-primary' : 'btn-outline-primary'}`}
                  style={{ 
                    borderRadius: '10px',
                    ...(isCurrentPage && {
                      background: 'linear-gradient(to right, #1976d2, #1565c0)',
                      border: 'none'
                    })
                  }}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="btn btn-outline-primary d-flex align-items-center px-3 py-2"
            style={{ borderRadius: '10px' }}
          >
            Next
            <ChevronRight size={18} className="ms-1" />
          </button>
        </div>
      )}

      {/* Empty State */}
      {currentProperties.length === 0 && (
        <div className="text-center py-5">
          <Home size={64} className="text-muted mb-3" />
          <p className="text-muted fs-5">No properties found</p>
        </div>
      )}

      {/* Tenant Allocation Modal */}
      {showTenantModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content" style={{ borderRadius: '15px' }}>
              <div className="modal-header border-0 pb-0">
                <h4 className="modal-title fw-bold">Allocate Tenant</h4>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeTenantModal}
                ></button>
              </div>
              
              <div className="modal-body">
                <div className="alert alert-primary border-0 mb-4" style={{ background: 'linear-gradient(to right, #e3f2fd, #f3e5f5)', borderRadius: '10px' }}>
                  <h5 className="fw-bold text-primary">{selectedProperty?.title}</h5>
                  <p className="text-muted mb-1">{selectedProperty?.address}</p>
                  <p className="fs-4 fw-bold text-primary mb-0">{selectedProperty?.price}</p>
                </div>

                <div className="row g-4">
                  {/* Tenant Information */}
                  <div className="col-lg-6">
                    <h5 className="fw-bold border-bottom pb-2 mb-4">Tenant Information</h5>
                    
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Tenant Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={tenantForm.name}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter tenant name"
                        style={{ borderRadius: '8px' }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={tenantForm.phone}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="(555) 123-4567"
                        style={{ borderRadius: '8px' }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={tenantForm.email}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="tenant@email.com"
                        style={{ borderRadius: '8px' }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Caution Deposit Amount ($) *</label>
                      <input
                        type="number"
                        name="cautionDeposit"
                        value={tenantForm.cautionDeposit}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="2000.00"
                        step="0.01"
                        min="0"
                        style={{ borderRadius: '8px' }}
                      />
                      <div className="form-text text-muted">
                        Security deposit amount collected from tenant
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-6">
                        <label className="form-label fw-semibold">Lease Start *</label>
                        <input
                          type="date"
                          name="leaseStart"
                          value={tenantForm.leaseStart}
                          onChange={handleInputChange}
                          className="form-control"
                          style={{ borderRadius: '8px' }}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold">Lease End *</label>
                        <input
                          type="date"
                          name="leaseEnd"
                          value={tenantForm.leaseEnd}
                          onChange={handleInputChange}
                          className="form-control"
                          style={{ borderRadius: '8px' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Post-Dated Checks */}
                  <div className="col-lg-6">
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-4">
                      <h5 className="fw-bold mb-0">Post-Dated Checks</h5>
                      <div className="d-flex gap-2">
                        {tenantForm.checks.length > 0 && (
                          <button
                            onClick={clearAllChecks}
                            className="btn btn-sm text-white"
                            style={{ 
                              background: '#dc3545',
                              border: 'none',
                              borderRadius: '6px'
                            }}
                          >
                            <Trash2 size={14} className="me-1" />
                            Clear All
                          </button>
                        )}
                        <button
                          onClick={addManualCheck}
                          className="btn btn-sm text-white"
                          style={{ 
                            background: '#1976d2',
                            border: 'none',
                            borderRadius: '6px'
                          }}
                        >
                          <Plus size={14} className="me-1" />
                          Add Single
                        </button>
                      </div>
                    </div>

                    {/* Auto-Generation Controls */}
                    <div className="p-3 mb-3 rounded-3" style={{ background: 'linear-gradient(to right, #e3f2fd, #f3e5f5)', border: '1px solid #90caf9' }}>
                      <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                        <RefreshCw size={16} className="me-2" />
                        Auto-Generate Checks
                      </h6>
                      
                      <div className="row g-2 mb-3">
                        <div className="col-4">
                          <label className="form-label small fw-semibold text-primary">Number of Checks *</label>
                          <input
                            type="number"
                            name="numberOfChecks"
                            value={tenantForm.numberOfChecks}
                            onChange={handleInputChange}
                            className="form-control form-control-sm"
                            placeholder="12"
                            min="1"
                            max="60"
                            style={{ borderRadius: '6px' }}
                          />
                        </div>
                        <div className="col-4">
                          <label className="form-label small fw-semibold text-primary">First Check Number *</label>
                          <input
                            type="text"
                            name="firstCheckNumber"
                            value={tenantForm.firstCheckNumber}
                            onChange={handleInputChange}
                            className="form-control form-control-sm"
                            placeholder="1001"
                            style={{ borderRadius: '6px' }}
                          />
                        </div>
                        <div className="col-4">
                          <label className="form-label small fw-semibold text-primary">Check Amount ($) *</label>
                          <input
                            type="number"
                            name="checkAmount"
                            value={tenantForm.checkAmount}
                            onChange={handleInputChange}
                            className="form-control form-control-sm"
                            placeholder="1200.00"
                            step="0.01"
                            style={{ borderRadius: '6px' }}
                          />
                        </div>
                      </div>
                      
                      <button
                        onClick={generateAllChecks}
                        className="btn btn-primary w-100 fw-semibold d-flex align-items-center justify-content-center"
                        style={{ 
                          background: '#1976d2',
                          border: 'none',
                          borderRadius: '8px'
                        }}
                      >
                        <Hash size={16} className="me-2" />
                        Generate {tenantForm.numberOfChecks || 'All'} Sequential Checks
                      </button>
                      
                      <p className="small text-primary mt-2 mb-0">
                        * Checks will be generated monthly starting from lease start date
                      </p>
                    </div>

                    {/* Checks Summary */}
                    {tenantForm.checks.length > 0 && (
                      <div className="p-3 mb-3 rounded-3" style={{ background: 'linear-gradient(to right, #e8f5e8, #f0fff0)', border: '1px solid #81c784' }}>
                        <div className="d-flex justify-content-between align-items-center small">
                          <span className="fw-semibold text-success">
                            Total Checks: {tenantForm.checks.length}
                          </span>
                          <span className="fw-bold text-success">
                            Total Amount: ${getTotalAmount()}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Checks List */}
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {tenantForm.checks.map((check, index) => (
                        <div key={check.id} className={`p-3 mb-2 border rounded-3 ${
                          check.isGenerated ? 'bg-light border-primary' : 'bg-white border-secondary'
                        }`}>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-semibold small d-flex align-items-center">
                              <CreditCard size={16} className="me-1" />
                              Check #{index + 1}
                              {check.isGenerated && (
                                <span className="badge bg-primary ms-2 small">Auto</span>
                              )}
                            </span>
                            <button
                              onClick={() => removeCheck(check.id)}
                              className="btn btn-sm btn-outline-danger"
                              style={{ borderRadius: '6px' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          
                          <div className="row g-2">
                            <div className="col-4">
                              <label className="form-label small">Check Number</label>
                              <input
                                type="text"
                                value={check.checkNumber}
                                onChange={(e) => handleCheckChange(check.id, 'checkNumber', e.target.value)}
                                className="form-control form-control-sm"
                                placeholder="Check #"
                                style={{ borderRadius: '6px' }}
                              />
                            </div>
                            <div className="col-4">
                              <label className="form-label small">Amount ($)</label>
                              <input
                                type="number"
                                value={check.amount}
                                onChange={(e) => handleCheckChange(check.id, 'amount', e.target.value)}
                                className="form-control form-control-sm"
                                placeholder="0.00"
                                step="0.01"
                                style={{ borderRadius: '6px' }}
                              />
                            </div>
                            <div className="col-4">
                              <label className="form-label small">Due Date</label>
                              <input
                                type="date"
                                value={check.dueDate}
                                onChange={(e) => handleCheckChange(check.id, 'dueDate', e.target.value)}
                                className="form-control form-control-sm"
                                style={{ borderRadius: '6px' }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {tenantForm.checks.length === 0 && (
                        <div className="text-center py-5 text-muted">
                          <CreditCard size={48} className="mb-3" style={{ opacity: 0.3 }} />
                          <p className="fw-semibold">No post-dated checks added</p>
                          <p className="small">Use auto-generate or add single checks manually</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 pt-0">
                <div className="d-flex gap-3 w-100">
                  <button
                    onClick={closeTenantModal}
                    className="btn btn-outline-secondary flex-fill py-3 fw-semibold"
                    style={{ borderRadius: '10px' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={allocateTenant}
                    className="btn btn-primary flex-fill py-3 fw-bold d-flex align-items-center justify-content-center"
                    style={{ 
                      background: 'linear-gradient(to right, #1976d2, #1565c0)',
                      border: 'none',
                      borderRadius: '10px'
                    }}
                  >
                    <Check size={18} className="me-2" />
                    Allocate Tenant
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyStatusTabs;