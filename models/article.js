const mongoose = require('mongoose');
const validation = require('validator');

const articleShema = new mongoose.Schema({
  keyword: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  title: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  text: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  date: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  source: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  link: {
    type: mongoose.Schema.Types.String,
    required: true,
    validate: {
      validator: (v) => validation.isURL(v),
      message: 'Введите ссылку',
    },
  },
  image: {
    type: mongoose.Schema.Types.String,
    required: true,
    validate: {
      validator: (v) => validation.isURL(v),
      message: 'Введите ссылку',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
});

module.exports = mongoose.model('article', articleShema);
