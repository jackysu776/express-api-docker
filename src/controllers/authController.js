const { simpleHash } = require('../utils/hash');
const { getDB } = require('../config/mongodb');
const { ObjectId } = require('mongodb');

const register = async (req, res) => {
  try {
    const db = getDB();
    const { username, password, email, name, role } = req.body;

    if (!username || !password || !email) {
        console.log('Missing fields:', { username, password, email });
        return res.status(400).json({ 
          message: 'Username, password and email required',
          received: { username: !!username, password: !!password, email: !!email }
        });
    }

    if (username.length < 3) {
        return res.status(400).json({ message: 'Username must be at least 3 characters' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUsername = await db.collection('accounts').findOne({ username });
    if (existingUsername) {
        return res.status(409).json({ message: 'Username already exists' });
    }

    const existingEmail = await db.collection('accounts').findOne({ email });
    if (existingEmail) {
        return res.status(409).json({ message: 'Email already exists' });
    }

    const newUser = {
        name: name || username,
        role: role || 'user',
        createdAt: new Date()
    };

    const userResult = await db.collection('users').insertOne(newUser);

    const newAccount = {
        username,
        passwordHash: simpleHash(password),
        email,
        userId: userResult.insertedId,
        createdAt: new Date()
    };

    await db.collection('accounts').insertOne(newAccount);

    res.status(201).json({
        message: 'Registration successful',
        user: newUser
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const db = getDB();
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required' });
    }

    const account = await db.collection('accounts').findOne({ username });
    if (!account) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (account.passwordHash !== simpleHash(password)) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = await db.collection('users').findOne({ _id: new ObjectId(account.userId) });

    const tokenString = `${username}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToken = {
        token: tokenString,
        accountId: account._id,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };

    await db.collection('tokens').insertOne(newToken);

    res.json({
      message: 'Login successful',
      token: tokenString,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: account.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const db = getDB();
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      await db.collection('tokens').deleteOne({ token });
    }
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
};

module.exports = { register, login, logout };
