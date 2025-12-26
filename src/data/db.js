const { simpleHash } = require('../utils/hash');

let users = [
  { id: 1, name: 'Jacky', role: 'admin' },
  { id: 2, name: 'Tom', role: 'user' }
];

let accounts = [
  { id: 1, username: 'jacky', passwordHash: simpleHash('123456'), email: 'jacky@example.com', userId: 1 },
  { id: 2, username: 'tom', passwordHash: simpleHash('password'), email: 'tom@example.com', userId: 2 }
];

let validTokens = [];

module.exports = {
  users,
  accounts,
  validTokens
};
