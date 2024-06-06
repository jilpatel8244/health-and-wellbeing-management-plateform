const express = require('express');
const passport = require('passport');
const { updateMarkAsDoneAt } = require('../controllers/reminders.controller');
const userSessionCheck = require('../middleware/userSessionCheck');
const router = express.Router();

router.post("/update-marks-as-done", userSessionCheck, passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), updateMarkAsDoneAt);

module.exports = router;