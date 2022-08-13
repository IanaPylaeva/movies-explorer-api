const mongoose = require('mongoose'); // Зададим схему для пользователя через Mongoose
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // это строка
    required: true, // обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  email: {
    type: String, // это строка
    required: true, // обязательное поле
    unique: true, // уникальность
    validate: validator.isEmail,
  },
  password: {
    type: String, // это строка
    required: true, // обязательное поле
    select: false, // API не возвращает хеш пароля
  },
});

module.exports = mongoose.model('user', userSchema);
