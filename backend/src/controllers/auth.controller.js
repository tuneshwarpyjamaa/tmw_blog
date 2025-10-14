import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await User.comparePassword(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.SECRET_KEY, {
      expiresIn: '7d'
    });

    return res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Login failed' });
  }
}

export async function register(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const existingUser = await User.findByEmail(email).catch(() => null);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const user = await User.create({ email, password, role: 'contributor' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.SECRET_KEY, {
      expiresIn: '7d'
    });

    return res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Registration failed' });
  }
}
