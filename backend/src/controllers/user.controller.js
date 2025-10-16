import { User } from '../models/User.js';

export async function getAllUsers(req, res) {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
}

export async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.updateRole(id, role);
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
}