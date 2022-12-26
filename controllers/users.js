const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');
const UnauthorizedError = require('../errors/unathorizedError');

const SALT_ROUNDS = 10;

const URL_PATTERN = /^https?:\/\/(?:w{3}\.)?(?:[a-z0-9]+[a-z0-9-]*\.)+[a-z]{2,}(?::[0-9]+)?(?:\/\S*)?#?$/i;

const createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    await User.create({
      name, about, avatar, email, password: hash,
    });

    return res
      .status(201).json({name, about, avatar, email});
  } catch (err) {
    if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
      return next(new ConflictError('Данный email уже используется'));
    }
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Введены некорректные данные при создании пользователя'));
      // return res.status(400).json({ message: 'Введены некорректные
      // данные при создании пользователя' });
    }
    return next(err);

    // return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    const token = await jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
    return res.status(200).json({ token });
  } catch (err) {
    if (err.statusCode === 401) {
      return next(new UnauthorizedError('Передан некорректный email или пароль'));
      // return res.status(401).json({ message: 'Передан некорректный email или пароль' });
    }
    return next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    return res.status(200).json(users);
  } catch (err) {
    return next(err);
    // return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    return res.status(200).json(user);
  } catch (err) {
    return next(err);
    // return res.status(400).json({ message: 'Введены некорректные
    // данные при создании пользователя' });
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
      // return res.status(404).json({ message: 'Пользователь не найден' });
    }
    return res.status(200).json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Введены некорректные данные'));
    // return res.status(400).json({ message: 'Введены некорректные данные' });
    }
    return next(err);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(owner, { name, about }, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
      // return res.status(404).json({ message: 'Пользователь не найден' });
    }
    return res.status(200).json(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные'));
      // return res.status(400).json({ message: 'Введены некорректные
      // данные при создании пользователя' });
    }
    return next(err);

    // return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

const updateUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const owner = req.user._id;
    const user = await User.findByIdAndUpdate(owner, { avatar }, {
      new: true,
      runValidators: true,
    });
    if (!URL_PATTERN.test(avatar)) {
      return next(new BadRequestError('Переданы некорректные данные'));
      // return res.status(400).json({ message: 'Введены некорректные
      // данные при создании пользователя' });
    }
    if (user === null) {
      return next(new NotFoundError('Пользователь с указанным _id не найден'));
      // return res.status(404).json({ message: 'Пользователь с указанным _id не найден' });
    }
    return res.status(200).json(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные'));
      // return res.status(400).json({ message: 'Введены некорректные
      // данные при создании пользователя' });
    }
    return next(err);

    // return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  login,
  getUserInfo,
};
