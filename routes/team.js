const express = require('express');
const { isLoggedIn } = require('../middlewares');
const { createTeam, joinTeam, updateMemo } = require('../controllers/team');

const router = express.Router();

router.post('/create', isLoggedIn, createTeam);
router.post('/join', isLoggedIn, joinTeam);
router.post('/:teamId/memo', isLoggedIn, updateMemo);

module.exports = router;