'use strict';

var Promise = require('bluebird'),
    rek = require('rekuire'),
    logger = rek('lib/logger'),
    Models = rek('lib/models'),
    TVDB = rek('lib/tvdb');

module.exports = function () {
    logger.info('Looking for new episodes from tvdb');

    return Models.Show
        .find({
            hasEnded: false
        })
        .map(function (show) {
            return show.getAllEpisodes().then(function (episodes) {
                show.episodes = episodes;
                return show;
            });
        })
        .map(function (show) {
            return TVDB.Api.getSeriesAllById(show.tvdbId).then(function (tvdbData) {
                return {
                    show: show,
                    tvdbData: tvdbData
                }
            });
        }, {concurrency: 5})
        .each(function (showAndData) {
            if (showAndData.tvdbData.Episodes.length <= showAndData.show.episodes.length) {
                logger.info('No new episodes found for %s', showAndData.show.title);
                return showAndData;
            }

            var localEpisodes = showAndData.show.episodes,
                remoteEpisodes = showAndData.tvdbData.Episodes.map(function (remoteEpisode) {
                    return TVDB.Mappers.mapEpisode(showAndData.show.primaryKey, remoteEpisode);
                });

            var newEpisodesData = remoteEpisodes.filter(function (remoteEpisode) {
                return (localEpisodes.filter(function (localEpisode) {
                    return (localEpisode.tvdbId !== remoteEpisode.tvdbId);
                }).length === 0);
            });

            return Promise
                .map(newEpisodesData, function (newEpisodeData) {
                    return new Models.Episode(newEpisodeData).insert();
                })
                .then(TVDB.Tasks.downloadBanners.getAllEpisodeScreens.bind(TVDB.Tasks.downloadBanners))
                .then(function (newEpisodes) {
                    logger.info('Saved %d new episodes for %s', newEpisodes.length, showAndData.show.title);
                });
        })
        .catch(function (error) {
            logger.error('Error occurred finding new episodes from tvdb - %s', error.message);
        });
};