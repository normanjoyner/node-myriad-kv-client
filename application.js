var _ = require("lodash");
var commands = require([__dirname, "commands"].join("/"));

function MyriadKVClient(options){
    var self = this;

    this.options = _.defaults(options, {
        host: "127.0.0.1",
        port: 2666
    });

    _.each(commands, function(fn, command){
        MyriadKVClient.prototype[command] = fn(self);
    });
}

module.exports = MyriadKVClient;
