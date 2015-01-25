'use strict';

var later = require('later'),
    checkForUpcomingEpisodes = require.main.require('lib/jobs/check-for-upcoming-episodes');

later.date.localTime();

module.exports = {
    start: function () {
        later.setInterval(checkForUpcomingEpisodes.job, checkForUpcomingEpisodes.schedule);
    }
};