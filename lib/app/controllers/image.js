'use strict';

var path = require('path'),
    fs = require('fs-extra'),
    rek = require('rekuire'),
    config = rek('lib/config');

module.exports = {
    get: function (request, reply) {
        var fullImagePath = path.normalize(path.join(config.imagesDirectory, request.params.path));

        fs.exists(fullImagePath, function (exists) {
            if (!exists) {
                return reply();
            }

            reply.file(fullImagePath);
        });
    }
};