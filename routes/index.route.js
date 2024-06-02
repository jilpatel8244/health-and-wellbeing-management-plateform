const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.route');
const medicationRoutes = require('./medication.route');

router.use('/', authRoutes);
router.use('/medication', medicationRoutes)

module.exports = router;