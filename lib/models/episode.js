'use strict';

var moment = require('moment'),
    rek = require('rekuire'),
    Model = rek('lib/models/model');

module.exports = Model.define({
    name: 'Episode',
    attrs: {
        showId: {
            type: String,
            required: true
        },
        tvdbId: {
            type: Number,
            required: true
        },
        title: {
            type: String
        },
        overview: {
            type: String
        },
        season: {
            type: Number
        },
        number: {
            type: Number
        },
        screen: {
            type: String
        },
        firstAired: {
            type: Number
        },
        torrentId: {
            type: Number
        },
        ftpTransferId: {
            type: Number
        },
        downloadStatus: {
            type: Number
        }
    },
    staticMethods: {
        getUpcoming: function () {
            return this
                .find({
                    $where: function () {
                        return (this.downloadStatus === 0 &&
                        this.firstAired >= (moment().startOf('day').unix()) &&
                        this.firstAired <= (moment().endOf('day').unix()));
                    }
                })
                .then(function (episodes) {
                    return episodes.sort(function (episodeA, episodeB) {
                        return (episodeA.firstAired - episodeB.firstAired);
                    });
                });
        }
    }
});