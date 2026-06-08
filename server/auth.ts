import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';

export interface AuthPayload {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'vendedor';
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export function signToken(user: AuthPayload) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '8h' });
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePasswords(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ') ? authorization.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}

export function authorizeAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Somente administradores podem acessar.' });
  }
  return next();
}

export function authorizeVendedor(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Acesso negado.' });
  }
  return next();
}
