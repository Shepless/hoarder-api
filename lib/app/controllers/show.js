'use strict';

var rek = require('rekuire'),
    Models = rek('lib/models'),
    TVDB = rek('lib/tvdb');

module.exports = {
    searchTVDB: function (request, reply) {
        TVDB.Api
            .getSeries(request.params.title)
            .then(function (shows) {
                if (shows) {
                    if (shows.length) {
                        return shows.map(function (show) {
                            return TVDB.Mappers.mapShow(show);
                        });
                    } else {
                        return [TVDB.Mappers.mapShow(shows)];
                    }
                }

                return [];
            })
            .then(reply);
    },

    destroy: function (request, reply) {
        Models.Show
            .remove({ _id: request.params.showId })
            .then(Models.Episode.remove.bind(Models.Episode, { showId: request.params.showId }, { multi: true }))
            .then(reply)
            .catch(reply);
    },

    insert: function (request, reply) {
        TVDB.Api
            .getSeriesById(request.params.tvdbId)
            .then(function (tvdbShow) {
                return TVDB.Mappers.mapShow(tvdbShow);
            })
            .then(function (mappedShow) {
                return new Models.Show(mappedShow).insert().then(function (show) {
                    TVDB.Tasks.downloadEpisodeData(show).then(function (episodes) {
                        TVDB.Tasks.downloadBanners.getAll(show, episodes);
                    });
                    return show;
                });
            })
            .then(reply)
            .catch(reply);
    },

    getAll: function (request, reply) {
        Models.Show.find().then(reply).catch(reply);
    },

    getById: function (request, reply) {
        Models.Show.findOne({
            _id: request.params.id
        }).then(reply).catch(reply);
    },

    getWithAllEpisodes: function (request, reply) {
        Models.Show
            .getWithEpisodes({
                _id: request.params.id
            })
            .then(reply)
            .catch(reply);
    },

    getWithEpisode: function (request, reply) {
        Models.Show
            .getWithEpisodes({
                _id: request.params.showId
            }, {
                _id: request.params.episodeId
            })
            .then(reply);
    }
};