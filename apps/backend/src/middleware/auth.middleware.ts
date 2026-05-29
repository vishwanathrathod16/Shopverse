import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';

// We extend the default Express Request to include a 'user' property
export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // Read the JWT from the httpOnly cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      // Find the user by ID from the token's payload
      // .select('-passwordHash') prevents the password from being sent
      req.user = await User.findById(decoded.userId).select('-passwordHash');

      if (!req.user) {
         return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // User is found, proceed to the next function
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};