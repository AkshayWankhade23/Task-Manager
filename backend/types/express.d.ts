import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface User extends JwtPayload {
      id: string;
      role: 'user' | 'admin';
      email?: string;
      iat?: number;
      exp?: number;
    }

    interface Request {
      user: User;
    }
  }
}
