'use strict';

var later = require('later');

function Job (name, jobFn, schedule) {
    this.name = name;
    this.jobFn = jobFn;
    this.schedule = schedule;

    if (this.schedule) {
        later.setInterval(this.jobFn, this.schedule);
    }
}

Job.prototype.run = function() {
    return this.jobFn();
};

module.exports = Job;