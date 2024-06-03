const { Queue, Worker } = require('bullmq');
const mailService = require('../services/mailTransport.service');
const cron = require('node-cron');
const db = require('../models/index');
let { User } = db;

// Define Redis connection details
const redisConnection = {
    host: '127.0.0.1',
    port: 6379,
};
  
// Initialize BullMQ queue
const reportQueue = new Queue('report-generation', { connection: redisConnection });

function generateReportForUser(user) {
    return { reportData: 'This is the generated report for user ' + user.email };
}

// Define the job processing function
function processReportJob(job) {
    let { user } = job.data;
    const { reportData } = generateReportForUser(user);
    console.log("this is report data : ", reportData);
    mailService(user.email, 'weekly report', reportData);
}

const worker = new Worker('report-generation', processReportJob, { connection: redisConnection });

async function getUsers() {
    let users = await User.findAll({
        attributes: ['id', 'email']
    });

    console.log(users);
    return users;
}

const schedule = cron.schedule('41 18 * * 0', async () => {
    const users = await getUsers();
    users.forEach(user => {
        reportQueue.add('generate-report', { user });
    });
    console.log('Scheduled jobs for user report generation.');
});

schedule.start();
