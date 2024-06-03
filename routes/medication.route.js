const express = require('express');
const passport = require('passport');
const { insertMedication, getUserMedications } = require('../controllers/medication.controller');
const userSessionCheck = require('../middleware/userSessionCheck');
const router = express.Router();

router.post("/add-medication", userSessionCheck, passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), insertMedication);
router.get("/get-user-medications", userSessionCheck, passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), getUserMedications);

module.exports = router;