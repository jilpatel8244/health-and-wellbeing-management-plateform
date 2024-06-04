const db = require('../models/index');
let { ReminderLogs } = db;

exports.createReminderLog = async (reminder_id) => {
    try {
        const newReminderLog = await ReminderLogs.create({
            reminder_id: reminder_id
        });

        // console.log("this is new reminder log : ", newReminderLog);
        return newReminderLog.id;
    } catch (error) {
        console.log(error);
        throw new Error("Could not create reminder-log");
    }
}