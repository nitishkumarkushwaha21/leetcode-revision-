const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');
require('dotenv').config();

const problemRoutes = require('./src/routes/problemRoutes');

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/problems', problemRoutes);

// Sync Database and Start Server
sequelize.sync({ alter: true }) // alter: true updates table schema if changed
  .then(() => {
    console.log('PostgreSQL (algonote) synced');
    app.listen(PORT, () => {
        console.log(`Problem Service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });
