const express = require('express');
const passport = require('passport');
const { insertMedication } = require('../controllers/medication.controller');
const router = express.Router();

router.post("/add-medication", passport.authenticate('jwt', {session: false}), insertMedication);

module.exports = router;