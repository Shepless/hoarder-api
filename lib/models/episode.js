'use strict';

var util = require('util'),
    moment = require('moment'),
    rek = require('rekuire'),
    Model = rek('lib/models/model');

function padNumber (number) {
    var numberStr = number + '';
    return (numberStr.length > 1) ? numberStr : '0' + numberStr;
}

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
                        this.firstAired >= (moment().add('days', -7).startOf('day').unix()) &&
                        this.firstAired <= (moment().endOf('day').unix()));
                    }
                })
                .then(function (episodes) {
                    return episodes.sort(function (episodeA, episodeB) {
                        return (episodeA.firstAired - episodeB.firstAired);
                    });
                });
        }
    },
    instanceMethods: {
        getSearchTerm: function () {
            if (this.show) {
                return util.format('%s s%se%s', this.show.title, padNumber(this.season), padNumber(this.number));
            }
        }
    }
});