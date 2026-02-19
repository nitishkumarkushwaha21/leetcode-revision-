import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import allRoutes from './routes/index.js';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Body parser for JSON requests

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dsa-tracker';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api', allRoutes);

// Simple route for testing
app.get('/', (req, res) => {
  res.send('DSA Tracker API is running...');
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
