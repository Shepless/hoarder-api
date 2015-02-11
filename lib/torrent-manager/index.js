'use strict';

var rek = require('rekuire'),
    config = rek('lib/config'),
    Models = rek('lib/models'),
    EventManager = rek('lib/event-manager'),
    HdTorrents = rek('lib/torrent-manager/providers/hd-torrents');

exports.configure = function () {
    return Models.TorrentProvider
        .find()
        .each(function (torrentProvider) {
            //console.log(torrentProvider);
        })
        .then(function () {
            EventManager.on('CHECK_FOR_UPCOMING_EPISODES', function (episodes) {
                console.log('Searching for', episodes.length, 'torrent(s)...');

                episodes.forEach(function (episode) {
                    HdTorrents.searchForEpisode(episode);
                });
            });
        });
};