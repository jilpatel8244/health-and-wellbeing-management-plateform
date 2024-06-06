const express = require('express');
const { createUser, verifyOtp, loginHandler, logoutHandler, logoutFromOtherDevicesHandler, logoutFromAllDevicesHandler, renderLoginPage, renderRegistrationPage, renderLandingPage, renderOtpPage, renderHomePage, renderVerifyEmailPage, verifyEmail, renderCreateConfirmPasswordPage, changePasswordHandler } = require('../controllers/auth.controller');
const passport = require('passport');
const userSessionCheck = require('../middleware/userSessionCheck');
const upload = require('../middleware/uploadConfig');
const router = express.Router();

router.get("/", renderLandingPage);

router.get("/registration", renderRegistrationPage);
router.post("/registration", upload.single('profile_img'), createUser);

router.get("/verify-otp", renderOtpPage);
router.post("/verify-otp", verifyOtp);

router.get("/verify-email", renderVerifyEmailPage);
router.post("/verify-email", verifyEmail);

router.get("/change-password", renderCreateConfirmPasswordPage);
router.post("/change-password", changePasswordHandler);

router.get("/login", renderLoginPage);
router.post("/login", loginHandler);

router.get("/home", userSessionCheck, passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), renderHomePage);

router.get("/logout", userSessionCheck, passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), logoutHandler);
router.get("/logout-all-devices", userSessionCheck, passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), logoutFromAllDevicesHandler);
router.post("/logout-other-devices", userSessionCheck, passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), logoutFromOtherDevicesHandler);


module.exports = router;