const Card = require('../models/card');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send(cards);
  } catch (err) {
    return next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner });
    return res.status(201).json(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Введены некорректные данные при создании карточки'));
    }
    return next(err);
  }
};

const deleteCardById = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (card === null) {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    }
    const ownerId = card.owner._id.toString();
    if (ownerId !== req.user._id) {
      throw new ForbiddenError('Вы не можете удалять чужие карточки');
    }
    await card.remove();
    return res.status(200).json({ message: 'Карточка удалена' });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные при удалении карточки.'));
    }
    return next(err);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, {
      new: true,
      runValidators: true,
    });
    if (!card) {
      throw new NotFoundError('Передан несуществующий ID карточки');
    }
    return res.status(200).json(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные при удалении карточки.'));
    }
    return next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, {
      new: true,
      runValidators: true,
    });
    if (!card) {
      throw new NotFoundError('Передан несуществующий ID карточки');
    }
    return res.status(200).json(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные при удалении карточки.'));
    }
    return next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
