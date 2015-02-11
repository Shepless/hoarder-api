'use strict';

var util = require('util'),
    later = require('later'),
    rek = require('rekuire'),
    logger = rek('lib/logger'),
    Job = rek('lib/job-manager/job'),
    jobsConfig = [
        {
            name: 'CHECK_FOR_UPCOMING_EPISODES',
            jobFn: rek('lib/tvdb/tasks/check-for-upcoming-episodes'),
            schedule: later.parse.recur().every(10).second()
        },
        {
            name: 'GET_NEW_EPISODES',
            jobFn: rek('lib/tvdb/tasks/get-new-episodes'),
            schedule: later.parse.recur().on('09:30:00').time()
        },
        {
            name: 'GET_EPISODE_UPDATES',
            jobFn: rek('lib/tvdb/tasks/get-episode-updates'),
            schedule: later.parse.recur().on('09:30:00').time()
        },
        {
            name: 'GET_SHOW_UPDATES',
            jobFn: rek('lib/tvdb/tasks/get-show-updates'),
            schedule: later.parse.recur().on('09:30:00').time()
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
        jobs[job.name] = new Job(job.name, job.jobFn, job.schedule);
    });

    return this;
};

exports.get = function (name) {
    var job = jobs[name];

    if (job) {
        return job;
    }

    throw new Error(util.format('Could not find job "%s"', name));
};

exports.run = function (name) {
    try {
        var job = exports.get(name);
        return job.run();
    } catch (error) {
        logger.error('Error running job "%s" - "%s"', name, error.message);
    }
};