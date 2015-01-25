'use strict';

var server = require.main.require('lib/app'),
    jobs = require.main.require('lib/jobs'),
    logger = require.main.require('lib/logger');

server.start(function () {
    logger.info('Hoarder server started');
    jobs.start();
});