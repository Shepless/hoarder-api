'use strict';

var rek = require('rekuire'),
    Model = rek('lib/models/model'),
    EpisodeModel = rek('lib/models/episode');

module.exports = Model.define({
    name: 'Show',
    attrs: {
        tvdbId: {
            type: Number,
            required: true
        },
        imdbId: {
            type: String
        },
        title: {
            type: String
        },
        overview: {
            type: String
        },
        year: {
            type: Number
        },
        runtime: {
            type: Number
        },
        hasEnded: {
            type: Boolean,
            required: true
        },
        airDay: {
            type: String
        },
        airTime: {
            type: String
        },
        poster: {
            type: String
        },
        fanArt: {
            type: String
        }
    },
    staticMethods: {
        getWithEpisodes: function (showCriteria, episodeCriteria) {
            showCriteria = showCriteria || {};
            episodeCriteria = episodeCriteria || {};
            episodeCriteria.showId = showCriteria._id;

            return this
                .findOne(showCriteria)
                .then(function (show) {
                    if (!show) {
                        return [];
                    }

                    return EpisodeModel.find(episodeCriteria).then(function (episodes) {
                        return [show, episodes];
                    });
                })
                .spread(function (show, episodes) {
                    if (!show) {
                        return null;
                    }

                    show.episodes = episodes;
                    return show;
                });
        }
    },
    instanceMethods: {
        getAllEpisodes: function () {
            return EpisodeModel.find({
                showId: this.primaryKey
            });
        },
        getAllEpisodesForSeason: function (season) {
            return EpisodeModel.find({
                showId: this.primaryKey,
                season: season
            });
        },
        getEpisode: function (season, number) {
            return EpisodeModel.findOne({
                showId: this.primaryKey,
                season: season,
                number: number
            });
        },
        getByDownloadStatus: function (downloadStatus) {
            return EpisodeModel.find({
                showId: this.primaryKey,
                downloadStatus: downloadStatus
            });
        },
        toJSON: function () {
            var me = this,
                show = me._attrs;

            show.episodes = me.episodes;
            return show;
        }
    }
});