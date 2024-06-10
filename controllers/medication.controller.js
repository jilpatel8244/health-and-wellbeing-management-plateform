const db = require('../models/index');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
let { Medication, Reminder, User } = db;

exports.insertMedication = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        let { medicationName, description, type, oneTimeDate, oneTimeTime, recurringType, dailyStartDate, dailyEndDate, dailyTime, weeklyStartDate, weeklyEndDate, weeklyTime, dayOfWeek } = req.body;

        // make entry in medication table 
        // make entry in remiders table 

        let newMedication = await Medication.create(
            {
                name: medicationName,
                description: description,
                user_id: req.user[0].id
            },
            { transaction: t }
        );

        let payload = {};

        if (type === 'oneTime') {
            payload = {
                type: 'oneTime',
                one_time_date: oneTimeDate,
                time: oneTimeTime,
                medication_id: newMedication.id
            }
        } else {
            if (recurringType === 'daily') {
                payload = {
                    type: 'daily',
                    start_date: dailyStartDate,
                    end_date: dailyEndDate,
                    time: dailyTime,
                    medication_id: newMedication.id
                }
            } else {
                payload = {
                    type: 'weekly',
                    start_date: weeklyStartDate,
                    end_date: weeklyEndDate,
                    time: weeklyTime,
                    day_of_week: dayOfWeek,
                    medication_id: newMedication.id
                }
            }
        }

        await Reminder.create(payload, { transaction: t });

        await t.commit();

        return res.status(200).json({
            success: true,
            message: "reminder created successfully"
        });
    } catch (error) {
        await t.rollback();
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong while inserting madicine"
        })
    }
}

exports.getUserMedications = async (req, res) => {
    try {
        let allUserMedication = await Medication.findAll(
            {
                attributes: ['id', 'name', 'description'],
                include: {
                    model: Reminder,
                    attributes: ['type']
                },
                where: {
                    user_id: req.user[0].id
                }
            }
        );

        res.status(200).json({
            success: true,
            message: allUserMedication
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong while fetching all user madications"
        })
    }
}

exports.getMedicationInfoById = async (req, res) => {
    try {
        let medicationInfo = await Medication.findByPk(req.query.id,
            {
                attributes: ['id', 'name', 'description', 'createdAt'],
                include: {
                    model: Reminder
                }
            }
        );

        res.status(200).json({
            success: true,
            message: medicationInfo
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong while getting specific madication info"
        })
    }
}

exports.deleteMadication = async (req, res) => {
    try {
        const t = await db.sequelize.transaction();

        let { id } = req.body;

        await Medication.destroy({
            where: {
                id: id
            }
        }, { transaction: t });

        await Reminder.destroy({
            where: {
                medication_id: id
            }
        }, { transaction: t });

        await t.commit();

        return res.status(200).json({
            success: true,
            message: "Medication deleted successfully"
        });

    } catch (error) {
        await t.rollback();
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong while deleting madicine"
        })
    }
}

exports.updateMedication = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        let { medicationId, medicationName, description, type, oneTimeDate, oneTimeTime, recurringType, dailyStartDate, dailyEndDate, dailyTime, weeklyStartDate, weeklyEndDate, weeklyTime, dayOfWeek } = req.body;

        // update entry in medication table 
        // update entry in remiders table 

        let newMedication = await Medication.update(
            {
                name: medicationName,
                description: description,
            },
            {
                where: {
                    id: medicationId
                }
            },
            { transaction: t }
        );

        let payload = {};

        if (type === 'oneTime') {
            payload = {
                type: 'oneTime',
                one_time_date: oneTimeDate,
                time: oneTimeTime,
                medication_id: newMedication.id
            }
        } else {
            if (recurringType === 'daily') {
                payload = {
                    type: 'daily',
                    start_date: dailyStartDate,
                    end_date: dailyEndDate,
                    time: dailyTime,
                    medication_id: newMedication.id
                }
            } else {
                payload = {
                    type: 'weekly',
                    start_date: weeklyStartDate,
                    end_date: weeklyEndDate,
                    time: weeklyTime,
                    day_of_week: dayOfWeek,
                    medication_id: newMedication.id
                }
            }
        }

        await Reminder.update(payload, {
            where: {
                medication_id: medicationId
            }
        }, { transaction: t });

        await t.commit();

        return res.status(200).json({
            success: true,
            message: "Medication updated successfully",
            toast: true,
            toastType: 'success',
        });
    } catch (error) {
        await t.rollback();
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong while updating madicine"
        })
    }
}

exports.csvHandler = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log(req.file);

        const filePath = path.join(__dirname, '..', req.file.path);
        const results = [];
        let medicationData = [];
        let reminderData = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                medicationData.push({
                    name: data.name,
                    description: data.description,
                    user_id: req.user[0].id,
                    picture_url: data.picture_url ? (data.picture_url) : null,
                });

                reminderData.push({
                    type: data.type,
                    one_time_date: data.one_time_date ? (data.one_time_date) : null,
                    start_date: data.start_date ? (data.start_date) : null,
                    end_date: data.end_date ? (data.end_date) : null,
                    time: data.time,
                    day_of_week: data.day_of_week ? (data.day_of_week) : null
                });
            })
            .on('end', async () => {
                const t = await db.sequelize.transaction();

                try {
                    console.log(reminderData);

                    let newMedications = await Medication.bulkCreate(medicationData, { transaction: t });

                    let modifiedReminderData = reminderData.map((element, index) => {
                        return {...element, medication_id: newMedications[index].id} 
                    });

                    console.log(modifiedReminderData);

                    let newReminders = await Reminder.bulkCreate(modifiedReminderData, { transaction: t });

                    await t.commit();

                    res.status(200).json({
                        success: true,
                        message: 'data inserted successfully',
                        toast: true,
                        toastType: 'success',
                    });
                } catch (error) {
                    await t.rollback();
                    console.error('Error inserting csv data:', error);
                    res.status(500).json({ 
                        success: false, 
                        message: 'Error inserting csv data',
                        toast: true,
                        toastType: 'error',
                    });
                }
            });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'something wrong while handling csv upload'
        })
    }
}