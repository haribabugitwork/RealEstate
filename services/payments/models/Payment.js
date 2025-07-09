// services/payments/models/Payment.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  chequeNumber: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
