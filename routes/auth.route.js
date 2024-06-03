const express = require('express');
const { createUser, verifyOtp, loginHandler, logoutHandler, logoutFromOtherDevicesHandler, logoutFromAllDevicesHandler } = require('../controllers/auth.controller');
const passport = require('passport');
const userSessionCheck = require('../middleware/userSessionCheck');
const router = express.Router();

router.get("/", (req, res) => {
    res.send('Landing Page');
})

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

router.get("/home", userSessionCheck, passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), (req, res) => {
    res.render("pages/home.ejs");
});

router.get("/logout", userSessionCheck, passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), logoutHandler);

router.get("/logout-all-devices", userSessionCheck, passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), logoutFromAllDevicesHandler);

router.get("/logout-other-devices", userSessionCheck, passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), logoutFromOtherDevicesHandler);


module.exports = router;