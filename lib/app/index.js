'use strict';

var rek = require('rekuire'),
    Hapi = require('hapi'),
    routes = rek('lib/app/config/routes'),
    server = new Hapi.Server();

server.connection({ port: 3000 });
server.route(routes);
module.exports = server;