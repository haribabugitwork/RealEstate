// models/Property.js
import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
  // Keep original fields for backward compatibility
  name: { 
    type: String, 
    required: function() {
      return !this.propertyName; // If propertyName exists, name is not required
    }
  },
  location: {
    address: { 
      type: String, 
      required: function() {
        return !this.address; // If address exists, location.address is not required
      }
    },
    coords: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'upcomingVacancy', 'maintenance'],
    default: 'available',
    lowercase: true
  },
  tenantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null 
  },
  vacancyDate: { 
    type: Date, 
    default: null 
  },

  // Enhanced fields for new functionality
  propertyName: {
    type: String,
    trim: true,
    maxlength: 200
  },
  propertyType: {
    type: String,
    enum: ['apartment', 'house', 'condo', 'townhouse', 'studio'],
    lowercase: true
  },
  address: {
    type: String,
    trim: true,
    maxlength: 300
  },
  city: {
    type: String,
    trim: true,
    maxlength: 100
  },
  state: {
    type: String,
    trim: true,
    maxlength: 50
  },
  zipCode: {
    type: String,
    trim: true,
    maxlength: 20
  },
  bedrooms: {
    type: Number,
    min: 0,
    max: 20
  },
  bathrooms: {
    type: Number,
    min: 0,
    max: 20
  },
  squareFootage: {
    type: Number,
    min: 0
  },
  rentAmount: {
    type: Number,
    min: 0
  },
  securityDeposit: {
    type: Number,
    min: 0,
    default: 0
  },
  parkingSpaces: {
    type: Number,
    min: 0,
    default: 0
  },
  availableDate: {
    type: Date
  },
  description: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  amenities: {
    type: String,
    maxlength: 500,
    default: ''
  },
  petPolicy: {
    type: String,
    maxlength: 300,
    default: ''
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  leaseStartDate: {
    type: Date
  },
  leaseEndDate: {
    type: Date
  },
  lastMaintenanceDate: {
    type: Date
  }
}, { 
  timestamps: true // This will automatically manage createdAt and updatedAt
});

// Indexes for better query performance
PropertySchema.index({ status: 1 });
PropertySchema.index({ propertyType: 1 });
PropertySchema.index({ city: 1 });
PropertySchema.index({ rentAmount: 1 });
PropertySchema.index({ availableDate: 1 });
PropertySchema.index({ createdAt: -1 });
PropertySchema.index({ 'location.coords': '2dsphere' }); // For geospatial queries

// Compound indexes
PropertySchema.index({ status: 1, propertyType: 1 });
PropertySchema.index({ city: 1, status: 1 });
PropertySchema.index({ rentAmount: 1, status: 1 });

// Virtual for full address (supports both old and new formats)
PropertySchema.virtual('fullAddress').get(function() {
  if (this.address && this.city && this.state && this.zipCode) {
    return `${this.address}, ${this.city}, ${this.state} ${this.zipCode}`;
  } else if (this.location && this.location.address) {
    return this.location.address;
  }
  return 'Address not available';
});

// Virtual for rent with deposit
PropertySchema.virtual('totalMoveInCost').get(function() {
  return (this.rentAmount || 0) + (this.securityDeposit || 0);
});

// Virtual for display name (supports both old and new formats)
PropertySchema.virtual('displayName').get(function() {
  return this.propertyName || this.name || 'Unnamed Property';
});

// Pre-save middleware to ensure backward compatibility
PropertySchema.pre('save', function(next) {
  // Sync name and propertyName
  if (this.propertyName && !this.name) {
    this.name = this.propertyName;
  } else if (this.name && !this.propertyName) {
    this.propertyName = this.name;
  }

  // Sync address fields
  if (this.address && (!this.location || !this.location.address)) {
    if (!this.location) this.location = {};
    this.location.address = this.address;
  } else if (this.location && this.location.address && !this.address) {
    this.address = this.location.address;
  }

  // Sync coordinates
  if (this.location && this.location.coords && this.location.coords.lat && this.location.coords.lng) {
    // Keep existing coords
  }

  // Sync vacancy date and available date
  if (this.availableDate && !this.vacancyDate) {
    this.vacancyDate = this.availableDate;
  } else if (this.vacancyDate && !this.availableDate) {
    this.availableDate = this.vacancyDate;
  }

  next();
});

// Pre-findOneAndUpdate middleware to update the updatedAt field
PropertySchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Static method to find available properties
PropertySchema.statics.findAvailable = function(filters = {}) {
  return this.find({ ...filters, status: 'available' });
};

// Static method to find properties by rent range
PropertySchema.statics.findByRentRange = function(minRent, maxRent) {
  return this.find({
    rentAmount: { $gte: minRent, $lte: maxRent }
  });
};

// Static method to find upcoming vacancies
PropertySchema.statics.findUpcomingVacancies = function(days = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    $or: [
      { status: 'upcomingVacancy' },
      { 
        vacancyDate: { 
          $gte: new Date(), 
          $lte: futureDate 
        } 
      },
      { 
        availableDate: { 
          $gte: new Date(), 
          $lte: futureDate 
        } 
      }
    ]
  });
};

// Instance method to check if property is available
PropertySchema.methods.isAvailable = function() {
  return this.status === 'available';
};

// Instance method to mark property as occupied
PropertySchema.methods.markAsOccupied = function(tenantId, leaseStartDate, leaseEndDate) {
  this.status = 'occupied';
  this.tenantId = tenantId;
  this.leaseStartDate = leaseStartDate;
  this.leaseEndDate = leaseEndDate;
  this.vacancyDate = null;
  this.availableDate = null;
  return this.save();
};

// Instance method to mark property as available
PropertySchema.methods.markAsAvailable = function(availableDate = null) {
  this.status = 'available';
  this.tenantId = null;
  this.leaseStartDate = null;
  this.leaseEndDate = null;
  if (availableDate) {
    this.availableDate = availableDate;
    this.vacancyDate = availableDate;
  }
  return this.save();
};

// Instance method to mark upcoming vacancy
PropertySchema.methods.markUpcomingVacancy = function(vacancyDate) {
  this.status = 'upcomingVacancy';
  this.vacancyDate = vacancyDate;
  this.availableDate = vacancyDate;
  return this.save();
};

// Instance method to calculate days until lease expiry
PropertySchema.methods.daysUntilLeaseExpiry = function() {
  if (!this.leaseEndDate) return null;
  
  const today = new Date();
  const expiryDate = new Date(this.leaseEndDate);
  const diffTime = expiryDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Instance method to calculate days until vacancy
PropertySchema.methods.daysUntilVacancy = function() {
  const vacancyDate = this.vacancyDate || this.availableDate;
  if (!vacancyDate) return null;
  
  const today = new Date();
  const vacancy = new Date(vacancyDate);
  const diffTime = vacancy - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Export using ES6 syntax
export default mongoose.model('Property', PropertySchema);