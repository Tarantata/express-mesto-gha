const jwt = require('jsonwebtoken');
// const UnauthorizedError = require('../errors/unathorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    // return new UnauthorizedError('Необходима авторизация');
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    // return new UnauthorizedError('Необходима авторизация');
    // return res.status(401).json({ message: 'Необходима авторизация' });
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  return next();
};
