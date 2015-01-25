'use strict';

var server = require.main.require('lib/app'),
    jobs = require.main.require('lib/jobs');

server.start(function () {
    jobs.start();
});