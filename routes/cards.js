const routerCard = require('express').Router();
const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validateCreateCard, validateCardId } = require('../middlewares/validation');

routerCard.get('/cards', getCards);
//
routerCard.post('/cards', validateCreateCard, createCard);

routerCard.delete('/cards/:cardId', validateCardId, deleteCardById);

routerCard.put('/cards/:cardId/likes', validateCardId, likeCard);

routerCard.delete('/cards/:cardId/likes', validateCardId, dislikeCard);

module.exports = routerCard;
