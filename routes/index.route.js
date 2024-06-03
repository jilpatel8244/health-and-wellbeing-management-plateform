const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.route');
const medicationRoutes = require('./medication.route');
const reminderRoutes = require('./reminder.route');

router.use('/', authRoutes);
router.use('/medication', medicationRoutes);
router.use('/reminders', reminderRoutes);

module.exports = router;