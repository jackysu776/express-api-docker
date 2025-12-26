const { getDB } = require('../config/mongodb');
const { ObjectId } = require('mongodb');

const getAllUsers = async (req, res) => {
  try {
    const db = getDB();
    const users = await db.collection('users').find({}).toArray();
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const db = getDB();
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user by id error:', error);
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const db = getDB();
    const { name } = req.params;
    const { role } = req.query;
    
    if (!name) {
      return res.status(400).json({ message: 'Name required' });
    }

    const newUser = {
      name,
      role: role || 'user',
      createdAt: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);
    res.status(201).json({ ...newUser, _id: result.insertedId });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const db = getDB();
    const { id, name } = req.params;
    const { role } = req.query;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;

    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.value);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
