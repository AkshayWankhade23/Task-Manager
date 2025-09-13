// authRoutes.ts
import express from 'express';
import passport from '../config/passport';
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  handleGoogleCallback,
} from '../controllers/authController';
import { verifyGoogleToken } from '../controllers/googleAuthController';
import {
  verifyRefreshToken,
  generateAccessToken,
} from '../utils/jwt';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticate, getMe); 
router.post('/logout', logoutUser);
router.get('/verify-token', authenticate, (req, res) => res.status(200).json({ valid: true }));

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  handleGoogleCallback
);

// Google token verification (for NextAuth)
router.post('/google-token', verifyGoogleToken);

// refresh token route
router.post('/refresh', async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: 'No refresh token' });

  try {
    const payload: any = verifyRefreshToken(token);
    const newAccessToken = generateAccessToken(payload.userId, payload.role);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});

export default router;
