import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

// Variables d'environnement (à configurer)
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

// Simuler une base de données utilisateurs en mémoire
interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'client' | 'livreur' | 'admin';
}

const users: User[] = [];

// Middleware pour vérifier le token JWT
function authenticateToken(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token manquant' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalide' });
    (req as any).user = user;
    next();
  });
}

// Route inscription
app.post('/register', async (req: Request, res: Response) => {
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
});

// Route connexion
app.post('/login', async (req: Request, res: Response) => {
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
});

// Route protégée exemple
app.get('/profile', authenticateToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({ id: user.id, email: user.email, role: user.role });
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
