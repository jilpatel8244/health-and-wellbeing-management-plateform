const cron = require('node-cron');
const reportQueue = require('../queues/reportQueue');
const db = require('../../models/index');
let { User } = db;

async function getUsers() {
    let users = await User.findAll({
        attributes: ['id', 'email']
    });

    return users;
}

cron.schedule('38 17 * * thu', async () => {
    const users = await getUsers();
    users.forEach(user => {
        reportQueue.add('generateAndSendReport', { user });
    });
    console.log('Scheduled jobs for user report generation.');
});
