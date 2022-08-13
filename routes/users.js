const router = require('express').Router();
const { validationGetUser, validationUpdateUser } = require('../middlewares/validation');

const {
  getUser,
  updateUser,
} = require('../controllers/users');

router.get('/users/me', validationGetUser, getUser); // возвращает информацию о пользователе (email и имя)

router.patch('/users/me', validationUpdateUser, updateUser); // обновляет информацию о пользователе (email и имя)

module.exports = router;
