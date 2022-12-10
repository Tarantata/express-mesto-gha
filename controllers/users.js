const User = require('../models/user');

const URL_PATTERN = /^https?:\/\/(?:w{3}\.)?(?:[a-z0-9]+[a-z0-9-]*\.)+[a-z]{2,}(?::[0-9]+)?(?:\/\S*)?#?$/i;

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
  // return res.status(200).json({message: 'Test'})
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
// return res.status(200).json({message: 'Test user by ID'})
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    if (!user) {
      return res.status(400).json({ message: 'Введены некорректные данные при создании пользователя' });
    }
    return res.status(201).json(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Введены некорректные данные при создании пользователя' });
    }
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const owner = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(owner, { name, about }, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(400).json({ message: 'Введены некорректные данные при создании пользователя' });
    }
    if (user === null) {
      return res.status(404).json({ message: 'Пользователь с указанным _id не найден' });
    }
    return res.status(201).json(user);
  } catch (err) {
    return res.status(400).json(err);
  }
  // return res.status(200).json({message: 'Test UpdateProfile'})
};

const updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const owner = req.user._id;
    const user = await User.findByIdAndUpdate(owner, { avatar }, {
      new: true,
      runValidators: true,
    });
    if (!URL_PATTERN.test(avatar)) {
      return res.status(400).json({ message: 'Введены некорректные данные при создании пользователя' });
    }
    if (user === null) {
      return res.status(404).json({ message: 'Пользователь с указанным _id не найден' });
    }
    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
  // return res.status(200).json({message: 'Test UpdateAvatar'})
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
};
