// models/Complaint.js
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  unitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['open', 'inProgress', 'resolved'],
    default: 'open'
  },
  inventoryItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Complaint', complaintSchema);