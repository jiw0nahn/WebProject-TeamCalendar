const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { renderMain } = require('../controllers/page.js'); // 나머지 컨트롤러도 구현해야함

const router = express.Router();

router.get('/', renderMain);

module.exports = router;