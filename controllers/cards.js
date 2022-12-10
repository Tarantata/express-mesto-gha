const Card = require("../models/card");
// const URL_PATTERN = /^https?:\/\/(?:w{3}\.)?(?:[a-z0-9]+[a-z0-9-]*\.)+[a-z]{2,}(?::[0-9]+)?(?:\/\S*)?#?$/i;

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(200).json(cards);
  } catch (err) {

    return res.status(500).json({message: 'Произошла ошибка'});
  }
  // return res.status(200).json({message: 'Test'})
};

const createCard = async (req, res) => {
  try {
    const owner = req.user._id;
    const {name, link} = req.body;
    const card = await Card.create({name, link, owner});
    return res.status(201).json(card);
  } catch (err) {

    return res.status(400).json({ message: 'Введены некорректные данные при создании карточки' });
  }
//   return res.status(200).json({message: 'Test to post'})
};

const deleteCardById = async (req, res) => {
  try {
    const {cardId} = req.params;
    const card = await Card.findByIdAndRemove(cardId);
    if (card !== card) {
      return res.status(404).json({message: 'Карточка с указанным _id не найдена'});
    }
    return res.status(200).json({message: 'Карточка удалена'});

  } catch (err) {
    console.error(err);
    return res.status(500).json({message: 'Произошла ошибка'});
  }
  // return res.status(200).json({message: 'Test deleteCard by ID'})
};

const likeCard = async (req, res) => {
  try {
    const {cardId} = req.params;
    const card = await Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } });
    if (card !== card) {
      return res.status(400).json({message: 'Введены некорректные данные для постановки лайка'});
    }
    if (card === null) {
      return res.status(404).json({message: 'Передан несуществующий _id карточки'});
    }
    return res.status(201).json(card);
  } catch (err) {
    console.error(err);
    return res.status(500).json({message: 'Произошла ошибка'});
  }
// return res.status(200).json({message: 'Test CardLike'})
};

const dislikeCard = async (req, res) => {
  try {
    const {cardId} = req.params;
    const card = await Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } });
    if (card !== card) {
      return res.status(400).json({message: 'Введены некорректные данные для снятия лайка'});
    }
    if (card === null) {
      return res.status(404).json({message: 'Передан несуществующий _id карточки'});
    }
    return res.status(201).json(card);
  } catch (err) {
    console.error(err);
    return res.status(500).json({message: 'Произошла ошибка'});
  }
// return res.status(200).json({message: 'Test CardDisLike'})
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard
}
