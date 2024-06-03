const express = require('express');
const passport = require('passport');
const { insertMedication, getUserMedications } = require('../controllers/medication.controller');
const router = express.Router();

router.post("/add-medication", passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), insertMedication);
router.get("/get-user-medications", passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), getUserMedications);

module.exports = router;