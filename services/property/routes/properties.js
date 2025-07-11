// routes/properties.js
import express from 'express';
import Property from '../models/Property.js';
import { authenticate, authorize } from '../middleware/auth.js';
import multer from 'multer';
import csvParser from 'csv-parser';
import fs from 'fs';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper function to validate CSV row
const validateCSVRow = (row, rowIndex) => {
  const errors = [];
  
  // Required fields validation
  if (!row.propertyName || String(row.propertyName).trim() === '') {
    errors.push(`Row ${rowIndex}: Property name is required`);
  }
  if (!row.propertyType || String(row.propertyType).trim() === '') {
    errors.push(`Row ${rowIndex}: Property type is required`);
  }
  if (!row.address || String(row.address).trim() === '') {
    errors.push(`Row ${rowIndex}: Address is required`);
  }
  if (!row.city || String(row.city).trim() === '') {
    errors.push(`Row ${rowIndex}: City is required`);
  }
  if (!row.state || String(row.state).trim() === '') {
    errors.push(`Row ${rowIndex}: State is required`);
  }
  if (!row.zipCode || String(row.zipCode).trim() === '') {
    errors.push(`Row ${rowIndex}: ZIP code is required`);
  }
  if (!row.rentAmount || isNaN(parseFloat(row.rentAmount)) || parseFloat(row.rentAmount) <= 0) {
    errors.push(`Row ${rowIndex}: Valid rent amount is required`);
  }
  
  // Optional numeric fields validation
  if (row.bedrooms !== undefined && row.bedrooms !== null && row.bedrooms !== '' && isNaN(parseInt(row.bedrooms))) {
    errors.push(`Row ${rowIndex}: Bedrooms must be a number`);
  }
  if (row.bathrooms !== undefined && row.bathrooms !== null && row.bathrooms !== '' && isNaN(parseFloat(row.bathrooms))) {
    errors.push(`Row ${rowIndex}: Bathrooms must be a number`);
  }
  if (row.squareFootage !== undefined && row.squareFootage !== null && row.squareFootage !== '' && isNaN(parseInt(row.squareFootage))) {
    errors.push(`Row ${rowIndex}: Square footage must be a number`);
  }
  if (row.securityDeposit !== undefined && row.securityDeposit !== null && row.securityDeposit !== '' && isNaN(parseFloat(row.securityDeposit))) {
    errors.push(`Row ${rowIndex}: Security deposit must be a number`);
  }
  if (row.parkingSpaces !== undefined && row.parkingSpaces !== null && row.parkingSpaces !== '' && isNaN(parseInt(row.parkingSpaces))) {
    errors.push(`Row ${rowIndex}: Parking spaces must be a number`);
  }
  
  // Property type validation
  const validPropertyTypes = ['apartment', 'house', 'condo', 'townhouse', 'studio'];
  if (row.propertyType && !validPropertyTypes.includes(String(row.propertyType).toLowerCase())) {
    errors.push(`Row ${rowIndex}: Property type must be one of: ${validPropertyTypes.join(', ')}`);
  }
  
  // Status validation
  const validStatuses = ['available', 'occupied', 'upcomingVacancy', 'maintenance'];
  if (row.status && !validStatuses.includes(String(row.status).toLowerCase())) {
    errors.push(`Row ${rowIndex}: Status must be one of: ${validStatuses.join(', ')}`);
  }
  
  // Date validation
  if (row.availableDate && row.availableDate !== '') {
    const date = new Date(row.availableDate);
    if (isNaN(date.getTime())) {
      errors.push(`Row ${rowIndex}: Available date must be a valid date (YYYY-MM-DD format)`);
    }
  }
  
  // Coordinate validation
  if (row.lat !== undefined && row.lat !== null && row.lat !== '' && (isNaN(parseFloat(row.lat)) || parseFloat(row.lat) < -90 || parseFloat(row.lat) > 90)) {
    errors.push(`Row ${rowIndex}: Latitude must be a number between -90 and 90`);
  }
  if (row.lng !== undefined && row.lng !== null && row.lng !== '' && (isNaN(parseFloat(row.lng)) || parseFloat(row.lng) < -180 || parseFloat(row.lng) > 180)) {
    errors.push(`Row ${rowIndex}: Longitude must be a number between -180 and 180`);
  }
  
  return errors;
};

// Helper function to format property data
const formatPropertyData = (data) => {
  // Helper function to safely convert to number
  const toNumber = (value, defaultValue = null) => {
    if (value === undefined || value === null || value === '') return defaultValue;
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
  };

  // Helper function to safely convert to integer
  const toInt = (value, defaultValue = null) => {
    if (value === undefined || value === null || value === '') return defaultValue;
    const num = parseInt(value);
    return isNaN(num) ? defaultValue : num;
  };

  // Helper function to safely trim strings
  const trimString = (value, defaultValue = '') => {
    if (value === undefined || value === null) return defaultValue;
    return String(value).trim() || defaultValue;
  };

  // Helper function to format date
  const formatDate = (value) => {
    if (!value || value === '') return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  };

  const propertyName = trimString(data.propertyName);
  const address = trimString(data.address);

  return {
    // Required fields with backward compatibility
    name: propertyName, // For backward compatibility
    propertyName: propertyName,
    
    // Location object for backward compatibility
    location: {
      address: address,
      coords: {
        lat: toNumber(data.lat),
        lng: toNumber(data.lng)
      }
    },
    
    // Enhanced fields
    propertyType: trimString(data.propertyType).toLowerCase(),
    address: address,
    city: trimString(data.city),
    state: trimString(data.state),
    zipCode: trimString(data.zipCode),
    
    // Numeric fields with proper conversion
    bedrooms: toInt(data.bedrooms),
    bathrooms: toNumber(data.bathrooms),
    squareFootage: toInt(data.squareFootage),
    rentAmount: toNumber(data.rentAmount, 0), // Required, so default to 0 if invalid
    securityDeposit: toNumber(data.securityDeposit, 0),
    parkingSpaces: toInt(data.parkingSpaces, 0),
    
    // Date fields
    availableDate: formatDate(data.availableDate),
    vacancyDate: formatDate(data.availableDate), // Sync for backward compatibility
    
    // Text fields
    description: trimString(data.description),
    amenities: trimString(data.amenities),
    petPolicy: trimString(data.petPolicy),
    
    // Status field
    status: trimString(data.status, 'available').toLowerCase(),
    
    // Remove undefined fields to avoid schema issues
    ...({}), // This will be cleaned up below
  };
};

const cleanPropertyData = (data) => {
  const cleaned = {};
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      if (typeof data[key] === 'object' && !Array.isArray(data[key]) && !(data[key] instanceof Date)) {
        // Handle nested objects like location
        const nestedCleaned = cleanPropertyData(data[key]);
        if (Object.keys(nestedCleaned).length > 0) {
          cleaned[key] = nestedCleaned;
        }
      } else {
        cleaned[key] = data[key];
      }
    }
  });
  return cleaned;
};


// GET /properties (with query support)
router.get('/', authorize('Owner', 'Agent'), async (req, res) => {
  console.log('🔍 GET /properties route hit');
  console.log('🔍 Query params:', req.query);
  console.log('🔍 User:', req.user);
  
  try {
    // Build filter object
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.propertyType) {
      filter.propertyType = req.query.propertyType;
    }
    if (req.query.city) {
      filter.city = new RegExp(req.query.city, 'i');
    }
    if (req.query.minRent) {
      filter.rentAmount = { $gte: parseFloat(req.query.minRent) };
    }
    if (req.query.maxRent) {
      filter.rentAmount = { ...filter.rentAmount, $lte: parseFloat(req.query.maxRent) };
    }
    
    // Handle pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log('🔍 MongoDB filter:', filter);
    
    const properties = await Property.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const totalCount = await Property.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    console.log('✅ Properties found:', properties.length);
    
    res.json({
      success: true,
      data: properties,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalCount: totalCount,
        limit: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('❌ Error fetching properties:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /properties/:id
router.get('/:id', authorize('Owner', 'Agent'), async (req, res) => {
  console.log('🔍 GET /properties/:id route hit');
  console.log('🔍 ID:', req.params.id);
  console.log('🔍 User:', req.user);
  
  try {
    const prop = await Property.findById(req.params.id);
    if (!prop) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    res.json({ success: true, data: prop });
  } catch (error) {
    console.error('❌ Error fetching property:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /properties (Individual property creation)
router.post('/', authorize('Owner', 'Agent'), async (req, res) => {
  console.log('🔍 POST /properties route hit');
  console.log('🔍 Body:', req.body);
  console.log('🔍 User:', req.user);
  
  try {
    // Format the property data
    const propertyData = formatPropertyData(req.body);
    
    const prop = new Property(propertyData);
    await prop.save();
    
    console.log('✅ Property created:', prop._id);
    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: prop
    });
  } catch (error) {
    console.error('❌ Error creating property:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /properties/add (Alternative route for individual property - for frontend compatibility)
router.post('/add', authorize('Owner', 'Agent'), async (req, res) => {
  console.log('🔍 POST /properties/add route hit');
  console.log('🔍 Body:', req.body);
  console.log('🔍 User:', req.user);
  
  try {
    // Format the property data
    const propertyData = formatPropertyData(req.body);
    
    const prop = new Property(propertyData);
    await prop.save();
    
    console.log('✅ Property added:', prop._id);
    res.status(201).json({
      success: true,
      message: 'Property added successfully',
      data: prop
    });
  } catch (error) {
    console.error('❌ Error adding property:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add property',
      error: error.message 
    });
  }
});

// POST /properties/bulk-upload (New bulk upload route)
router.post('/bulk-upload', authorize('Owner', 'Agent'), upload.single('csvFile'), async (req, res) => {
  console.log('📥 POST /properties/bulk-upload route hit');
  console.log('📁 Uploaded file:', req.file);

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No CSV file uploaded'
      });
    }

    const filePath = req.file.path;
    const properties = [];
    const errors = [];
    let rowIndex = 0;
    let headersParsed = false;

    console.log('📂 Reading CSV file from:', filePath);

    // Parse CSV file with corrected configuration
    const parsePromise = new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser({
          skipEmptyLines: true,
          trim: true,
          // Remove the 'headers: true' option as it's not valid for csv-parser
        }))
        .on('headers', (headers) => {
          console.log('📋 CSV Headers detected:', headers);
          headersParsed = true;
        })
        .on('data', (row) => {
          rowIndex++;
          console.log(`🔍 Raw CSV row ${rowIndex}:`, row);
          console.log(`🔍 Row keys:`, Object.keys(row));
          console.log(`🔍 Row values:`, Object.values(row));
          
          // Check if row has data
          const hasData = Object.values(row).some(value => value && String(value).trim() !== '');
          if (!hasData) {
            console.log(`⚠️ Row ${rowIndex} appears to be empty, skipping...`);
            return;
          }
          
          // Validate row data
          const rowErrors = validateCSVRow(row, rowIndex);
          if (rowErrors.length > 0) {
            console.log(`❌ Row ${rowIndex} validation errors:`, rowErrors);
            errors.push(...rowErrors);
          } else {
            // Format and clean property data
            const rawPropertyData = formatPropertyData(row);
            const propertyData = cleanPropertyData(rawPropertyData);
            console.log(`✅ Row ${rowIndex} formatted data:`, propertyData);
            properties.push(propertyData);
          }
        })
        .on('end', () => {
          console.log(`📊 CSV parsing completed. Total rows processed: ${rowIndex}`);
          resolve();
        })
        .on('error', (error) => {
          console.error('❌ CSV parsing error:', error);
          reject(error);
        });
    });

    await parsePromise;

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    console.log(`📊 Validation complete. Valid properties: ${properties.length}, Errors: ${errors.length}`);

    // Debug: If no valid properties found, let's see what we got
    if (properties.length === 0 && errors.length > 0) {
      console.log('🔍 Debug: First few errors:', errors.slice(0, 10));
      
      // Try to read the file again to debug
      try {
        const fileContent = fs.readFileSync(req.file.path, 'utf8');
        console.log('📄 First 500 characters of file:', fileContent.substring(0, 500));
      } catch (readError) {
        console.log('❌ Could not re-read file for debugging:', readError.message);
      }
    }

    // If there are validation errors, return them
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'CSV validation failed',
        errors: errors,
        validRowsCount: properties.length,
        totalRowsProcessed: rowIndex,
        debug: {
          headersParsed,
          firstFewErrors: errors.slice(0, 5)
        }
      });
    }

    // If no properties to insert
    if (properties.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid properties found in CSV file',
        totalRowsProcessed: rowIndex,
        debug: {
          headersParsed,
          fileExists: fs.existsSync(filePath)
        }
      });
    }

    // Insert properties one by one for better error tracking
    const insertedProperties = [];
    const insertErrors = [];

    for (let i = 0; i < properties.length; i++) {
      try {
        console.log(`📦 Inserting property ${i + 1}:`, properties[i]);
        
        const property = new Property(properties[i]);
        const saved = await property.save();
        insertedProperties.push(saved);
        console.log(`✅ Property ${i + 1} inserted successfully:`, saved._id);
      } catch (error) {
        console.error(`❌ Property ${i + 1} insertion failed:`, error);
        
        insertErrors.push({
          index: i + 1,
          propertyName: properties[i].propertyName || properties[i].name,
          error: error.message,
          validationErrors: error.errors,
          data: properties[i]
        });
      }
    }

    // Prepare response
    const response = {
      success: insertErrors.length === 0,
      message: insertErrors.length === 0 
        ? `✅ Bulk upload completed successfully - ${insertedProperties.length} properties added`
        : `Bulk upload completed with errors - ${insertedProperties.length} properties added, ${insertErrors.length} failed`,
      summary: {
        totalRowsProcessed: rowIndex,
        validRowsFound: properties.length,
        propertiesInserted: insertedProperties.length,
        insertionErrors: insertErrors.length
      }
    };

    if (insertErrors.length > 0) {
      response.insertionErrors = insertErrors;
    }

    console.log(`📊 Final result:`, response.summary);
    res.status(insertErrors.length > 0 ? 207 : 201).json(response);

  } catch (error) {
    // Clean up uploaded file in case of error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error('❌ Error processing bulk upload:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process bulk upload',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// POST /properties/seed-csv (Keep existing route for backward compatibility)
router.post('/seed-csv', authorize('Owner', 'Agent'), upload.single('csvFile'), async (req, res) => {
  console.log('📥 POST /properties/seed-csv route hit');
  console.log('📁 Uploaded file:', req.file);

  const filePath = req.file.path;
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      // Support both old and new CSV formats
      const propertyData = formatPropertyData(row);
      results.push(propertyData);
    })
    .on('end', async () => {
      try {
        const inserted = await Property.insertMany(results);
        console.log(`✅ Inserted ${inserted.length} properties`);
        fs.unlinkSync(filePath);
        res.json({ message: `✅ Seeded ${inserted.length} properties.` });
      } catch (error) {
        console.error('❌ Failed to insert CSV data:', error);
        res.status(500).json({ error: 'Server error during CSV insert' });
      }
    })
    .on('error', (error) => {
      console.error('❌ CSV Parse error:', error);
      res.status(500).json({ error: 'Failed to parse CSV file' });
    });
});

// PUT /properties/:id
router.put('/:id', authorize('Owner', 'Agent'), async (req, res) => {
  console.log('🔍 PUT /properties/:id route hit');
  console.log('🔍 ID:', req.params.id);
  console.log('🔍 Body:', req.body);
  console.log('🔍 User:', req.user);
  
  try {
    // Format the property data
    const propertyData = formatPropertyData(req.body);
    propertyData.updatedAt = new Date();
    
    const updated = await Property.findByIdAndUpdate(req.params.id, propertyData, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    
    console.log('✅ Property updated:', updated._id);
    res.json({
      success: true,
      message: 'Property updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('❌ Error updating property:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// DELETE /properties/:id
router.delete('/:id', authorize('Owner', 'Agent'), async (req, res) => {
  console.log('🔍 DELETE /properties/:id route hit');
  console.log('🔍 ID:', req.params.id);
  console.log('🔍 User:', req.user);
  
  try {
    const removed = await Property.findByIdAndDelete(req.params.id);
    if (!removed) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    
    console.log('✅ Property deleted:', req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error('❌ Error deleting property:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /properties/stats/summary (Property statistics)
router.get('/stats/summary', authorize('Owner', 'Agent'), async (req, res) => {
  console.log('📊 GET /properties/stats/summary route hit');
  
  try {
    const stats = await Property.aggregate([
      {
        $group: {
          _id: null,
          totalProperties: { $sum: 1 },
          availableProperties: {
            $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] }
          },
          occupiedProperties: {
            $sum: { $cond: [{ $eq: ['$status', 'occupied'] }, 1, 0] }
          },
          maintenanceProperties: {
            $sum: { $cond: [{ $eq: ['$status', 'maintenance'] }, 1, 0] }
          },
          averageRent: { $avg: '$rentAmount' },
          totalRentValue: { $sum: '$rentAmount' }
        }
      }
    ]);

    // Get property type distribution
    const propertyTypes = await Property.aggregate([
      {
        $group: {
          _id: '$propertyType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        summary: stats[0] || {
          totalProperties: 0,
          availableProperties: 0,
          occupiedProperties: 0,
          maintenanceProperties: 0,
          averageRent: 0,
          totalRentValue: 0
        },
        propertyTypes: propertyTypes
      }
    });

  } catch (error) {
    console.error('❌ Error fetching property stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch property statistics',
      error: error.message
    });
  }
});

export default router;