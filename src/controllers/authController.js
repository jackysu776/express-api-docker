const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const { username, password, email, name, role } = req.body;
    const result = await authService.register(username, password, email, name, role);
    res.status(201).json(result);
  } catch (error) {
    console.error('Register error:', error);
    if (error.message.includes('already exists')) {
      return res.status(409).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const result = await authService.logout(token);
    res.json(result);
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
};

module.exports = { register, login, logout };
