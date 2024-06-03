const db = require('../models/index');
let { Medication, Reminder, User } = db;

exports.insertMedication = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {

        let { medicationName, description, type, oneTimeDate, oneTimeTime, recurringType, dailyStartDate, dailyEndDate, dailyTime, weeklyStartDate, weeklyEndDate, weeklyTime, dayOfWeek } = req.body;

        console.log(req.body);
        console.log(req.user[0].id);
        console.log(req.user[0].email);

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
                attributes: [ 'id', 'name', 'description', 'picture_url', 'user_id' ],
                where: {
                    user_id: req.user[0].id
                }
            }
        );

        console.log(allUserMedication);

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