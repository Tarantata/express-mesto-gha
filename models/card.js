const mongoose = require('mongoose');
const { formLink } = require('./forms');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => formLink.test(v),
      message: 'Неверно указан формат ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: false,
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    required: false,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
