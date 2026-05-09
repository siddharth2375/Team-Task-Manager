const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { env } = require('./src/config/env');
const { connectDatabase } = require('./src/config/db');
const routes = require('./src/routes');
const { notFoundMiddleware } = require('./src/middlewares/notFound.middleware');
const { errorMiddleware } = require('./src/middlewares/error.middleware');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || origin === env.FRONTEND_URL) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many auth requests. Please try again later.' },
});

app.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.use('/api/v1/auth', authLimiter);
app.use('/api/v1', routes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const startServer = async () => {
  await connectDatabase();
  app.listen(env.PORT, () => {
    console.log(`API running on port ${env.PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});

module.exports = app;