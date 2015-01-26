'use strict';

var rek = require('rekuire'),
    pushbullet = rek('lib/notifications/pushbullet');

module.exports = {
    send: function (title, body, type) {
        pushbullet.send(title, body, type);
    }
};