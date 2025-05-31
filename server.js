import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { requestLogger } from './utils/logger.js';
import v1Router from './routes/api/v1/index.js';

// Load environment variables
dotenv.config();
const SERVER_PORT = process.env.SERVER_PORT || 9095;
const SERVER_HOST = process.env.SERVER_HOST || '0.0.0.0';
const FRONT_END_URL = process.env.FRONT_END_URL || 'http://localhost:3000';
const app = express();

// Initialize middleware
app.use(helmet({

}));
app.use(cors({
  origin: FRONT_END_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));


// log all requests
app.use((req, res, next) => {
  requestLogger(req);
  next();
});

// Routers
app.use(express.static('public', {
  maxAge: '1d',
  etag: true
}));
app.use('/api/v1', v1Router);

app.use((err, req, res, next) => {
  logger.error('Error in app:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// Start the server
app.listen(SERVER_PORT, SERVER_HOST, () => {
    console.log(`Server is running on ${SERVER_HOST}:${SERVER_PORT}`);
    console.log('Press CTRL + C to stop the server');
}).on('error', (error) => {
  console.error('Error starting server:', error);
});