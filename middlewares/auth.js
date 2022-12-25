const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unathorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return new UnauthorizedError('Необходима авторизация');
    // return res.status(401).json({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(authorization, 'some-secret-key');
  } catch (err) {
    return new UnauthorizedError('Необходима авторизация');
    // return res.status(401).json({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  return next();
};
