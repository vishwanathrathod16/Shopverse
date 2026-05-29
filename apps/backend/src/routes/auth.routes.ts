import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  logoutUser, // Import this
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser); // Add this route
router.get('/me',protect, getMe);

export default router;