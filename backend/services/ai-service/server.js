const express = require('express');
const cors = require('cors');
require('dotenv').config();

const aiRoutes = require('./src/routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 5004;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ai', aiRoutes);

app.listen(PORT, () => {
    console.log(`AI Service running on port ${PORT}`);
});
