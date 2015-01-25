'use strict';

var util = require('util'),
    later = require('later'),
    async = require('async'),
    moment = require('moment'),
    logger = require.main.require('lib/logger'),
    Models = require.main.require('lib/models'),
    Notifications = require.main.require('lib/notifications');

function logError (error) {
    if (error) {
        logger.error('Failed to get upcoming episodes:', error.message);
        return true;
    }

    return false;
}

module.exports = {
    schedule: later.parse.text('every day at 10:00am'),
    job: function () {
        Models.Episode.getUpcoming(function (error, upcomingEpisodes) {
            if (logError(error)) {
                return;
            }

            async.map(upcomingEpisodes, function (upcomingEpisode, done) {
                Models.Show.get({
                    _id: upcomingEpisode.showId()
                }, function (error, show) {
                    if (logError(error)) {
                        return;
                    }

                    done(error, {
                        showTitle: show.title(),
                        season: upcomingEpisode.season(),
                        number: upcomingEpisode.number(),
                        firstAired: upcomingEpisode.firstAired()
                    });
                });
            }, function (error, episodes) {
                if (logError(error)) {
                    return;
                }

                if (episodes.length > 0) {
                    var notificationBody = episodes
                        .map(function (episode) {
                            return util.format('%s - S%dE%d (%s)',
                                episode.showTitle,
                                episode.season,
                                episode.number,
                                moment(episode.firstAired * 1000).format('dddd, MMMM Do'));
                        })
                        .join('\n');

                    Notifications.send('Hoarder - Episodes airing soon', notificationBody);
                }
            });
        });
    }
};