const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(200).json(cards);
  } catch (err) {
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
  // return res.status(200).json({message: 'Test'})
};

const createCard = async (req, res) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner });
    return res.status(201).json(card);
  } catch (err) {
    return res.status(400).json({ message: 'Введены некорректные данные при создании карточки' });
  }
//   return res.status(200).json({message: 'Test to post'})
};

const deleteCardById = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndRemove(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.status(200).json({ message: 'Карточка удалена' });
  } catch (err) {
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
  // return res.status(200).json({message: 'Test deleteCard by ID'})
};

const likeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, {
      new: true,
      runValidators: true,
    });
    if (!card) {
      return res.status(400).json({ message: 'Введены некорректные данные для постановки лайка' });
    }
    return res.status(201).json(card);
  } catch (err) {
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
// return res.status(200).json({message: 'Test CardLike'})
};

const dislikeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true });
    if (!card) {
      return res.status(400).json({ message: 'Введены некорректные данные для снятия лайка' });
    }
    return res.status(201).json(card);
  } catch (err) {
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
// return res.status(200).json({message: 'Test CardDisLike'})
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
