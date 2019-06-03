'use strict';
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  logs: [String]
});

schema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});

module.exports = {Log: mongoose.model('Log', schema)};
