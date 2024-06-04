const db = require('../models/index');
let { ReminderLogs } = db;

exports.updateMarkAsDoneAt = async (req, res) => {
    try {
        let { id } = req.body;

        if (!id) {
            return res.status(500).json({
                success: false,
                message: "sorry, id not found"
            });
        }

        // if already updated than dont update it (situation ocuure when user clicks again)

        await ReminderLogs.update(
            { mark_as_done_at: db.Sequelize.fn('now') },
            {
                where: {
                    id: id,
                    mark_as_done_at: null
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