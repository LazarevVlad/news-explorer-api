const article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getArticle = (req, res, next) => {
  article
    .find({ owner: req.user._id })
    .then((articles) => res.send({ data: articles }))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  article
    .create({
      keyword,
      title,
      text,
      date,
      source,
      link,
      image,
      owner: req.user._id,
    })
    .then((response) => res.send({ data: response }))
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  article
    .findById(req.params.id)
    .orFail(() => new NotFoundError(`Статья с id:${req.params.id} не найдена`))
    .then((response) => {
      if (req.user._id === response.owner.toString()) {
        article
          .findByIdAndDelete(req.params.id)
          .then(() =>
            res.status(200).send({ message: 'Статья удалена успешно!' }),
          );
      } else {
        throw new ForbiddenError('Вы не можете удалить чужую Статья');
      }
    })
    .catch(next);
};
