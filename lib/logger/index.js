'use strict';

var winston = require('winston'),
    path = require('path'),
    fs = require('fs'),
    logDirectoryPath = path.normalize(path.join(process.cwd(), '.logs')),
    logFilePath = path.normalize(path.join(logDirectoryPath, 'hoarder.log'));

if (!fs.existsSync(logDirectoryPath)){
    fs.mkdirSync(logDirectoryPath);
}

winston.add(winston.transports.File, {
    filename: logFilePath
});

module.exports = winston;