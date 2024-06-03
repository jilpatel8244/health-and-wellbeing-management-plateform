const express = require('express');
const passport = require('passport');
const { updateCheckedAt } = require('../controllers/reminders.controller');
const userSessionCheck = require('../middleware/userSessionCheck');
const router = express.Router();

router.post("/update-checkedAt", userSessionCheck, passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), updateCheckedAt);


module.exports = router;