'use strict';

var rek = require('rekuire');

module.exports = {
    downloadEpisodeData: rek('lib/tvdb/tasks/download-episode-data'),
    downloadBanners: rek('lib/tvdb/tasks/download-banners'),
    getShowUpdates: rek('lib/tvdb/tasks/get-show-updates'),
    getEpisodeUpdates: rek('lib/tvdb/tasks/get-episode-updates'),
    getNewEpisodes: rek('lib/tvdb/tasks/get-new-episodes')
};