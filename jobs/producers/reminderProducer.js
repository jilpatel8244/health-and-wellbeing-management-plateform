const cron = require('node-cron');
const reminderQueue = require('../queues/reminderQueue');
const db = require('../../models/index');
let { User, Medication, Reminder } = db;

// Schedule the cron job to run every minute
cron.schedule('* * * * *', () => {
    console.log('Checking for reminders to send...');
    checkAndSendReminders();
});

const checkAndSendReminders = async () => {
    try {
        const reminders = await Reminder.findAll({
            include: [
                {
                  model: Medication,
                  include: [User],
                },
            ],
        });
    
        reminders.forEach(async (reminder) => {
            await reminderQueue.add('checkAndSendReminder', { reminder })
        });
    } catch (error) {
        console.log(error);
    }
}
