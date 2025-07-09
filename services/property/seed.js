import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from './models/Property.js';

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

// Optional: Clear existing data to avoid duplicates
await Property.deleteMany({});

const props = [
  {
    name: 'Maple Residency 201',
    location: { address: '201 Maple Rd', coords: { lat: 40.7128, lng: -74.0060 } },
    status: 'available'
  },
  {
    name: 'Elm Park 404',
    location: { address: '404 Elm St', coords: { lat: 41.8781, lng: -87.6298 } },
    status: 'available'
  },
  {
    name: 'Oak Meadows 110',
    location: { address: '110 Oak Blvd', coords: { lat: 29.7604, lng: -95.3698 } },
    status: 'available'
  },
  {
    name: 'Birch Garden 88',
    location: { address: '88 Birch Ln', coords: { lat: 33.7490, lng: -84.3880 } },
    status: 'available'
  },
  {
    name: 'Spruce View 77',
    location: { address: '77 Spruce Ct', coords: { lat: 39.7392, lng: -104.9903 } },
    status: 'available'
  },
  {
    name: 'Pine Towers 305',
    location: { address: '305 Pine St', coords: { lat: 34.0522, lng: -118.2437 } },
    status: 'upcomingVacancy',
    vacancyDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
  },
  {
    name: 'Cedar Villas 102',
    location: { address: '102 Cedar Ave', coords: { lat: 51.5074, lng: -0.1278 } },
    status: 'occupied'
  }
];

await Property.insertMany(props);
console.log('✅ Seeded properties');
process.exit(0);
