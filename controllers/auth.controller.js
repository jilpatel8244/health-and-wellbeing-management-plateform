const md5 = require('md5');
const db = require('../models/index');
const generateRandomString = require('../services/saltGeneration.service');
const generateOTP = require('../services/otpGeneration.service');
const mailService = require('../services/mailTransport.service');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { generalResponse } = require('../helpers/response.helper');
const { getUser } = require('../repositories/user.repository');
const { calculateTimeDifference } = require('../helpers/calculateTimeDifference');
let { User, UserSession } = db;

exports.createUser = async (req, res) => {
    try {

        let { firstName, lastName, dateOfBirth, email, password, confirmPassword, phoneNumber, gender } = req.body;
        let path = (req.file) ? (req.file.path) : ('/assets/userImg.png');

        // check user already exist or not
        // 3 cases : 
        // 1. user alredy registered but not activated
        // 2. user registerd and also activated
        // 3. user not already registerd

        // check create password and confirm password
        // if both matches then generate salt and hash the password

        // generate otp

        // insert new user to db (make is_active false)

        // send mail to user

        // send response

        // -----------------------------------------------------------------------------------

        // check user already exist or not
        let isAlreadyExist = await User.findAll(
            {
                where: {
                    email: email
                }
            }
        );

        if (isAlreadyExist.length) {
            // 1. user alredy registered but not activated -> redirect them to verify email page
            if (!isAlreadyExist[0].is_active) {
                return res.status(500).json({
                    success: false,
                    message: "You are already registered but not activated, to activate your account click on 'Activate'",
                    toast: true,
                    toastType: 'custom',
                    toastBtnText: 'Activate',
                    redirectionUrl: `/verify-email`

                });
            }

            // 2. user registerd and also activated
            return res.status(500).json({
                success: false,
                message: "user already registerd",
                toast: true,
                toastType: 'error'
            });
        }

        // 3. user not already registerd

        // check create password and confirm password
        if (password !== confirmPassword) {
            return res.status(500).json({
                success: false,
                message: "passwords doesn't match",
                toast: true,
                toastType: 'error'
            });
        }

        // if both matches then generate salt and hash the password
        let salt = generateRandomString(4);
        let hashedPassword = md5(password + salt);

        // generate otp
        let otp = generateOTP(6);

        // insert new user to db (make is_active false)
        let newUser = await User.create({
            first_name: firstName,
            last_name: lastName,
            email: email,
            dob: dateOfBirth,
            password: hashedPassword,
            salt: salt,
            profile_img_url: path,
            phone_number: phoneNumber,
            otp: otp,
            is_active: false,
            gender: gender
        });

        // send mail to user
        let subject = 'OTP FOR ACTIVATE YOUR ACCOUNT';
        let text = `this is your otp : ${otp}`;
        mailService(email, subject, text);

        // send response
        return res.status(200).json({
            success: true,
            message: "user created successfully",
            toast: false
        });
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            success: false,
            message: "something went wrong",
            toast: true,
            toastType: 'error'
        });
    }

}

exports.verifyOtp = async (req, res) => {
    try {
        let { email, otp } = req.body;

        // 3 cases
        // 1. email doen't exists
        // 2. email exists but stored otp doen't match 
        // 3. otp match but it may expires
        // 4. otp match and also not expires
        // -------------------------------------------------------------------------------------

        // 1. email doen't exists
        let user = await User.findAll({
            where: {
                email: email
            }
        });

        if (!user.length) {
            return res.status(500).json({
                success: false,
                message: "user not exists (wrong email)",
                toast: true,
                toastType: 'error'
            });
        }

        // 2. email exists but stored otp doen't match 
        if (user[0].otp !== otp) {
            return res.status(500).json({
                success: false,
                message: "wrong otp",
                toast: true,
                toastType: 'error'
            });
        }

        // 3. otp match but it may expires
        let isOtpExpired = calculateTimeDifference(user[0].updated_at);

        if (isOtpExpired) {
            return res.status(500).json({
                success: false,
                message: "otp expires",
                toast: true,
                toastType: 'custom',
                toastBtnText: 'Resend',
                redirectionUrl: `/verify-email`
            });
        }

        // 4. otp match and also not expires
        let updatedUser = await User.update(
            { is_active: true },
            {
                where: {
                    id: user[0].id
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "otp verified successfully",
            toast: true,
            toastType: 'success'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong while verifing user",
            toast: true,
            toastType: 'error'
        });
    }
}

exports.loginHandler = async (req, res) => {
    try {
        let { email, password } = req.body;

        // check user exist or not
        let userExist = await User.findAll({
            where: {
                email: email
            }
        });

        if (!userExist.length) {
            return res.status(500).json({
                success: false,
                message: "user not exist",
                toast: true,
                toastType: 'error'
            });
        }

        // redirect them to verify email page
        if (!userExist[0].is_active) {
            return res.status(500).json({
                success: false,
                message: "please activate your account",
                toast: true,
                toastType: 'custom',
                toastBtnText: 'Activate',
                redirectionUrl: `/verify-email`
            })
        }

        // if yes then get password, salt and generate hash using md5
        let hashedPassword = md5(password + userExist[0].salt);

        // compare this password with database password
        if (userExist[0].password !== hashedPassword) {
            return res.status(500).json({
                success: false,
                message: "password not match",
                toast: true,
                toastType: 'error'
            })
        }

        let ip = req.ip || req.socket.localAddress || req.connection.remoteAddress;

        // if matches then do something for session and jwt token
        let newUserSession = await UserSession.create(
            {
                user_id: userExist[0].id,
                device: ip,
            }
        );

        let payLoad = {
            id: userExist[0].id,
            email: userExist[0].email
        }

        const token = jwt.sign(payLoad, "JWT_SECRET", { expiresIn: '1d' });

        return res.status(200).cookie('token', token).json({
            success: true,
            message: "user logged in successfully",
            toast: false
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong while login",
            toast: true,
            toastType: 'error'
        })
    }
}

exports.logoutHandler = async (req, res) => {
    try {
        let ip = req.ip || req.socket.localAddress || req.connection.remoteAddress;

        await UserSession.update(
            {
                logout_at: new Date()
            },
            {
                where: {
                    user_id: req.user[0].id,
                    logout_at: null,
                    device: ip
                }
            }
        );

        res.clearCookie('token');
        res.redirect('/login');
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong while loggin out",
            toast: true,
            toastType: 'error'
        })
    }
}

exports.logoutFromAllDevicesHandler = async (req, res) => {
    try {
        await UserSession.update(
            {
                logout_at: new Date()
            },
            {
                where: {
                    user_id: req.user[0].id,
                    logout_at: null
                }
            }
        );

        const io = req.app.get('io');

        io.to(`room_${req.user[0].id}`).emit('logout-from-all-devices', req.user[0].id);

        res.redirect('login');
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong while loggin out",
            toast: true,
            toastType: 'error'
        })
    }
}

exports.logoutFromOtherDevicesHandler = async (req, res) => {
    try {
        let ip = req.ip || req.socket.localAddress || req.connection.remoteAddress;
        let { socketId } = req.body;
        console.log(socketId);

        await UserSession.update(
            {
                logout_at: new Date()
            },
            {
                where: {
                    user_id: req.user[0].id,
                    logout_at: null,
                    device: {
                        [Op.ne]: ip
                    }
                }
            }
        );

        const io = req.app.get('io');

        io.to(`room_${req.user[0].id}`).emit('logout-from-other-devices', { userId: req.user[0].id, socketId: socketId });

        res.status(200).json({
            success: true,
            message: "others are logout successfully",
            toast: true,
            toastType: 'success'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong while loggin out",
            toast: true,
            toastType: 'error'
        })
    }
}

exports.verifyEmail = async (req, res) => {
    try {
        let { email } = req.body;

        // generate otp
        let otp = generateOTP(6);

        // update new otp
        await User.update(
            { otp: otp },
            {
                where: {
                    email: email
                }
            }
        )

        // send it in mail
        let subject = 'OTP FOR VERIFY YOUR EMAIL';
        let text = `this is your otp : ${otp}`;
        mailService(email, subject, text);

        // send response
        return res.status(200).json({
            success: true,
            message: "otp sent successfully",
            toast: true,
            toastType: 'success'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "error while email varification",
            toast: true,
            toastType: 'error'
        })
    }
}

exports.changePasswordHandler = async (req, res) => {
    try {
        // user available
        // also need to be an active
        // check the create and confirm password 
        // update the password

        let { email, password, confirmPassword } = req.body;

        // check user exist or not
        let userExist = await User.findAll({
            where: {
                email: email
            }
        });

        if (!userExist.length) {
            return res.status(500).json({
                success: false,
                message: "user not exist",
                toast: true,
                toastType: 'error'
            })
        }

        if (!userExist[0].is_active) {
            return res.status(500).json({
                success: false,
                message: "please activate your account",
                toast: true,
                toastType: 'custom',
                toastBtnText: 'Activate',
                redirectionUrl: `/verify-email`
            })
        }

        if (password !== confirmPassword) {
            return res.status(500).json({
                success: false,
                message: "password not match",
                toast: true,
                toastType: 'error',
            })
        }

        let salt = generateRandomString(4);
        let hashedPassword = md5(password + salt);

        await User.update(
            {
                password: hashedPassword,
                salt: salt
            },
            {
                where: {
                    email: email
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "password change successfully",
            toast: true,
            toastType: 'success',
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "error while changing password",
            toast: true,
            toastType: 'error',
        })
    }
}

exports.renderRegistrationPage = async (req, res) => {
    res.render("pages/registration.ejs");
}

exports.renderLoginPage = async (req, res) => {
    res.render("pages/login.ejs");
}

exports.renderLandingPage = async (req, res) => {
    res.render("pages/landingPage");
}

exports.renderOtpPage = async (req, res) => {
    let redirectedAt = req.query.redirectedAt;
    res.render("pages/otpPage.ejs", {
        redirectedAt: redirectedAt
    });
}

exports.renderHomePage = async (req, res) => {
    let user = await getUser(req.user[0].id);

    res.render("pages/home.ejs", {
        user: user
    });
}

exports.renderVerifyEmailPage = async (req, res) => {
    let redirectedAt = req.query.redirectedAt;
    res.render("pages/verifyEmail.ejs", {
        redirectedAt: redirectedAt
    });
}

exports.renderCreateConfirmPasswordPage = async (req, res) => {
    let email = req.query.email;
    res.render("pages/createConfirmPassword.ejs", {
        email: email
    });
}