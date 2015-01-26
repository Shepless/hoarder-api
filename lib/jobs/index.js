'use strict';

var later = require('later'),
    rek = require('rekuire'),
    checkForUpcomingEpisodes = rek('lib/jobs/check-for-upcoming-episodes');

later.date.localTime();

module.exports = {
    start: function () {
        later.setInterval(checkForUpcomingEpisodes.job, checkForUpcomingEpisodes.schedule);
    }
};