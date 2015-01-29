'use strict';

var rek = require('rekuire'),
    logger = rek('lib/logger'),
    Models = rek('lib/models');

module.exports = function (show) {
    var TVDB = rek('lib/tvdb');

    return TVDB.Api
        .getSeriesAllById(show.tvdbId)
        .then(function (response) {
            return response.Episodes.map(function (episode) {
                return new Models.Episode(TVDB.Mappers.mapEpisode(show.primaryKey, episode));
            })
        })
        .then(function (episodes) {
            return episodes.map(function (episode) {
                return episode.insert();
            });
        })
        .catch(function (error) {
            logger.error(error);
        });
};