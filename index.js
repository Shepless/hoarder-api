'use strict';

var rek = require('rekuire'),
    config = rek('lib/config'),
    app = rek('lib/app'),
    jobManager = rek('lib/job-manager'),
    eventManager = rek('lib/event-manager'),
    notifications = rek('lib/notifications'),
    torrentManager = rek('lib/torrent-manager'),
    logger = rek('lib/logger');

app.start(function () {
    if (config.isHoarderConfigured) {
        jobManager.configure();
        eventManager.configure();
        torrentManager.configure();
        notifications.configure();

        //jobManager.run(jobManager.JOB_NAMES.CHECK_FOR_UPCOMING_EPISODES);
        //JobManager.run(JobManager.JOB_NAMES.GET_NEW_EPISODES);
        //JobManager.run(JobManager.JOB_NAMES.GET_SHOW_UPDATES);
        //JobManager.run(JobManager.JOB_NAMES.GET_EPISODE_UPDATES);
    } else {
        logger.info('Hoarder jobs not running - configuration is required');
        config.isHoarderConfigured = true;
        config.update();
    }

    logger.info('Hoarder server started');
});