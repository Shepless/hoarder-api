'use strict';

var util = require('util'),
    later = require('later'),
    rek = require('rekuire'),
    moment = require('moment'),
    logger = rek('lib/logger'),
    Models = rek('lib/models'),
    Notifications = rek('lib/notifications');

module.exports = {
    schedule: later.parse.recur().on('09:30:00').time(),
    job: function () {
        logger.info('Checking for upcoming episodes');

        Models.Episode
            .getUpcoming()
            .map(function (upcomingEpisode) {
                return Models.Show.findOne({
                    _id: upcomingEpisode.showId
                }).then(function (show) {
                    return util.format('%s - S%dE%d (%s)',
                        show.title,
                        upcomingEpisode.season,
                        upcomingEpisode.number,
                        moment(upcomingEpisode.firstAired * 1000).format('dddd, MMMM Do'));
                });
            })
            .then(function (mappedUpcomingEpisodes) {
                if (mappedUpcomingEpisodes.length > 0) {
                    logger.info('Found %d upcoming episode(s)', mappedUpcomingEpisodes.length);
                    var notificationBody = mappedUpcomingEpisodes.join('\n');
                    Notifications.send('Hoarder - Episodes airing soon', notificationBody);
                }
            })
            .catch(function (error) {
                logger.error('Failed to get upcoming episodes:', error.message);
            });
    }
};