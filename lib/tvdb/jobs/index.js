'use strict';

var rek = require('rekuire');

module.exports = {
    downloadEpisodeData: rek('lib/tvdb/jobs/download-episode-data'),
    downloadBanners: rek('lib/tvdb/jobs/download-banners'),
    getShowUpdates: rek('lib/tvdb/jobs/get-show-updates'),
    getEpisodeUpdates: rek('lib/tvdb/jobs/get-episode-updates'),
    getNewEpisodes: rek('lib/tvdb/jobs/get-new-episodes')
};