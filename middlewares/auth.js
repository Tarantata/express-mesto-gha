// const jwt = require('jsonwebtoken');
// const UnauthorizedError = require('../errors/unathorizedError');
//
// module.exports = (req, res, next) => {
//   const { authorization } = req.headers;
//
//   if (!authorization || !authorization.startsWith('Bearer ')) {
//     return new UnauthorizedError('Необходима авторизация');
//   }
//   const token = authorization.replace('Bearer ', '');
//   let payload;
//
//   try {
//     payload = jwt.verify(token, 'some-secret-key');
//   } catch (err) {
//     return new UnauthorizedError('Необходима авторизация');
//     // return res.status(401).json({ message: 'Необходима авторизация' });
//   }
//
//   req.user = payload;
//   return next();
// };

require('dotenv').config();
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unathorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token == null) {
    return next(new UnauthorizedError('Необходима авторизация'));
  } let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  } req.user = payload;
  return next();
};
