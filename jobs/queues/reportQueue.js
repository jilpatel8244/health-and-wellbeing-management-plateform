const { Queue } = require("bullmq");
const redisConnection = require('../../config/redisConfig');

const reportQueue = new Queue('reportQueue', { connection: redisConnection });

module.exports = reportQueue;
