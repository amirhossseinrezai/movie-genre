const mongodb = require("mongoose");
const winston = require("winston");
const config = require('config');

module.exports = function () {
    const db = config.get('db');
    mongodb.connect(db, {useUnifiedTopology: true})
    .then(res=> winston.info(`Connected to ${db}...`));
}