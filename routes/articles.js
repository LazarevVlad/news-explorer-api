const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const urlValidation = require('../regExp/urlValidation');

const {
  getArticle,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');

router.get('/', getArticle);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      link: Joi.string()
        .required()
        .regex(urlValidation)
        .error(new Error('Неправильный формат записи ссылки')),
      image: Joi.string()
        .required()
        .regex(urlValidation)
        .error(new Error('Неправильный формат записи ссылки')),
    }),
  }),
  createArticle,
);
router.delete(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  }),
  deleteArticle,
);

module.exports = router;
