const router = require('express').Router();

const { getInfoUser, logOut } = require('../controllers/users');

router.get('/me', getInfoUser);
router.post('/cookie', logOut);

module.exports = router;
