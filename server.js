const express = require('express');
const router = require('./routes/index.route');
const path = require('path');
const cookieParser = require("cookie-parser");
const { checkAndSendReminders } = require('./jobs/reminderJob');
require('./jobs/worker');
const app = express();
require('dotenv').config();
require('./config/passport');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/', router);

checkAndSendReminders();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`app is listening on port: ${PORT}`);
})