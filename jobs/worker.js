const { Queue, Worker } = require('bullmq');
const mailService = require('../services/mailTransport.service');
const cron = require('node-cron');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');
const db = require('../models/index');
let { User, Reminder, Medication } = db;

// Define Redis connection details
const redisConnection = {
    host: '127.0.0.1',
    port: 6379,
};
  
// Initialize BullMQ queue
const reportQueue = new Queue('report-generation', { connection: redisConnection });

async function generateReportForUser(user) {
    const reportData = await Reminder.findAll({
        attributes: ['id', 'type', 'medication_id', 'one_time_date', 'start_date', 'end_date', 'time'],
        include: {
            model: Medication,
            attributes: [],
            include: {
                model: User,
                attributes: [],
                where: {
                    id: user.id
                }
            }
        }
    });

    console.log(reportData);

    let date = new Date();
    const csvFileName = `report.csv`
    const csvFilePath = path.join(__dirname, '..', 'reports', csvFileName);

    const csvWriter = createCsvWriter({
        path: csvFilePath,
        header: [
            { id: 'id', title: 'Id'},
            { id: 'type', title: 'Type'},
            { id: 'medication_id', title: 'Medication Id'},
            { id: 'one_time_date', title: 'One Time Date'},
            { id: 'start_date', title: 'Start Date'},
            { id: 'end_date', title: 'End Date'},
            { id: 'time', title: 'Time'},
        ]
    });

    await csvWriter.writeRecords(reportData);

    return { 
        csvFilePath: csvFilePath,
        csvFileName: csvFileName
    };
}

// Define the job processing function
async function processReportJob(job) {
    let { user } = job.data;
    const { csvFilePath, csvFileName } = await generateReportForUser(user);
    console.log("file name: ", csvFileName, " file path: ", csvFilePath);
    await mailService(user.email, 'Your Weekly Report', 'Report from thisDate to thisDate', null, csvFilePath, csvFileName);
    fs.unlinkSync(csvFilePath);
}

const worker = new Worker('report-generation', processReportJob, { connection: redisConnection });

async function getUsers() {
    let users = await User.findAll({
        attributes: ['id', 'email']
    });

    console.log(users);
    return users;
}

const schedule = cron.schedule('49 13 * * 1', async () => {
    const users = await getUsers();
    users.forEach(user => {
        reportQueue.add('generate-report', { user });
    });
    console.log('Scheduled jobs for user report generation.');
});

schedule.start();
