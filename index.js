'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const {Log} = require('./model');
const {PORT, CLIENT_ORIGIN, DATABASE_URL} = require('./config');

mongoose.Promise = global.Promise;
const app = express();
app.use(bodyParser.json());
app.use(cors({origin: CLIENT_ORIGIN})); // <- this isn't working when I deploy?
console.log(CLIENT_ORIGIN);
// app.use(cors);
// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
// });


app.get('/', (req, res, next) => {
  Log.findOne().then(log => {
    if (!log) return Log.create({logs: []});
    return log;
  }).then(log => res.json(log.logs))
    .catch(err => next(err));
});
app.post('/', (req, res, next) => {
  const {equ} = req.body;
  Log.findOne().then(log => {
    if (!log) return Log.create({logs: []});
    return log;
  }).then(log => {
    let logs;
    if (log.logs.length === 10) {
      logs = log.logs.slice(0, 9);
      logs.unshift(equ);
    }
    else {
      log.logs.unshift(equ);
      logs = [...log.logs];
    }
    return Log.findOneAndUpdate({logs});
  }).then(() => res.sendStatus(204))
    .catch(err => next(err));
});

function runServer(port = PORT) {
  const server = app.listen(port, () => {
    console.info(`App listening on port ${server.address().port}`);
  }).on('error', err => {
    console.error('Express failed to start');
    console.error(err);
  });
}

function dbConnect(url = DATABASE_URL) {
  return mongoose.connect(url, {useNewUrlParser: true})
    .catch(err => {
      console.error('Mongoose failed to connect');
      console.error(err);
    });
}

function dbDisconnect() {
  return mongoose.disconnect();
}

function dbGet() {
  return mongoose;
}

if (require.main === module) {
  dbConnect();
  runServer();
}
