'use strict';

var rek = require('rekuire'),
    server = rek('lib/app'),
    jobs = rek('lib/jobs'),
    logger = rek('lib/logger'),
    foo = rek('lib/tvdb/jobs/get-new-episodes');

server.start(function () {
    logger.info('Hoarder server started');
    jobs.start();

    foo();
});