'use strict';

var util = require('util'),
    events = require('events'),
    later = require('later');

function Job (name, jobFn, schedule) {
    this.name = name;
    this.jobFn = jobFn;
    this.schedule = schedule;

    if (this.schedule) {
        later.setInterval(this.jobFn, this.schedule);
    }
}

util.inherits(Job, events.EventEmitter);

Job.prototype.run = function() {
    var me = this;

    return this.jobFn().then(function (data) {
        me.emit(me.name, data);
        return data;
    });
};

module.exports = Job;