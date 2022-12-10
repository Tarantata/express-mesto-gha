// const http = require('http');
const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');

const PORT = 3000;
const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '638f652d2e289e79f06d48db', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use('/users', routerUser);
app.use('/cards', routerCard);

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Страница не найдена' });
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}, () => {
  console.log('Connected to MongoDB!');
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT} / Приложение запущено, используется порт ${PORT}.`);
  }); // приёмка сообщений с 3000 порта
});
