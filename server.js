import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { requestLogger } from './utils/logger.js';
import v1Router from './routes/api/v1/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();
const SERVER_PORT = process.env.SERVER_PORT || 9090;
const SERVER_HOST = process.env.SERVER_HOST || '127.0.0.1';
const FRONT_END_URL = process.env.FRONT_END_URL || 'http://127.0.0.1:5173';
const SERVER_ENV = process.env.SERVER_ENV || 'dev';
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
process.env.ROOT_DIR = path.resolve(__dirname, '.');

const rateLimitWindowMs = 15 * 60 * 1000;
const rateLimitLimit = 100;
const rateLimitMessage = 'Too many requests, please try again later.';

const helmetOptionsProd = {
  contentSecurityPolicy: {
      directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", FRONT_END_URL]
      }
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-site" },
  dnsPrefetchControl: true,
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true
}

const helmetOptionsDev = {
  contentSecurityPolicy: {
      directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", FRONT_END_URL]
      }
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  dnsPrefetchControl: true,
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true
}

const corsOptionsDev = {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
}

const corsOptionsProd = {
  origin: FRONT_END_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
}

// Rate limiting middleware
// app.use(rateLimit({
//   windowMs: rateLimitWindowMs,
//   limit: rateLimitLimit,
//   message: rateLimitMessage,
//   skip: (req, res) => req.method === 'OPTIONS'
// }));

// Helmet middleware
app.use(helmet(SERVER_ENV === 'dev' ? helmetOptionsDev : helmetOptionsProd));

// CORS middleware
app.use(cors(SERVER_ENV === 'dev' ? corsOptionsDev : corsOptionsProd));

// Parse JSON bodies
app.use(express.json({ limit: '10kb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Security headers middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    next();
});  

// Log all requests
app.use((req, res, next) => {
  requestLogger(req);
  next();
});

// Serve static files
app.use(express.static('public', {
  maxAge: '1d',
  etag: true
}));

// API routes
app.use('/api/v1', v1Router);

// Error handling middleware
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