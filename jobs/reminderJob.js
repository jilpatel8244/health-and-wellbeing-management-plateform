const cron = require('node-cron');
const mailService = require('../services/mailTransport.service');
const db = require('../models/index');
const { createReminderLog } = require('../repositories/reminderLog.repository');
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

    reminders.forEach(async (reminder) => {
        const { id, type, one_time_date, start_date, end_date, time, day_of_week, Medication: medication } = reminder;
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
            console.log("here in one time sending email"); 
            let logId = await createReminderLog(id);

            let htmlContent = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Home</title>
            <link rel="stylesheet" href="./css/tailwind.css">
        </head>
        <body>
            <h1>Medicine Name : ${name}</h1>
            <p>Medicine Description : ${description}</p>
            <form action="http://localhost:3000/reminders/update-marks-as-done" method="post">
                <input type="hidden" name="id" value=${logId} />
                <input type="submit" value="if taken then click it" />
            </form>
        </body>
        </html>
        `
        
            await mailService(user.email, 'Time for medicine', null, htmlContent, null, null);
        } else if (type === 'daily') {
            if (currentDate >= startDateStr && currentDate <= endDateStr && isSameTime) {
                console.log("here in daily sending email"); 
                let logId = await createReminderLog(id);

                let htmlContent = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Home</title>
            <link rel="stylesheet" href="./css/tailwind.css">
        </head>
        <body>
            <h1>Medicine Name : ${name}</h1>
            <p>Medicine Description : ${description}</p>
            <form action="http://localhost:3000/reminders/update-marks-as-done" method="post">
                <input type="hidden" name="id" value=${logId} />
                <input type="submit" value="if taken then click it" />
            </form>
        </body>
        </html>
        `
                await mailService(user.email, 'Time for medicine', null, htmlContent, null, null);
            }
        } else if (type === 'weekly') {
            if (currentDay === day_of_week && currentDate >= startDateStr && currentDate <= endDateStr && isSameTime) {
                console.log("here in weekly sending email"); 
                let logId = await createReminderLog(id);

                let htmlContent = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Home</title>
            <link rel="stylesheet" href="./css/tailwind.css">
        </head>
        <body>
            <h1>Medicine Name : ${name}</h1>
            <p>Medicine Description : ${description}</p>
            <form action="http://localhost:3000/reminders/update-marks-as-done" method="post">
                <input type="hidden" name="id" value=${logId} />
                <input type="submit" value="if taken then click it" />
            </form>
        </body>
        </html>
        `
                await mailService(user.email, 'Time for medicine', null, htmlContent, null, null);
            }
        }
    });
}

// Schedule the cron job to run every minute
cron.schedule('* * * * *', () => {
    console.log('Checking for reminders to send...');
    checkAndSendReminders();
});

// module.exports = { checkAndSendReminders };
