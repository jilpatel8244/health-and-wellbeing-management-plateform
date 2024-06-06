const { getReportDataBetweenSpecificDates } = require('../repositories/reminderLog.repository');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');
const mailService = require('../services/mailTransport.service');

exports.getReportDataBetweenSpecificDates = async (req, res) => {
    try {
        let { startDate, endDate } = req.body;

        let modifiedStartDate = new Date(startDate);
        modifiedStartDate.setHours(0, 0, 0, 0);

        let modifiedEndDate = new Date(endDate);
        modifiedEndDate.setHours(23, 59, 59, 999);

        let reportData = await getReportDataBetweenSpecificDates(modifiedStartDate, modifiedEndDate, req.user[0].id);

        // send report to mail in csv but this time use buffer
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

        await mailService(req.user[0].email, 'Your Medication Report', `Report from ${startDate} to ${endDate}, total records: ${reportData.length}`, null, csvFilePath, csvFileName);
        fs.unlinkSync(csvFilePath);

        return res.status(200).json({
            success: true,
            message: "Report sent successfully to your email",
            toast: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong while getting report data between two dates"
        })
    }
}
