// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const User = require('./models/User');

const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// app.get('/', (req, res) => {
//   res.send('CRM API Running');
// });


// app.get('/create-user', async (req, res) => {
//   try {
//     const newUser = new User({
//       name: "Test User",
//       email: "testuser@example.com",
//       password: "password123",
//       role: "telecaller"
//     });

//     await newUser.save();
//     res.send("Test user created!");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("❌ Error creating user");
//   }
// });

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
