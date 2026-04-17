const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const { User } = require('./models');
const bcrypt = require('bcryptjs');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const storeRoutes = require('./routes/stores');
const ratingRoutes = require('./routes/ratings');

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Store Rating API is running successfully");
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

const seedAdmin = async () => {
  const adminExists = await User.findOne({ where: { role: 'admin' } });
  if (!adminExists) {
    await User.create({
      name: 'System Administrator User',
      email: 'admin@storerating.com',
      password: 'Admin@123',
      address: '123 Admin Street, System City',
      role: 'admin'
    });
    console.log('✅ Admin user created: admin@storerating.com / Admin@123');
  }
};

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(async () => {
    console.log('✅ Database synced');
    await seedAdmin();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ DB connection error:', err));
