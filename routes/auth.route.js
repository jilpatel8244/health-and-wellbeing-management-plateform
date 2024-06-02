const express = require('express');
const { createUser, verifyOtp, loginHandler } = require('../controllers/auth.controller');
const router = express.Router();

router.get("/registration", (req, res) => {
    res.render("pages/registration.ejs");
});

router.post("/registration", createUser);

router.get("/verify-otp", (req, res) => {
    res.render("pages/otpPage.ejs")
});

router.post("/verify-otp", verifyOtp);

router.get("/login", (req, res) => {
    res.render("pages/login.ejs");
});

router.post("/login", loginHandler);

router.get("/home", (req, res) => {
    res.render("pages/home.ejs");
});



module.exports = router;