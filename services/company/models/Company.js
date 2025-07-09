// services/company/models/Company.js
import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  adminEmail: { type: String, required: true },
  unitIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }]
}, { timestamps: true });

export default mongoose.model('Company', companySchema);
