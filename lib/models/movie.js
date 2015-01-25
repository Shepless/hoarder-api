'use strict';

var Util = require('util'),
    DataStore = require('modella-nedb'),
    Config = require.main.require('lib/config'),
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
    filename: Util.format('%s/Movies.db', Config.dataLocation),
    autoload: true
}));

module.exports = MovieModel;