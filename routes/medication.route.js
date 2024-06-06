const express = require('express');
const passport = require('passport');
const { insertMedication, getUserMedications, getMedicationInfoById } = require('../controllers/medication.controller');
const userSessionCheck = require('../middleware/userSessionCheck');
const router = express.Router();

router.post("/add-medication", userSessionCheck, passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), insertMedication);
router.get("/get-user-medications", userSessionCheck, passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), getUserMedications);
router.get("/get-medication-info-by-id", userSessionCheck, passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), getMedicationInfoById);

module.exports = router;