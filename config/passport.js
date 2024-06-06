const passport = require('passport');
const db = require('../models/index');
let { User } = db;
var JwtStrategy = require('passport-jwt').Strategy;

const getToken = (req) => {
    return req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer", "") || null;
}

var opts = {}
opts.jwtFromRequest = getToken;
opts.secretOrKey = 'JWT_SECRET';

passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    try {
        let user = await User.findAll({
            where: {
                id: jwt_payload.id 
            }
        });
        
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }

    } catch (error) {
        return done(err);
    }
}));