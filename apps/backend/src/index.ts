import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app: Express = express();
const port = process.env.PORT || 5000;

// --- Middlewares ---
// Allow requests from our frontend
app.use(
  cors({
    origin: 'http://localhost:3000', // Your Next.js app URL
    credentials: true,
  })
);
// Parse JSON request bodies
app.use(express.json());
// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));
// Parse cookies
app.use(cookieParser());

// --- API Routes ---
app.get('/api', (req: Request, res: Response) => {
  res.send('ShopVerse API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
// Add other routes here (products, orders, etc.)

// --- Server Startup ---
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});