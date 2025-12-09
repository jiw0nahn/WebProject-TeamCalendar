const express = require('express');
const { isLoggedIn } = require('../middlewares');
const { createTeam, joinTeam } = require('../controllers/team');

const router = express.Router();

router.post('/create', isLoggedIn, createTeam);

router.post('/join', isLoggedIn, joinTeam);

module.exports = router;