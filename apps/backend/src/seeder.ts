import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db';
import Product from './models/product.model';
import User from './models/user.model'; // We'll clear users too

// Sample data
const sampleProducts = [
  {
    name: 'Airpods Wireless Bluetooth Headphones',
    image: '/images/airpods.jpg',
    description:
      'Bluetooth technology lets you connect it with compatible devices wirelessly',
    brand: 'Apple',
    category: 'Electronics',
    price: 89.99,
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'iPhone 13 Pro 256GB',
    image: '/images/iphone13.jpg',
    description:
      'Introducing the iPhone 13 Pro. A transformative triple-camera system.',
    brand: 'Apple',
    category: 'Electronics',
    price: 999.99,
    countInStock: 7,
    rating: 4.0,
    numReviews: 8,
  },
  {
    name: 'Cannon EOS 80D DSLR Camera',
    image: '/images/camera.jpg',
    description:
      'Characterized by versatile imaging specs, the Canon EOS 80D',
    brand: 'Cannon',
    category: 'Electronics',
    price: 929.99,
    countInStock: 5,
    rating: 3,
    numReviews: 12,
  },
];

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

// Function to import data
const importData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany(); // Be careful, this wipes all users!

    // Insert new data
    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

// Function to destroy data
const destroyData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

// Read command line arguments
if (process.argv[2] === '-d') {
  destroyData(); // 'node src/seeder.ts -d'
} else {
  importData(); // 'node src/seeder.ts'
}