const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400
  }
});

module.exports = mongoose.model('Token', tokenSchema);
