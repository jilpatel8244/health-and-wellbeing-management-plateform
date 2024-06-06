const express = require('express');
const passport = require('passport');
const { getReportDataBetweenSpecificDates } = require('../controllers/report.controller');
const userSessionCheck = require('../middleware/userSessionCheck');
const router = express.Router();

router.post("/generate-report", userSessionCheck, passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), getReportDataBetweenSpecificDates);

module.exports = router;