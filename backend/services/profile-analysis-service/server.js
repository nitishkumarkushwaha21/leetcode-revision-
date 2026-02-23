const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const profileRoutes = require('./src/routes/profileRoutes');

const app = express();
const PORT = process.env.PROFILE_SERVICE_PORT || 5006;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/algonote';

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/profile-analysis', profileRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Profile Analysis Service Running' });
});

// Connect to MongoDB then start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`MongoDB connected: ${MONGO_URI}`);
    app.listen(PORT, () => {
      console.log(`Profile Analysis Service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
