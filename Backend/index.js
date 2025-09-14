require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const createRateLimiter = require('./src/middleware/rateLimiter');
const setupLogger = require('./src/middleware/logger');
const { sequelize } = require('./src/models');
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
setupLogger(app);
app.use(createRateLimiter());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('DB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
})();