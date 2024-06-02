const cron = require('node-cron');
const mailService = require('../services/mailTransport.service');
const db = require('../models/index');
let { User, Medication, Reminder } = db;

const checkAndSendReminders = async () => {
    const now = new Date();
    const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const currentDay = daysOfWeek[now.getDay()];
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentSeconds = now.getSeconds();

    const reminders = await Reminder.findAll({
        include: [
            {
              model: Medication,
              include: [User],
            },
        ],
    });

    // Function to get the local date in YYYY-MM-DD format
    const getLocalDate = (date) => {
        const localDate = new Date(date);
        const year = localDate.getFullYear();
        const month = String(localDate.getMonth() + 1).padStart(2, '0');
        const day = String(localDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    reminders.forEach((reminder) => {
        const { type, one_time_date, start_date, end_date, time, day_of_week, Medication: medication } = reminder;
        const { name, description, User: user } = medication;

        const [reminderHours, reminderMinutes, reminderSeconds] = time.split(':').map(Number);

        const isSameTime =
            reminderHours === currentHours &&
            reminderMinutes === currentMinutes &&
            reminderSeconds === currentSeconds;
    
        const currentDate = getLocalDate(now);
        const oneTimeDateStr = getLocalDate(one_time_date);
        const startDateStr = getLocalDate(start_date);
        const endDateStr = getLocalDate(end_date);

        if (type === 'oneTime' && oneTimeDateStr === currentDate && isSameTime) {
            // sendReminderEmail(user.email, name, description);
            console.log("here in one time sending email"); 
            mailService(user.email, name, description);
        } else if (type === 'daily') {
            if (currentDate >= startDateStr && currentDate <= endDateStr && isSameTime) {
                // sendReminderEmail(user.email, name, description);
                console.log("here in daily sending email"); 
                mailService(user.email, name, description);
            }
        } else if (type === 'weekly') {
            if (currentDay === day_of_week && currentDate >= startDateStr && currentDate <= endDateStr && isSameTime) {
                // sendReminderEmail(user.email, name, description);
                console.log("here in weekly sending email"); 
                mailService(user.email, name, description);
            }
        }
    });
}

// Schedule the cron job to run every minute
cron.schedule('* * * * *', () => {
    console.log('Checking for reminders to send...');
    checkAndSendReminders();
});

module.exports = { checkAndSendReminders };
