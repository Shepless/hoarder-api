'use strict';

var TVDB = require('node-tvdb'),
    Promise = require('bluebird'),
    rek = require('rekuire'),
    Mappers = rek('lib/tvdb/mappers'),
    Tasks = rek('lib/tvdb/tasks');

module.exports = {
    Api: Promise.promisifyAll(new TVDB('CDD1641BEBC78C60')),
    Mappers: Mappers,
    Tasks: Tasks
};