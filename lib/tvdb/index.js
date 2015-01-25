'use strict';

var TVDB = require('node-tvdb'),
    Mappers = require.main.require('lib/tvdb/mappers'),
    Jobs = require.main.require('lib/tvdb/jobs');

module.exports = {
    Api: new TVDB('CDD1641BEBC78C60'),
    Mappers: Mappers,
    Jobs: Jobs
};