// services/company/models/Employee.js
import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true }
}, { _id: false });

const employeeSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  email: { type: String, required: true },
  tripAssignments: [tripSchema]
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);
