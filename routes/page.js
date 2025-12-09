const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { renderMain, renderJoin, createEvent, updateEvent, deleteEvent } = require('../controllers/page.js');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

router.get('/', renderMain);
router.get('/join', isNotLoggedIn, renderJoin);
router.post('/schedule', isLoggedIn, createEvent);
router.patch('/schedule', isLoggedIn, updateEvent);
router.delete('/schedule', isLoggedIn, deleteEvent);

module.exports = router;