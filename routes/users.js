const routerUser = require('express').Router();
const {
  getUsers, getUserById, updateUserProfile, updateUserAvatar, getUserInfo, createUser,
} = require('../controllers/users');
const {validateGetUserById, validateUpdateProfile, validateUpdateAvatar} = require("../middlewares/validation");

routerUser.get('/', getUsers);

routerUser.post('/', createUser);

routerUser.get('/users/:_id', validateGetUserById, getUserById);

routerUser.patch('/users/me', validateUpdateProfile, updateUserProfile);

routerUser.patch('/users/me/avatar', validateUpdateAvatar, updateUserAvatar);

routerUser.get('/users/me', getUserInfo);

module.exports = routerUser;
