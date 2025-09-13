import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../lib/prisma';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Verify Google ID token and create/update user
export const verifyGoogleToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }
  
  try {
    // Verify token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    
    if (!payload) {
      return res.status(400).json({ error: 'Invalid token' });
    }
    
    const { email, name, picture, sub: googleId } = payload;
    
    if (!email) {
      return res.status(400).json({ error: 'Email not found in token' });
    }
    
    // Find or create user
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { googleId }
        ]
      }
    });
    
    if (user) {
      // Update existing user if needed
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId, image: picture }
        });
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          name: name || 'Google User',
          email,
          googleId,
          image: picture,
          role: 'user'
        }
      });
    }
    
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
    
    // Return user and access token
    res.status(200).json({
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image
      }
    });
  } catch (error) {
    console.error('Google token verification error:', error);
    res.status(401).json({ error: 'Failed to verify Google token' });
  }
};
