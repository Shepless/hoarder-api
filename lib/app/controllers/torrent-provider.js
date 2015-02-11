'use strict';

var rek = require('rekuire'),
    Models = rek('lib/models');

module.exports = {
    insert: function (request, reply) {
        new Models.TorrentProvider(request.payload)
            .insert()
            .then(reply);
    },

    getAll: function (request, reply) {
        Models.TorrentProvider.
            find()
            .then(reply)
            .catch(reply);
    },

    getById: function (request, reply) {
        Models.TorrentProvider
            .find({
                _id: request.params.id
            })
            .then(reply)
            .catch(reply);
    }
};