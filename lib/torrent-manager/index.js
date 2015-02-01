'use strict';

var rek = require('rekuire'),
    EventManager = rek('lib/event-manager');

exports.configure = function () {
    EventManager.on('CHECK_FOR_UPCOMING_EPISODES', function (episodes) {
        console.log('handler --->',episodes);
    });
}