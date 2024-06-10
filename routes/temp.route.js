const express = require('express');
const passport = require('passport');
const userSessionCheck = require('../middleware/userSessionCheck');
const router = express.Router();
const db = require('../models/index');
const { Op } = require('sequelize');
let { User, Medication, Reminder } = db;

router.post("/temp", userSessionCheck, passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), async (req, res) => {
    try {
        const reminders = await Reminder.findAll({
            include: [
                {
                  model: Medication,
                  include: [User],
                },
            ],
            where: {
                medication_id: {
                    [Op.ne] : null
                }
            }
        });

        res.send(reminders);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;