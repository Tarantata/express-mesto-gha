const routerCard = require('express').Router();
const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validateCreateCard, validateCardId } = require('../middlewares/validation');

routerCard.get('/', getCards);
//
routerCard.post('/', validateCreateCard, createCard);

routerCard.delete('/:cardId', validateCardId, deleteCardById);

routerCard.put('/:cardId/likes', validateCardId, likeCard);

routerCard.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = routerCard;
