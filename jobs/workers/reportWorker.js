const { Worker } = require('bullmq');
const { getReportData } = require('../../repositories/reminderLog.repository');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');
const mailService = require('../../services/mailTransport.service');
const redisConnection = require('../../config/redisConfig');
const { createObjectCsvStringifier } = require('csv-writer');


async function generateReportForUser(user) {
    try {
        // let reportData = await getReportData(user.id);

        // console.log("this is report data ", reportData);

        // const csvFileName = `report.csv`
        // const csvFilePath = path.join(__dirname, '..', '..', 'reports', csvFileName);

        // const csvWriter = createCsvWriter({
        //     path: csvFilePath,
        //     header: [
        //         { id: 'id', title: 'Id' },
        //         { id: 'reminder_id', title: 'Reminder Id' },
        //         { id: 'mark_as_done_at', title: 'Your Medicine Taken Time' },
        //         { id: 'createdAt', title: 'Created At' },
        //     ]
        // });

        // await csvWriter.writeRecords(reportData);

        // return {
        //     csvFilePath: csvFilePath,
        //     csvFileName: csvFileName,
        //     dataLength: reportData.length
        // };



        let reportData = await getReportData(user.id);

        console.log("this is report data ", reportData);

        const csvStringifier = createObjectCsvStringifier({
            header: [
                { id: 'id', title: 'Id' },
                { id: 'reminder_id', title: 'Reminder Id' },
                { id: 'mark_as_done_at', title: 'Your Medicine Taken Time' },
                { id: 'createdAt', title: 'Created At' },
            ]
        });

        const csvHeader = csvStringifier.getHeaderString();
        const csvBody = csvStringifier.stringifyRecords(reportData);
        const csvData = csvHeader + csvBody;

        csvFileName = 'report.csv';

        return {
            csvFileName: csvFileName,
            csvData: csvData,
            dataLength: reportData.length
        }

    } catch (error) {
        console.log(error);
    }
}

const worker = new Worker('reportQueue', async (job) => {
    let { user } = job.data;
    const { csvData, csvFileName, dataLength } = await generateReportForUser(user);

    let today = new Date();
    let lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // await mailService(user.email, 'Your Weekly Report', `Report from ${lastWeek.toLocaleString()} to ${today.toLocaleString()} , total records: ${dataLength}`, null, csvFilePath, csvFileName);
    await mailService(user.email, 'Your Weekly Report', `Report from ${lastWeek.toLocaleString()} to ${today.toLocaleString()} , total records: ${dataLength}`, null, Buffer.from(csvData), csvFileName);

}, { connection: redisConnection });

// worker.on('completed', job => {
//     console.log(`report job ${job.id} has completed`);
// });

worker.on('failed', (job, err) => {
    console.log(`report worker : report job ${job.id} has failed with error ${err.message}`);
})