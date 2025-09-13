import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const generateAccessToken = (userId: string, role: string) =>
  jwt.sign({ id: userId, role }, ACCESS_SECRET, { expiresIn: '15m' });

export const generateRefreshToken = (userId: string, role: string) =>
  jwt.sign({ id: userId, role }, REFRESH_SECRET, { expiresIn: '7d' });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, ACCESS_SECRET);

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, REFRESH_SECRET);
