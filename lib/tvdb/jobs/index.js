'use strict';

var rek = require('rekuire');

module.exports = {
    downloadEpisodeData: rek('lib/tvdb/jobs/download-episode-data'),
    downloadBanners: rek('lib/tvdb/jobs/download-banners')
};