const db = require('../models/index');
let { UserSession } = db;

async function userSessionCheck(req, res, next) {
    try {
        console.log(req.ip);
        let ip = req.ip || req.socket.localAddress || req.connection.remoteAddress;

        let userSessionData = await UserSession.findAll(
            {
                where: {
                    device: ip
                },
                order: [
                    ['created_at', 'DESC']
                ]
            }
        );

        console.log("this is a userSessionData : ", userSessionData);

        if (userSessionData.length) {
            if (userSessionData[0].logout_at) {
                res.redirect('/login');
            } else {
                next();
            }
        } else {
            res.redirect('/login');
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "something wrong while check user session"
        })
    }
}

module.exports = userSessionCheck;