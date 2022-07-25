const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUser,
  updateUser,
} = require('../controllers/users');

router.get('/users/me', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
}), getUser); // возвращает информацию о пользователе (email и имя)

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser); // обновляет информацию о пользователе (email и имя)

module.exports = router;
