'use strict';

var later = require('later'),
    rek = require('rekuire'),
    logger = rek('lib/logger'),
    Job = rek('lib/job-manager/job'),
    jobsSchedule = later.parse.recur().on('09:30:00').time(),
    jobsConfig = [
        {
            name: 'CHECK_FOR_UPCOMING_EPISODES',
            jobFn: rek('lib/tvdb/tasks/check-for-upcoming-episodes')
        },
        {
            name: 'GET_NEW_EPISODES',
            jobFn: rek('lib/tvdb/tasks/get-new-episodes')
        },
        {
            name: 'GET_EPISODE_UPDATES',
            jobFn: rek('lib/tvdb/tasks/get-episode-updates')
        },
        {
            name: 'GET_SHOW_UPDATES',
            jobFn: rek('lib/tvdb/tasks/get-show-updates')
        }
    ],
    jobs = {};

later.date.localTime();

exports.JOB_NAMES = jobsConfig.reduce(function (initialValue, currentItem) {
    initialValue[currentItem.name] = currentItem.name;
    return initialValue;
}, {});

exports.configure = function () {
    jobsConfig.forEach(function (job) {
        jobs[job.name] = new Job(job.name, job.jobFn, jobsSchedule);
    });
};

exports.run = function (name) {
    var job = jobs[name];

    if (job) {
        return job.run()
    }

    logger.error('Attempted to run unknown job "%s"', name);
};