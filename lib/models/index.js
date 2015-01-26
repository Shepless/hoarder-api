var rek = require('rekuire'),
    Movie = rek('lib/models/movie'),
    Show = rek('lib/models/show'),
    Episode = rek('lib/models/episode');

module.exports = {
    Movie: Movie,
    Show: Show,
    Episode: Episode
};