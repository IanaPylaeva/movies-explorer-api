require('dotenv').config();

const express = require('express');

const app = express();

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const helmet = require('helmet');

const { PORT = 3001 } = process.env;

const { errors } = require('celebrate');

const cors = require('cors');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const routes = require('./routes');

const allowedCors = {
  origin: [
    'http://localhost:3001',
    'http://movie.diplom.ianapylaeva.nomoredomains.xyz',
    'https://movie.diplom.ianapylaeva.nomoredomains.xyz',
  ],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

mongoose.connect('mongodb://localhost:27017/moviesdb');

app.use(helmet());

app.use(cors(allowedCors));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', routes);

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());

app.use((error, req, res, next) => {
  const { statusCode = 500, message } = error;
  res.status(statusCode).send({ message: statusCode === 500 ? 'Ошибка сервера' : message });
  next();
});

// Слушаем 3000 порт
app.listen(PORT);
