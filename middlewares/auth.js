const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unathorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    // return res
    //   .status(401)
    //   .send({ message: 'Необходима авторизация' });
    throw new UnauthorizedError('Необходимо пройти авторизацию');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    // return res
    //   .status(401)
    //   .send({ message: 'Необходима авторизация' });
    throw new UnauthorizedError('Необходимо пройти авторизацию');
  }

  req.user = payload;
  return next();
};
