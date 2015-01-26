'use strict';

var rek = require('rekuire'),
    foo = rek('hapi'),
    server = rek('lib/app'),
    jobs = rek('lib/jobs'),
    logger = rek('lib/logger');

server.start(function () {
    logger.info('Hoarder server started');
    jobs.start();
});