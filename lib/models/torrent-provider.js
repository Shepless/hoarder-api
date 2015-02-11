'use strict';

var rek = require('rekuire'),
    Model = rek('lib/models/model');

module.exports = Model.define({
    name: 'TorrentProvider',
    attrs: {
        type: {
            type: String,
            required: true
        },
        username: {
            type: String
        },
        password: {
            type: String
        }
    }
});