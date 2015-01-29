'use strict';

var rek = require('rekuire'),
    yargs = require('yargs').argv,
    Hapi = require('hapi'),
    routes = rek('lib/app/config/routes'),
    server = new Hapi.Server();

server.connection({ port: yargs.port || 3000, routes: { cors: true } });
server.route(routes);
module.exports = server;