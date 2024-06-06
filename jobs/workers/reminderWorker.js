const { Worker } = require('bullmq');
const { getHtmlContentForMedicationReminder } = require('../../helpers/getEmailHtmlContentForMedicationReminder');
const { createReminderLog } = require('../../repositories/reminderLog.repository');
const mailService = require('../../services/mailTransport.service');
const reminderQueue = require('../queues/reminderQueue');
const redisConnection = require('../../config/redisConfig');

const getLocalDate = (date) => {
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


const worker = new Worker('reminderQueue', async (job) => {
    const reminder = job.data.reminder;
    const now = new Date();
    const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const currentDay = daysOfWeek[now.getDay()];
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentSeconds = now.getSeconds();

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

        let htmlContent = getHtmlContentForMedicationReminder(name, description, logId);

        await mailService(user.email, 'Time for medicine', null, htmlContent, null, null);
    } else if (type === 'daily') {
        if (currentDate >= startDateStr && currentDate <= endDateStr && isSameTime) {
            console.log("here in daily sending email");
            let logId = await createReminderLog(id);

            let htmlContent = getHtmlContentForMedicationReminder(name, description, logId);
            await mailService(user.email, 'Time for medicine', null, htmlContent, null, null);
        }
    } else if (type === 'weekly') {
        if (currentDay === day_of_week && currentDate >= startDateStr && currentDate <= endDateStr && isSameTime) {
            console.log("here in weekly sending email");
            let logId = await createReminderLog(id);

            let htmlContent = getHtmlContentForMedicationReminder(name, description, logId);

            await mailService(user.email, 'Time for medicine', null, htmlContent, null, null);
        }
    }
}, { connection: redisConnection });

// worker.on('completed', job => {
//     console.log(`reminder job ${job.id} has completed`);
// });

worker.on('failed', (job, err) => {
    console.log(`reminder job ${job.id} has failed with error ${err.message}`);
})