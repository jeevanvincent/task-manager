const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// 1. Import BOTH route groups
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes'); // Added this line

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// 2. Mount BOTH route groups so they work side-by-side
app.use('/api/auth', authRoutes); // Added this line for logins/registration
app.use('/api/tasks', taskRoutes); // Keeps your task dashboard operational

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));