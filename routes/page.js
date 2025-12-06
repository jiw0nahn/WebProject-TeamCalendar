const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { renderMain, renderJoin } = require('../controllers/page.js'); // 나머지 컨트롤러도 구현해야함

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

router.get('/', renderMain);
router.get('/join', isNotLoggedIn, renderJoin);

module.exports = router;