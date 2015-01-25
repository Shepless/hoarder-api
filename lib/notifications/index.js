'use strict';

var pushbullet = require.main.require('lib/notifications/pushbullet');

module.exports = {
    send: function (title, body, type) {
        pushbullet.send(title, body, type);
    }
};