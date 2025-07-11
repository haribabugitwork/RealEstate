import React, { useState } from 'react';
import '../styles/PropertyForm.css';

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
      const token = localStorage.getItem('token');
      const response = await fetch('/api/properties/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
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
      } else {
        const error = await response.json();
        setSubmitStatus({ type: 'error', message: error.message || 'Failed to add property' });
      }
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
    <div className="property-form-container">
      <form className="property-form" onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="form-section">
          <h4>Basic Information</h4>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="propertyName">Property Name *</label>
              <input
                type="text"
                id="propertyName"
                name="propertyName"
                value={formData.propertyName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="propertyType">Property Type *</label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="studio">Studio</option>
              </select>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="form-section">
          <h4>Address Information</h4>
          <div className="form-group">
            <label htmlFor="address">Street Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="state">State *</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="zipCode">ZIP Code *</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="form-section">
          <h4>Property Details</h4>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bedrooms">Bedrooms</label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="bathrooms">Bathrooms</label>
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                min="0"
                step="0.5"
              />
            </div>
            <div className="form-group">
              <label htmlFor="squareFootage">Square Footage</label>
              <input
                type="number"
                id="squareFootage"
                name="squareFootage"
                value={formData.squareFootage}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="form-section">
          <h4>Financial Information</h4>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rentAmount">Monthly Rent ($) *</label>
              <input
                type="number"
                id="rentAmount"
                name="rentAmount"
                value={formData.rentAmount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="securityDeposit">Security Deposit ($)</label>
              <input
                type="number"
                id="securityDeposit"
                name="securityDeposit"
                value={formData.securityDeposit}
                onChange={handleInputChange}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="form-section">
          <h4>Additional Information</h4>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="availableDate">Available Date</label>
              <input
                type="date"
                id="availableDate"
                name="availableDate"
                value={formData.availableDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="parkingSpaces">Parking Spaces</label>
              <input
                type="number"
                id="parkingSpaces"
                name="parkingSpaces"
                value={formData.parkingSpaces}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Under Maintenance</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="amenities">Amenities</label>
            <textarea
              id="amenities"
              name="amenities"
              value={formData.amenities}
              onChange={handleInputChange}
              placeholder="List amenities (e.g., Pool, Gym, Parking, etc.)"
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="petPolicy">Pet Policy</label>
            <textarea
              id="petPolicy"
              name="petPolicy"
              value={formData.petPolicy}
              onChange={handleInputChange}
              placeholder="Pet policy details"
              rows="2"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Property description"
              rows="4"
            />
          </div>
        </div>

        {/* Submit Status */}
        {submitStatus && (
          <div className={`submit-status ${submitStatus.type}`}>
            {submitStatus.message}
          </div>
        )}

        {/* Form Actions */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={resetForm}
            disabled={isSubmitting}
          >
            Reset Form
          </button>
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding Property...' : 'Add Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;