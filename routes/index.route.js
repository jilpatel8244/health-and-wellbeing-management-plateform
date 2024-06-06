const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.route');
const medicationRoutes = require('./medication.route');
const reminderRoutes = require('./reminder.route');
const reportRoutes = require('./report.route');

router.use('/', authRoutes);
router.use('/medication', medicationRoutes);
router.use('/reminders', reminderRoutes);
router.use('/report', reportRoutes);

module.exports = router;