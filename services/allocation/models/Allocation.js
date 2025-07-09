import mongoose from 'mongoose';

const allocationSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  tenantEmail: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed'],
    default: 'pending'
  },
  invitedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Allocation', allocationSchema);
