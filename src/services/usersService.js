const { getDB } = require('../config/mongodb');
const { ObjectId } = require('mongodb');

const getAllUsers = async () => {
  const db = getDB();
  const users = await db.collection('users').find({}).toArray();
  return users;
};

const getUserById = async (id) => {
  const db = getDB();
  const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

const createUser = async (name, role) => {
  const db = getDB();
  
  if (!name) {
    throw new Error('Name required');
  }

  const newUser = {
    name,
    role: role || 'user',
    createdAt: new Date()
  };

  const result = await db.collection('users').insertOne(newUser);
  return { ...newUser, _id: result.insertedId };
};

const updateUser = async (id, name, role) => {
  const db = getDB();
  
  const updateData = {};
  if (name) updateData.name = name;
  if (role) updateData.role = role;

  const result = await db.collection('users').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: 'after' }
  );

  if (!result.value) {
    throw new Error('User not found');
  }

  return result.value;
};

const deleteUser = async (id) => {
  const db = getDB();
  const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });
  
  if (result.deletedCount === 0) {
    throw new Error('User not found');
  }

  return { message: 'User deleted successfully' };
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
