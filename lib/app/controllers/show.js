'use strict';

var Models = require.main.require('lib/models'),
    TVDB = require.main.require('lib/tvdb');

module.exports = {
    searchTVDB: function (request, reply) {
        TVDB.Api.getSeries(request.params.title, function (error, shows) {
            if (shows.length) {
                reply(shows.map(function (show) {
                    return TVDB.Mappers.mapShow(show);
                }));
            } else {
                reply([TVDB.Mappers.mapShow(shows)]);
            }
        });
    },

    insert: function (request, reply) {
        TVDB.Api.getSeriesById(request.params.tvdbId, function (error, tvdbShow) {
            var show = new Models.Show(TVDB.Mappers.mapShow(tvdbShow));

            show.save(function (error, show) {
                reply(show);

                TVDB.Jobs.downloadEpisodeData(show.tvdbId());
            });
        });
    },

    getAll: function (request, reply) {
        Models.Show.all({}, function (err, shows) {
            reply(shows);
        });
    },

    getById: function (request, reply) {
        Models.Show.get({
            _id: request.params.id
        }, function (err, show) {
            reply(show);
        });
    },

    getWithAllEpisodes: function (request, reply) {
        Models.Show.getWithEpisodes({
            _id: request.params.id
        }, {}, function (error, show) {
            reply(show);
        });
    },

    getWithEpisode: function (request, reply) {
        Models.Show.getWithEpisodes({
            _id: request.params.showId
        }, {
            _id: request.params.episodeId
        }, function (error, show) {
            reply(show);
        });
    }
};