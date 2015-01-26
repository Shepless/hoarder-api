'use strict';

var util = require('util'),
    rek = require('rekuire'),
    DataStore = require('modella-nedb'),
    Validation = require('modella-validators'),
    FriendlyErrors = require('modella-friendly-errors'),
    Config = rek('lib/config'),
    EpisodeModel = rek('lib/models/episode'),
    ShowModel = require('modella')('Show')
        .attr('_id')
        .attr('tvdbId', {
            type: Number,
            required: true
        })
        .attr('imdbId', {
            type: String,
            required: true
        })
        .attr('airDay')
        .attr('airTime')
        .attr('title', {
            type: String
        })
        .attr('overview', {
            type: String
        })
        .attr('year', {
            type: Number
        })
        .attr('runtime', {
            type: Number
        })
        .attr('hasEnded', {
            type: Boolean,
            required: true
        })
        .attr('poster', {
            type: String
        })
        .attr('fanArt', {
            type: String
        });

ShowModel.prototype.getEpisodes = function (criteria, callback) {
    criteria.showId = this.primary();
    EpisodeModel.all(criteria, callback);
};

ShowModel.prototype.getAllEpisodes = function (callback) {
    EpisodeModel.all({
        showId: this.primary()
    }, callback);
};

ShowModel.prototype.getAllEpisodesForSeason = function (season, callback) {
    EpisodeModel.all({
        showId: this.primary(),
        season: season
    }, callback);
};

ShowModel.prototype.getEpisode = function (season, number, callback) {
    EpisodeModel.all({
        showId: this.primary(),
        season: season,
        number: number
    }, callback);
};

ShowModel.prototype.getByDownloadStatus = function (downloadStatus, callback) {
    EpisodeModel.all({
        showId: this.primary(),
        downloadStatus: downloadStatus
    }, callback);
};

ShowModel.prototype.addEpisode = function (episode, callback) {
    var newEpisode = new EpisodeModel(episode);
    newEpisode.save(callback);
};

ShowModel.prototype.toJSON = function () {
    var show = this.attrs;

    if (this.episodes) {
        show.episodes = this.episodes.map(function (episode) {
            return episode.toJSON();
        });
    }

    return show;
};

ShowModel.getWithEpisodes = function (showCriteria, episodeCriteria, callback) {
    ShowModel.get(showCriteria, function (error, show) {
        if (!show) {
            return callback(error, show);
        }

        show.getEpisodes(episodeCriteria, function (error, episodes) {
            show.episodes = episodes;
            callback(error, show);
        });
    });
};

ShowModel.use(new DataStore({
    filename: util.format('%s/Shows.db', Config.dataLocation),
    autoload: true
}));

ShowModel.use(Validation);
ShowModel.use(FriendlyErrors);

module.exports = ShowModel;