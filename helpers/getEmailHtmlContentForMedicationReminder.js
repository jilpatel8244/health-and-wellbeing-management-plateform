exports.getHtmlContentForMedicationReminder = (name, description, logId) => {
    try {
        return `<!DOCTYPE html>
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
    } catch (error) {
        console.log(error);
    }
}