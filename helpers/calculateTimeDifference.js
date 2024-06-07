exports.calculateTimeDifference = (createdAt) => {
    // 1. Convert database datetime string to milliseconds since epoch
    const createdAtInMilliseconds = Date.parse(createdAt);

    // 2. Add 10 minutes to created_at time in milliseconds
    const tenMinutesLater = createdAtInMilliseconds + (2 * 60 * 1000);

    // 3. Get current time in milliseconds
    const currentTime = Date.now();

    // 4. Calculate the difference
    const difference = currentTime - tenMinutesLater;

    console.log(difference);

    // 5. Handle positive or negative difference
    if (difference > 0) {
        return true;
    } else {
        return false;
    }
}
