'use strict';

const constants = require('../lib/constants');

const _ = require('lodash');
const EventEmitter = require('events');
const net = require('net');

class Subscriber extends EventEmitter {
    constructor(client, pattern) {
        super();

        const socket = new net.Socket();
        this.socket = socket;

        socket.connect(client.options.port, client.options.host, () => {
            if(pattern) {
                socket.write(`SUBSCRIBE ${pattern}`);
            } else {
                socket.write('SUBSCRIBE');
            }

            socket.write(constants.message.DELIMITER);
        });

        socket.on('error', (err) => {
            socket.destroy();
            this.emit('error', JSON.stringify({
                error: err.message
            }));
        });

        let buffer = '';

        socket.on('data', (data) => {
            buffer += data.toString();

            if (buffer.indexOf(constants.message.DELIMITER) === -1) {
                return;
            }

            const messages = _.compact(buffer.split(constants.message.DELIMITER));
            buffer = '';

            _.forEach(messages, (message) => {
                try {
                    if(JSON.parse(message).error) {
                        return this.emit('error', message);
                    } else {
                        return this.emit('message', message);
                    }
                } catch(err) {
                    return this.emit('message', message);
                }
            });
        });
    }

    close() {
        this.socket.end();
    }
}

module.exports = function(client) {
    return function(pattern) {
        return new Subscriber(client, pattern);
    };
};
