const db = require('../models/index');
let { User } = db;

exports.getUser = async (id) => {
    try {
        let user = await User.findByPk(id);

        return user;
    } catch (error) {
        console.log(error);
        throw new Error("Could not get user info");
    }
}