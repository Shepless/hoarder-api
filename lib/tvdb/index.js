'use strict';

var TVDB = require('node-tvdb'),
    rek = require('rekuire'),
    Mappers = rek('lib/tvdb/mappers'),
    Jobs = rek('lib/tvdb/jobs');

module.exports = {
    Api: new TVDB('CDD1641BEBC78C60'),
    Mappers: Mappers,
    Jobs: Jobs
};