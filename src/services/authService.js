const { simpleHash } = require('../utils/hash');
const { getDB } = require('../config/mongodb');
const { ObjectId } = require('mongodb');

const register = async (username, password, email, name, role) => {
  const db = getDB();

  if (!username || !password || !email) {
    throw new Error('Username, password and email required');
  }

  if (username.length < 3) {
    throw new Error('Username must be at least 3 characters');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const existingUsername = await db.collection('accounts').findOne({ username });
  if (existingUsername) {
    throw new Error('Username already exists');
  }

  const existingEmail = await db.collection('accounts').findOne({ email });
  if (existingEmail) {
    throw new Error('Email already exists');
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

  return {
    message: 'Registration successful',
    user: newUser
  };
};

const login = async (username, password) => {
  const db = getDB();

  if (!username || !password) {
    throw new Error('Username and password required');
  }

  const account = await db.collection('accounts').findOne({ username });
  if (!account) {
    throw new Error('Invalid username or password');
  }

  if (account.passwordHash !== simpleHash(password)) {
    throw new Error('Invalid username or password');
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

  return {
    message: 'Login successful',
    token: tokenString,
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
      email: account.email
    }
  };
};

const logout = async (token) => {
  const db = getDB();
  if (token) {
    await db.collection('tokens').deleteOne({ token });
  }
  return { message: 'Logout successful' };
};

module.exports = {
  register,
  login,
  logout
};
