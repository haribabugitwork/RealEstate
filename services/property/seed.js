// services/property/seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from './models/Property.js';

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const props = [
  {
    name: 'Maple Residency 201',
    location: { address: '201 Maple Rd', coords: { lat: 40.7128, lng: -74.0060 } },
    status: 'available'
  },
  {
    name: 'Pine Towers 305',
    location: { address: '305 Pine St', coords: { lat: 34.0522, lng: -118.2437 } },
    status: 'upcomingVacancy',
    vacancyDate: new Date(Date.now() + 45 * 24*60*60*1000) // 45 days out
  },
  {
    name: 'Cedar Villas 102',
    location: { address: '102 Cedar Ave', coords: { lat: 51.5074, lng: -0.1278 } },
    status: 'occupied',
    tenantId: null // you can swap in an actual ObjectId later
  },
];

await Property.insertMany(props);
console.log('Seeded properties');
process.exit(0);
