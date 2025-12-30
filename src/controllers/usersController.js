const usersService = require('../services/usersService');

const getAllUsers = async (req, res) => {
  try {
    const users = await usersService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await usersService.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    console.error('Get user by id error:', error);
    res.status(404).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, role } = req.body;
    const result = await usersService.createUser(name, role);
    res.status(201).json(result);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role } = req.body;
    const result = await usersService.updateUser(id, name, role);
    res.json(result);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(404).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await usersService.deleteUser(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
