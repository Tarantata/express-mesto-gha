const routerCard = require('express').Router();
const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

routerCard.get('/', getCards);

routerCard.post('/', createCard);

routerCard.delete('/:cardId', deleteCardById);

routerCard.put('/likes', likeCard);

routerCard.delete('/likes', dislikeCard);

module.exports = routerCard;
