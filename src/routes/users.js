const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/usersController');

router.use(verifyToken);

router.get('/', getAllUsers);

router.get('/:id', getUserById);

router.post('/create', createUser);

router.post('/:id/update', updateUser);

router.delete('/:id', deleteUser);

module.exports = router;
