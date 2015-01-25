'use strict';

var moment = require('moment');

module.exports = {
    mapShow: function (tvdbData) {
        return {
            tvdbId: parseInt(tvdbData.id),
            imdbId: tvdbData.IMDB_ID,
            title: tvdbData.SeriesName,
            overview: tvdbData.Overview,
            airDay: tvdbData.Airs_DayOfWeek,
            airTime: tvdbData.Airs_Time,
            year: moment(tvdbData.FirstAired).year(),
            runtime: parseInt(tvdbData.Runtime),
            hasEnded: (tvdbData.Status === 'Ended'),
            poster: tvdbData.poster,
            fanArt: tvdbData.fanart
        };
    },

    mapEpisode: function (showId, tvdbData) {
        return {
            showId: showId,
            tvdbId: parseInt(tvdbData.id),
            title: tvdbData.EpisodeName || '',
            overview: tvdbData.Overview || '',
            season: parseInt(tvdbData.SeasonNumber),
            number: parseInt(tvdbData.EpisodeNumber),
            screen: '',
            firstAired: moment(tvdbData.FirstAired).unix(),
            torrentId: '',
            ftpTransferId: '',
            downloadStatus: 0
        };
    }
};