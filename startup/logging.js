require("winston-mongodb");
const winston = require("winston");
require("express-async-errors");

module.exports = function(params) {
    process.on('uncaughtException', (ex)=>{
        console.log("we got an uncaughtException");
        winston.error(ex.message, ex);
    });


    process.on('unhandledRejection', (ex)=>{
        console.log('got an unhandledRejection...');
        winston.error(ex.message, ex);
    });
    winston.add(new winston.transports.Console({colorize: true, prettyPrint: true}))
    winston.add(new winston.transports.File({filename: 'logfile.log', handleExceptions: true, handleRejections: true}));
    winston.add(new winston.transports.MongoDB({db: 'mongodb://localhost/vidly'}));
}