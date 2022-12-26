const routerUser = require('express').Router();
const {
  getUsers, getUserById, updateUserProfile, updateUserAvatar, getUserInfo,
} = require('../controllers/users');
const { validateGetUserById, validateUpdateProfile, validateUpdateAvatar } = require('../middlewares/validation');

routerUser.get('/', getUsers);

routerUser.get('/:_id', validateGetUserById, getUserById);

routerUser.patch('/me', validateUpdateProfile, updateUserProfile);

routerUser.patch('/me/avatar', validateUpdateAvatar, updateUserAvatar);

routerUser.get('/me', getUserInfo);

module.exports = routerUser;
