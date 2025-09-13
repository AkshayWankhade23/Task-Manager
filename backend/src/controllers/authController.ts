import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { PrismaClient } from '@prisma/client';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/jwt';

// Define the Role enum type based on your Prisma schema
type Role = 'user' | 'admin';

// ✅ Register Controller
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role = 'user' } = req.body;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: role as Role, // 👈 Using our defined Role type
      },
    });

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .status(201)
      .json({
        message: 'User registered successfully',
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (err: any) {
    console.error('❌ Register Error:', err); // 👈 Show actual error
    res.status(500).json({ error: 'Registration failed' });
  }
};

// ✅ Login Controller
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log('Login attempt for email:', email);

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User found:', { id: user.id, email: user.email, hasPassword: !!user.password });

    // Check if user has a password (users created via Google might not have one)
    if (!user.password) {
      console.log('User has no password (likely Google user):', email);
      return res.status(401).json({ error: 'Please use Google sign-in for this account' });
    }

    const match = await bcrypt.compare(password, user.password);
    console.log('Password match result:', match);
    
    if (!match) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({ error: 'Invalid password' });
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    console.log('Login successful for user:', email);

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .status(200)
      .json({
        message: 'Login successful',
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (err: any) {
    console.error('❌ Login Error:', err); // 👈 Add logging
    res.status(500).json({ error: 'Login failed' });
  }
};

// authController.ts - GetMe controller
export const getMe = async (req: Request, res: Response) => {
  const userData = (req as any).user;

  if (!userData) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const user = await prisma.user.findUnique({ where: { id: userData.userId } });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image // Include Google profile image if available
      },
    });
  } catch (err: any) {
    console.error('❌ GetMe Error:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};
  
// Google OAuth callback handler
export const handleGoogleCallback = async (req: Request, res: Response) => {
  // User will be attached to the request by Passport
  const user = req.user as any;
  
  if (!user) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=authentication-failed`);
  }
  
  try {
    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);
    
    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    
    // Redirect to frontend with accessToken
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/google/callback?token=${accessToken}`);
  } catch (error) {
    console.error('Google auth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=server-error`);
  }
};


// ✅ Logout Controller
export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  res.status(200).json({ message: 'Logged out successfully' });
};
