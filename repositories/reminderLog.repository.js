const { Op } = require('sequelize');
const db = require('../models/index');
let { ReminderLogs, Medication, Reminder } = db;

exports.createReminderLog = async (reminder_id) => {
    try {
        const newReminderLog = await ReminderLogs.create({
            reminder_id: reminder_id
        });

        return newReminderLog.id;
    } catch (error) {
        console.log(error);
        throw new Error("Could not create reminder-log");
    }
}

exports.getReportData = async (userId) => {
    try {
        let today = new Date();
        let lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        console.log("today ", today);
        console.log("lastWeek ", lastWeek);

        let data = await ReminderLogs.findAll(
            {
                include: {
                    required: true,
                    model: Reminder,
                    attributes: [],
                    include: {
                        required: true,
                        model: Medication,
                        attributes: [],
                        where: {
                            user_id: userId
                        }
                    }
                },
                where: {
                    createdAt: {
                        [Op.between] : [lastWeek, today]   
                    }
                }
            }
        );

        console.log(data);

        return data;
    } catch (error) {
        console.log(error);
        throw new Error("Could not get report-data");
    }
}

exports.getReportDataBetweenSpecificDates = async (startDate, endDate, userId) => {
    try {
        let data = await ReminderLogs.findAll(
            {
                include: {
                    required: true,
                    model: Reminder,
                    attributes: [],
                    include: {
                        required: true,
                        model: Medication,
                        attributes: [],
                        where: {
                            user_id: userId
                        }
                    }
                },
                where: {
                    createdAt: {
                        [Op.between] : [startDate, endDate]   
                    }
                }
            }
        );

        console.log(data);

        return data;
    } catch (error) {
        console.log(error);
        throw new Error("Could not get report-data between specific dates");
    }
}
