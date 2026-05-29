import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { Types } from 'mongoose';

const generateToken = (res: Response, userId: Types.ObjectId) => {
  // Create the token, signing it with the user's ID
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: '30d', // Expires in 30 days
  });

  // Set the token as a secure, HTTP-only cookie
  res.cookie('jwt', token, {
    httpOnly: true, // Prevents client-side JS access (XSS)
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: 'strict', // Prevents CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  });
};

export default generateToken;