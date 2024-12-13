// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const fs = require('fs');
const path = require('path');

dotenv.config();
const app = express();

// Define the path for the uploads directory
const uploadsDir = path.join(__dirname, 'uploads');

// Check if uploads directory exists, if not, create it
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware to serve static files from the "uploads" directory
app.use('/uploads', express.static(uploadsDir));

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Connect to MongoDB using environment variable
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Define the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
