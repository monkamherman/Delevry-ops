import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'client' | 'livreur' | 'admin';
}

const users: User[] = [];

export async function registerUser(req: Request, res: Response) {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, mot de passe et rôle requis' });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'Utilisateur déjà existant' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: (users.length + 1).toString(),
    email,
    passwordHash,
    role
  };
  users.push(newUser);

  res.status(201).json({ message: 'Utilisateur créé avec succès' });
}

export async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Utilisateur non trouvé' });
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    return res.status(401).json({ message: 'Mot de passe incorrect' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
}

export function getProfile(req: Request, res: Response) {
  const user = (req as any).user;
  res.json({ id: user.id, email: user.email, role: user.role });
}
