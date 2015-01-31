'use strict';

var util = require('util'),
    fs = require('fs-extra'),
    path = require('path'),
    request = require('request'),
    Promise = require('bluebird'),
    rek = require('rekuire'),
    config = require('lib/config'),
    logger = rek('lib/logger'),
    baseUrl = 'http://www.thetvdb.com/banners/';

function scrapeImage(imageUrl) {
    return new Promise(function (resolve, reject) {
        if (!imageUrl) {
            resolve();
        }
        var fullImageUrl = util.format('%s%s', baseUrl, imageUrl),
            imagePath = path.join(config.imagesDirectory, imageUrl);

        fs.createFile(imagePath, function () {
            logger.info('Attempting to fetch image %s', fullImageUrl);

            request(fullImageUrl).pipe(fs.createWriteStream(imagePath)).on('close', function (error) {
                if (error) {
                    logger.error('Error fetching image %s', fullImageUrl);
                    return reject(error);
                }

                logger.info('Successfully saved image %s', fullImageUrl);
                return resolve(imagePath);
            });
        });
    });
}

module.exports = {
    getAll: function (show, episodes) {
        return this
            .getPoster(show)
            .then(this.getFanArt.bind(this))
            .then(this.getAllEpisodeScreens.bind(this, episodes))
            .then(function () {
                return [show, episodes];
            })
            .catch(function (error) {
                logger.error('Error fetching all images for show "%s" - %s', show.title, error.message);
            });
    },

    getPoster: function (show) {
        return scrapeImage(show.poster)
            .then(function () {
                return show;
            })
            .catch(function (error) {
                logger.error('Error fetching poster for show "%s" - %s', show.title, error.message);
            });
    },

    getFanArt: function (show) {
        return scrapeImage(show.fanArt)
            .then(function () {
                return show;
            })
            .catch(function (error) {
                logger.error('Error fetching fan art for show "%s" - %s', show.title, error.message);
            });
    },

    getAllEpisodeScreens: function (episodes) {
        var me = this;

        return Promise.map(episodes, function (episode) {
            return me.getEpisodeScreen(episode).then(function () {
                return episode;
            });
        }, { concurrency: 5 });
    },

    getEpisodeScreen: function (episode) {
        return scrapeImage(episode.screen)
            .then(function () {
                return episode;
            })
            .catch(function (error) {
                logger.error('Error fetching episode screen for episode "%s" - %s', episode.title, error.message);
            });
    }
};