const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const NotFoundError = require('../errors/not-found-error'); // код 404
const EmailExistsError = require('../errors/email-exists-error'); // код 409
const AuthorizationError = require('../errors/authorization-error'); // код 401
const ValidationError = require('../errors/validation-error'); // код 400

/* Получить о пользователе информацию */
module.exports.getUser = (req, res, next) => {
  const owner = req.user._id;
  User.findById(owner)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      } res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new NotFoundError('Некорректный id пользователя'));
      }
      return next(error);
    });
};

/* Обновить информацию о пользователе */
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then(() => {
      res.status(200).send({ name, email });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при обновлении профиля'));
      }
      return next(error);
    });
};

/* Создать пользователя */
module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash, // записываем хеш в базу
    }))
    .then(() => {
      res.send({
        name,
        email,
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      }
      if (error.code === 11000) {
        return next(new EmailExistsError('Email уже существует'));
      }
      return next(error);
    });
};

/* Получает из запроса почту и пароль и проверяет их */
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password') // в случае аутентификации хеш пароля нужен
    .then((user) => {
      if (!user) {
        throw new AuthorizationError('Неправильные почта или пароль');
      }
      // сравниваем переданный пароль и хеш из базы
      return Promise.all([user, bcrypt.compare(password, user.password)]);
    })
    .then(([user, isPasswordCorrect]) => {
      if (!isPasswordCorrect) {
        throw new AuthorizationError('Неправильная почта или пароль');
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' }, // токен будет просрочен через 7 дней после создания
      );
      return res.send({ token });
    })
    .catch(next);
};
