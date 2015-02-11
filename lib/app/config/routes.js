'use strict';

var requireDirectory = require('require-directory'),
    controllers = requireDirectory(module, '../controllers');

module.exports = [
    {
        method: 'GET',
        path: '/images/{path*}',
        handler: controllers.image.get
    },
    {
        method: 'GET',
        path: '/shows',
        handler: controllers.show.getAll
    },
    {
        method: 'POST',
        path: '/shows/{tvdbId}',
        handler: controllers.show.insert
    },
    {
        method: 'DELETE',
        path: '/shows/{showId}',
        handler: controllers.show.destroy
    },
    {
        method: 'GET',
        path: '/shows/search/{title}',
        handler: controllers.show.searchTVDB
    },
    {
        method: 'GET',
        path: '/shows/{id}',
        handler: controllers.show.getWithAllEpisodes
    },
    {
        method: 'GET',
        path: '/episodes/{id}',
        handler: controllers.episode.getById
    },
    {
        method: 'GET',
        path: '/episodes/missing',
        handler: controllers.episode.getAllMissing
    },
    {
        method: 'GET',
        path: '/episodes/upcoming',
        handler: controllers.episode.getUpcoming
    },
    {
        method: 'GET',
        path: '/torrent-providers',
        handler: controllers['torrent-provider'].getAll
    },
    {
        method: 'GET',
        path: '/torrent-providers/{id}',
        handler: controllers['torrent-provider'].getById
    },
    {
        method: 'POST',
        path: '/torrent-providers',
        handler: controllers['torrent-provider'].insert
    }
];