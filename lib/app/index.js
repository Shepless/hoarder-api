'use strict';

var Hapi = require('hapi'),
    routes = require.main.require('lib/app/config/routes'),
    server = new Hapi.Server();

server.connection({ port: 3000 });
server.route(routes);
module.exports = server;