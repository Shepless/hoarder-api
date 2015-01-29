'use strict';

var rek = require('rekuire'),
    moment = require('moment'),
    Models = rek('lib/models');

module.exports = {
    getById: function (request, reply) {
        Models.Episode
            .get({
                _id: request.params.episodeId
            })
            .then(reply)
            .catch(reply);
    },

    getAllMissing: function (request, reply) {
        Models.Episode
            .get({
                downloadStatus: 0
            })
            .then(reply)
            .catch(reply);
    },

    getUpcoming: function (request, reply) {
        Models.Episode.getUpcoming().then(reply);
    }
};