const express = require("express");
const dotEnv = require("dotenv").config({path: "./config.env"});
const config = require("config");
const winston = require("winston");
const app = express();


require('./startup/routes')(app);
require('./startup/db')();
require('./startup/logging')();


const port = process.env.PORT;
const server = app.listen(port, ()=>{
    winston.info(`the app is strated at port ${port}`);
});
module.exports = server;