const otpGenerator = require('otp-generator');

function generateOTP(length) {
    let otp = otpGenerator.generate(length, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars:false
    });

    return otp;
}

module.exports = generateOTP;