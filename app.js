import rateLimit from 'express-rate-limit';

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');

const PORT = 3000;
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use(helmet());

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '638f652d2e289e79f06d48db',
  };
  next();
});

app.use('/users', routerUser);
app.use('/cards', routerCard);

app.use('*', (req, res) => res.status(404).json({ message: 'Страница не найдена' }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}, () => {
  console.log('Connected to MongoDB!');
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT} / Приложение запущено, используется порт ${PORT}.`);
  }); // приёмка сообщений с 3000 порта
});
