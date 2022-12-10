const routerUser = require('express').Router();
const {
  getUsers, createUser, getUserById, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

routerUser.get('/', getUsers);

routerUser.post('/', createUser);

routerUser.get('/:_id', getUserById);

routerUser.patch('/me', updateUserProfile);

routerUser.patch('/me/avatar', updateUserAvatar);

module.exports = routerUser;
