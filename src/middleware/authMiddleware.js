const { getDB } = require('../config/mongodb');

const verifyToken = async (req, res, next) => {
  try {
    const db = getDB();
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const validToken = await db.collection('tokens').findOne({ token });
    if (!validToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { verifyToken };
