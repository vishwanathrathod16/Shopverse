import { Request, Response } from 'express';
import User from '../models/user.model';
import generateToken from '../utils/generateToken';
import { AuthRequest } from '../middleware/auth.middleware';

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Create new user (passwordHash is handled by model hook)
    const user = await User.create({
      name,
      email,
      passwordHash: password, // The 'pre-save' hook will hash this
    });

    if (user) {
      // 3. Generate token and set cookie
      generateToken(res, user._id);

      // 4. Send back user data
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });

    // 2. Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // 3. Generate token and set cookie
      generateToken(res, user._id);

      // 4. Send back user data
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response) => {
  // 2. The 'protect' middleware has already run and found the user
  if (req.user) {
    res.status(200).json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
export const logoutUser = (req: Request, res: Response) => {
  // To log out, we just clear the cookie
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0), // Expire the cookie immediately
  });
  res.status(200).json({ message: 'User logged out successfully' });
};