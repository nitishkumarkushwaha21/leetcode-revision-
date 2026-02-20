const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');
require('dotenv').config();

const fileRoutes = require('./src/routes/fileRoutes');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/files', fileRoutes);

// Sync Database and Start Server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('PostgreSQL (algonote) synced for File Service');
    app.listen(PORT, () => {
        console.log(`File Service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });
