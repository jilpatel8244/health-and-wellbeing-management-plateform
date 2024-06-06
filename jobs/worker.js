const { Queue, Worker } = require('bullmq');
const mailService = require('../services/mailTransport.service');
const cron = require('node-cron');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');
const db = require('../models/index');
const { getReportData } = require('../repositories/reminderLog.repository');
let { User, Reminder, Medication } = db;

// Define Redis connection details
const redisConnection = {
    host: '127.0.0.1',
    port: 6379,
};

// Initialize BullMQ queue
const reportQueue = new Queue('report-generation', { connection: redisConnection });

async function generateReportForUser(user) {
    try {
        let reportData = await getReportData(user.id);

        console.log("this is report data ", reportData);

        const csvFileName = `report.csv`
        const csvFilePath = path.join(__dirname, '..', 'reports', csvFileName);

        const csvWriter = createCsvWriter({
            path: csvFilePath,
            header: [
                { id: 'id', title: 'Id' },
                { id: 'reminder_id', title: 'Reminder Id' },
                { id: 'mark_as_done_at', title: 'Your Medicine Taken Time' },
                { id: 'createdAt', title: 'Created At' },
            ]
        });

        await csvWriter.writeRecords(reportData);

        return {
            csvFilePath: csvFilePath,
            csvFileName: csvFileName,
            dataLength: reportData.length
        };
    } catch (error) {
        console.log(error);
    }
}

// Define the job processing function
async function processReportJob(job) {
    let { user } = job.data;
    const { csvFilePath, csvFileName, dataLength } = await generateReportForUser(user);

    let today = new Date().toLocaleString();
    let lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleString();

    await mailService(user.email, 'Your Weekly Report', `Report from ${today} to ${lastWeek}, total records: ${dataLength}`, null, csvFilePath, csvFileName);
    fs.unlinkSync(csvFilePath);
}

const worker = new Worker('report-generation', processReportJob, { connection: redisConnection });

async function getUsers() {
    let users = await User.findAll({
        attributes: ['id', 'email']
    });

    return users;
}

const schedule = cron.schedule('06 17 * * 3', async () => {
    const users = await getUsers();
    users.forEach(user => {
        reportQueue.add('generate-report', { user });
    });
    console.log('Scheduled jobs for user report generation.');
});

schedule.start();
