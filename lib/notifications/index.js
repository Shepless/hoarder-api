'use strict';

var util = require('util'),
    moment = require('moment'),
    rek = require('rekuire'),
    EventManager = rek('lib/event-manager'),
    logger = rek('lib/logger'),
    pushbullet = rek('lib/notifications/pushbullet');

module.exports = {
    configure: function () {
        // TODO: Make this dynamic from user saved preferences
        var me = this;

        EventManager.on('CHECK_FOR_UPCOMING_EPISODES', function (episodes) {
            me.send('Hoarder - Episodes airing soon', episodes
                .map(function (episode) {
                    return util.format('%s - S%dE%d (%s)',
                        episode.show.title,
                        episode.season,
                        episode.number,
                        moment(episode.firstAired * 1000).format('dddd, MMMM Do'));
                })
                .join('\n'));
        });
    },
    send: function (title, body, type) {
        logger.info('Pushing message %s %s', title, body);
        pushbullet.send(title, body, type);
    }
};