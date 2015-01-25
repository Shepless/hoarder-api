'use strict';

var Models = require.main.require('lib/models');

module.exports = function (tvdbSeriesId) {
    Models.Show.get({
        tvdbId: tvdbSeriesId
    }, function (error, show) {
        console.log(TVDB)

        var TVDB = require.main.require('lib/tvdb');

        TVDB.Api.getSeriesAllById(tvdbSeriesId, function (error, response) {
            response.Episodes
                .map(function (episode) {
                    return new Models.Episode(TVDB.Mappers.mapEpisode(show.primary(), episode));
                })
                .forEach(function (episode) {
                    episode.save();
                });
        });
    });
};