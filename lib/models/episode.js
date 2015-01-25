'use strict';

var Util = require('util'),
    DataStore = require('modella-nedb'),
    Validation = require('modella-validators'),
    moment = require('moment'),
    Config = require.main.require('lib/config'),
    EpisodeModel = require('modella')('Episode')
        .attr('_id')
        .attr('showId', {
            type: String,
            required: true
        })
        .attr('tvdbId', {
            type: Number,
            required: true
        })
        .attr('title', {
            type: String
        })
        .attr('overview', {
            type: String
        })
        .attr('season', {
            type: Number
        })
        .attr('number', {
            type: Number
        })
        .attr('screen', {
            type: String
        })
        .attr('firstAired', {
            type: Number
        })
        .attr('torrentId', {
            type: String
        })
        .attr('ftpTransferId', {
            type: String
        })
        .attr('downloadStatus', {
            type: Number,
            defaultValue: 0
        });

EpisodeModel.getUpcoming = function (callback) {
    EpisodeModel
        .query({
            $where: function () {
                return (this.downloadStatus === 0 &&
                this.firstAired >= (moment().unix()) &&
                this.firstAired <= (moment().add(7, 'days').unix()));
            }
        })
        .sort({firstAired: 1})
        .exec(callback);
};

EpisodeModel.use(new DataStore({
    filename: Util.format('%s/Episodes.db', Config.dataLocation),
    autoload: true
}));

EpisodeModel.use(Validation);

module.exports = EpisodeModel;