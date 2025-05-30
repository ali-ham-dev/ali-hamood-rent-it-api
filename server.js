import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { requestLogger } from './utils/logger.js';
import v1Router from './routes/api/v1/index.js';

// Import routers
// import productRouter from './routes/product-routes.js';

// Load environment variables
dotenv.config();
const SERVER_PORT = process.env.SERVER_PORT || 9095;
const SERVER_HOST = process.env.SERVER_HOST || '0.0.0.0';
const app = express();

// Initialize middleware
app.use(cors());
app.use(express.json());


// log all requests
app.use((req, res, next) => {
  requestLogger(req);
  next();
});

// Routers
app.use(express.static('public'));
app.use('/api/v1', v1Router);
// app.use('/products', productRouter);
// app.use('/file-extensions', fileExtensionsRouter);

// Start the server
app.listen(SERVER_PORT, SERVER_HOST, () => {
    console.log(`Server is running on ${SERVER_HOST}:${SERVER_PORT}`);
    console.log('Press CTRL + C to stop the server');
}).on('error', (error) => {
  console.error('Error starting server:', error);
});