'use strict';

var Promise = require('bluebird'),
    rek = require('rekuire'),
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
            return Promise.map(episodes, function (episode) {
                return episode.insert().then(function () {
                    return episode;
                });
            });
        })
        .catch(function (error) {
            logger.error(error);
        });
};