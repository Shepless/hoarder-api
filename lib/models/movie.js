'use strict';

var util = require('util'),
    rek = require('rekuire'),
    DataStore = require('modella-nedb'),
    Config = rek('lib/config'),
    MovieModel = require('modella')('Movie')
        .attr('_id')
        .attr('title')
        .attr('wishListed');

MovieModel.prototype.foo = function () {
    console.log(MovieModel.find);
};

MovieModel.getWishList = function (cb) {
    return MovieModel.all({
        wishListed: true
    }, cb);
};

MovieModel.use(new DataStore({
    filename: util.format('%s/Movies.db', Config.dataLocation),
    autoload: true
}));

module.exports = MovieModel;