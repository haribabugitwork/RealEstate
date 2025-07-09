// models/Property.js
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    coords: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'upcomingVacancy'],
    default: 'available'
  },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  vacancyDate: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model('Property', propertySchema);
