import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routers
import productRouter from './routes/product-routes.js';

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 8085;
const IP = process.env.IP || '0.0.0.0';
const app = express();

// Initialize middleware
app.use(cors());
app.use(express.json());


// log all requests
app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.url);
  next();
});

// Routers
app.use(express.static('public'));
app.use('/products', productRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on ${IP}:${PORT}`);
    console.log('Press CTRL + C to stop the server');
});