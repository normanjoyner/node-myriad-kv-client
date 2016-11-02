'use strict';

const _ = require('lodash');
const net = require('net');

const constants = require('../lib/constants');

module.exports = function(client) {
    return function(pattern, fn) {
        const socket = new net.Socket();

        if(_.isFunction(pattern)) {
            fn = pattern;
            pattern = undefined;
        }

        socket.connect(client.options.port, client.options.host, () => {
            socket.write(['KEYS', pattern].join(' '));
            socket.write(constants.message.DELIMITER);
        });

        socket.on('error', (err) => {
            socket.destroy();
            return fn(err);
        });

        let buffer = '';

        socket.on('data', (data) => {
            buffer += data.toString();

            if (buffer.indexOf(constants.message.DELIMITER) === -1) {
                return;
            }

            socket.end();
            data = buffer.split(constants.message.DELIMITER)[0];

            if(_.isEmpty(data)) {
                return fn();
            }

            return fn(null, data.split(','));
        });
    };
};
