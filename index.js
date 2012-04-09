/*jshint node:true*/

var url  = require('url'),
    io   = require('socket.io'),
    VogueClient = require('vogue/lib/VogueClient').VogueClient,
    Watcher = require('vogue/lib/Watcher').Watcher;

module.exports = function (app, options) {
    'use strict';

    // setup vogue watcher
    var watcher = new Watcher(
            options.pubDir || __dirname + '/../../public',
            options.rewrite
        ),
        socket  = io.listen(app),
        prefix = options.prefix || '/_vogue';

    socket
        .on('connection', function (clientSocket) {
            watcher.addClient(new VogueClient(clientSocket, watcher));
        });

    // return middleware:
    return function (req, res, next) {

        // intercept call for js client:
        if (url.parse(req.url).pathname === prefix + '/vogue-client.js') {
            res.header('Content-Type', 'text/javascript');
            return res.sendfile(__dirname +
                '/node_modules/vogue/client/vogue-client.js');
        }

        // intercept text/html output and inject script tag:
        if (! res._vogue) {
            intercept('end');
            intercept('write');
            res._vogue = true;
        }
        next();

        function intercept (method, filter) {
            var orig = res[method];

            res[method] = function (data, encoding) {
                res[method] = orig;

                if (
                    this.header('content-type') &&
                    (this.header('content-type').indexOf('text/html') === 0)
                ) {
                    data = data.replace(
                        /<\/head>/,
                        '<script src="' +
                            prefix + '/vogue-client.js"></script></head>'
                    );
                }
                res[method](data, encoding);
            };
        }
    };
};