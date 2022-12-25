const routerUser = require('express').Router();
const {
  getUsers, getUserById, updateUserProfile, updateUserAvatar, getUserInfo,
} = require('../controllers/users');

routerUser.get('/', getUsers);

// routerUser.post('/', createUser);

routerUser.get('/:_id', getUserById);

routerUser.patch('/me', updateUserProfile);

routerUser.patch('/me/avatar', updateUserAvatar);

routerUser.get('/users/me', getUserInfo);

module.exports = routerUser;
