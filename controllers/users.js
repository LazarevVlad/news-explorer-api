const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const user = require('../models/user');
const ConflictError = require('../errors/conflict-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => user.create({ name, email, password: hash }))
    .then((client) =>
      res.send({
        id: client._id,
        name: client.name,
        email: client.email,
      }),
    )
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError('Такой email уже существует');
      }
      next(err);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return user
    .findUserByCredentials(email, password)
    .then((client) => {
      const token = jwt.sign(
        { _id: client._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secret',
        {
          expiresIn: '7d',
        },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'strict',
      });
      res.status(200).send({ message: 'Аутентификация прошла успешно' });
    })
    .catch(() => {
      const err = new Error('Неправильная почта или пароль');
      err.statusCode = 401;
      next(err);
    });
};

module.exports.getInfoUser = (req, res, next) => {
  user
    .findById(req.user._id)
    .then((info) => res.send({ email: info.email, name: info.name }))
    .catch(next);
};

module.exports.logOut = (req, res, next) => {
  try {
    res.cookie('jwt', '', {
      maxAge: -1,
    });
    res.status(200).send({ message: 'Cookie deleted' });
  } catch (e) {
    const err = new Error('Ошибка сервера');
    err.statusCode = 500;

    next(err);
  }
};
