'use strict';

var events = require('events'),
    eventEmiiter = new events.EventEmitter();

exports.configure = function () {

};

exports.on = eventEmiiter.on;

exports.emit = eventEmiiter.emit;