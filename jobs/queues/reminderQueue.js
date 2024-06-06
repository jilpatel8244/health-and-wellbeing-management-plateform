const { Queue } = require("bullmq");
const redisConnection = require('../../config/redisConfig');

const reminderQueue = new Queue('reminderQueue', { connection: redisConnection });

module.exports = reminderQueue;
