'use strict';

var Promise = require('bluebird'),
    rek = require('rekuire'),
    logger = rek('lib/logger'),
    Models = rek('lib/models');

module.exports = function () {
    var TVDB = rek('lib/tvdb');

    logger.info('Looking for new episodes from tvdb');

    // TODO: getWithEpisodes is only returning one show! FECK! Need to make it return all shows with episodes!
    return Models.Show
        .getWithEpisodes()
        .spread(function (show, episodes) {
            console.log(show.title, episodes.length);
            //return TVDB.Api.getSeriesAllById(show.tvdbId);
        });

    //TVDB.Api
    //    .getSeriesAllById()
    //    .then(function (updates) {
    //        return updates.Episode.map(function (tvdbId) {
    //            return parseInt(tvdbId);
    //        });
    //    })
    //    .then(function (tvdbIds) {
    //        return Models.Episode.find({
    //            tvdbId: {$in: tvdbIds}
    //        });
    //    })
    //    .then(function (episodes) {
    //        if (episodes.length > 0) {
    //            return Promise.map(episodes, function (episode) {
    //                return TVDB.Api.
    //                    getEpisodeById(episode.tvdbId)
    //                    .then(function (tvdbEpisode) {
    //                        return TVDB.Mappers.mapEpisode(episode.showId, tvdbEpisode);
    //                    })
    //                    .then(function (mappedEpisode) {
    //                        return episode.update(mappedEpisode);
    //                    })
    //                    .then(function (episode) {
    //                        logger.info('Successfully updated episode - ', episode.title);
    //                        return episode;
    //                    });
    //            }, {concurrency: 10});
    //        }
    //
    //        return episodes;
    //    })
    //    .catch(function (error) {
    //        logger.error('Failed to get tvdb episode updates - %s', error.message);
    //    });
};