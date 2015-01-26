'use strict';

var rek = require('rekuire'),
    moment = require('moment'),
    Models = rek('lib/models');

module.exports = {
    getById: function (request, reply) {
        Models.Episode.get({
            _id: request.params.episodeId
        }, function (error, episode) {
            reply(episode);
        });
    },

    getAllMissing: function (request, reply) {
        Models.Episode.get({
            downloadStatus: 0
        }, function (error, episodes) {
            reply(episodes);
        });
    },

    getUpcoming: function (request, reply) {
        Models.Episode.getUpcoming(function (error, episodes) {
            reply(episodes);
        });
    }
};