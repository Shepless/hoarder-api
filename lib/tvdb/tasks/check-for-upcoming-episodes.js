'use strict';

var util = require('util'),
    rek = require('rekuire'),
    moment = require('moment'),
    logger = rek('lib/logger'),
    Models = rek('lib/models'),
    EventManager = rek('lib/event-manager'),
    Notifications = rek('lib/notifications');

module.exports = function () {
    logger.info('Checking for upcoming episodes');

    return Models.Episode
        .getUpcoming()
        .each(function (episode) {
            return Models.Show.findOne({
                _id: episode.showId
            }).then(function (show) {
                episode.show = show;
                return episode;
            });
        })
        .then(function (episodes) {
            if (episodes.length === 0) {
                logger.info('No upcoming episodes found for %s', moment().format('dddd, MMMM Do YYYY'));
                return;
            }

            logger.info('Found %d upcoming episode(s)', episodes.length);
            EventManager.emit('CHECK_FOR_UPCOMING_EPISODES', episodes);
            return episodes;
        })
        .catch(function (error) {
            logger.error('Failed to get upcoming episodes:', error.message);
        });
};