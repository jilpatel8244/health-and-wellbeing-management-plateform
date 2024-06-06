const express = require('express');
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.set('io', io);

const router = require('./routes/index.route');
const path = require('path');
const socketHandler = require('./helpers/socket');
const cookieParser = require("cookie-parser");
require('./jobs/producers/reportProducer');
require('./jobs/workers/reportWorker');
require('./jobs/workers/reminderWorker');
require('./jobs/producers/reminderProducer');
require('dotenv').config();
require('./config/passport');

socketHandler(io);
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/', router);

app.set('trust proxy', true);
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`app is listening on port: ${PORT}`);
})