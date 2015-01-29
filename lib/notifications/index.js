'use strict';

var rek = require('rekuire'),
    logger = require('lib/logger'),
    pushbullet = rek('lib/notifications/pushbullet');

module.exports = {
    send: function (title, body, type) {
        logger.info('Pushing message %s %s', title, body);
        pushbullet.send(title, body, type);
    }
};