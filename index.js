'use strict';

var rek = require('rekuire'),
    JobManager = rek('lib/job-manager'),
    logger = rek('lib/logger'),
    server = rek('lib/app');

server.start(function () {
    logger.info('Hoarder server started');

    JobManager.configure();
    JobManager.run(JobManager.JOB_NAMES.CHECK_FOR_UPCOMING_EPISODES);
    JobManager.run(JobManager.JOB_NAMES.GET_NEW_EPISODES);
    JobManager.run(JobManager.JOB_NAMES.GET_SHOW_UPDATES);
    JobManager.run(JobManager.JOB_NAMES.GET_EPISODE_UPDATES);
});