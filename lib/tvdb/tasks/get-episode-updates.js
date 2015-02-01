'use strict';

var Promise = require('bluebird'),
    rek = require('rekuire'),
    logger = rek('lib/logger'),
    Models = rek('lib/models');

module.exports = function () {
    var TVDB = rek('lib/tvdb');

    logger.info('Looking for episode updates from tvdb');

    return TVDB.Api
        .getUpdates(1000 * 60 * 60 * 24 * 7)
        .then(function (updates) {
            return updates.Episode.map(function (tvdbId) {
                return parseInt(tvdbId);
            });
        })
        .then(function (tvdbIds) {
            return Models.Episode.find({
                tvdbId: {$in: tvdbIds}
            });
        })
        .then(function (episodes) {
            if (episodes.length === 0) {
                logger.info('No episode updates found');
                return episodes;
            }

            return Promise.map(episodes, function (episode) {
                return TVDB.Api.
                    getEpisodeById(episode.tvdbId)
                    .then(function (tvdbEpisode) {
                        return TVDB.Mappers.mapEpisode(episode.showId, tvdbEpisode);
                    })
                    .then(function (mappedEpisode) {
                        return episode.update(mappedEpisode);
                    })
                    .then(TVDB.Tasks.downloadBanners.getEpisodeScreen)
                    .then(function (episode) {
                        logger.info('Successfully updated episode - ', episode.title);
                        return episode;
                    });
            }, {concurrency: 5});
        })
        .catch(function (error) {
            logger.error('Failed to get tvdb episode updates - %s', error.message);
        });
};