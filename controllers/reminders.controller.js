const db = require('../models/index');
let { Medication, Reminder, User } = db;

exports.updateCheckedAt = async (req, res) => {
    try {
        let { id } = req.body;

        if (!id) {
            return res.status(500).json({
                success: false,
                message: "dont try to fool me"
            });
        }

        await Reminder.update(
            { taken_at: db.Sequelize.fn('now') },
            {
                where: {
                    id: id
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "reminder updated successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong while updating reminder"
        })
    }
}