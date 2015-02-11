var rek = require('rekuire');

module.exports = {
    Show: rek('lib/models/show'),
    Episode: rek('lib/models/episode'),
    TorrentProvider: rek('lib/models/torrent-provider')
};