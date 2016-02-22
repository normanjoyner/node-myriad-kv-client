var net = require("net");
var _ = require("lodash");
var errors = require([__dirname, "..", "lib", "errors"].join("/"));
var constants = require([__dirname, "..", "lib", "constants"].join("/"));

module.exports = function(client){
    return function(pattern, fn){
        var socket = new net.Socket();

        if(_.isFunction(pattern)){
            fn = pattern;
            pattern = undefined;
        }

        socket.connect(client.options.port, client.options.host, function(){
            socket.write(["KEYS", pattern].join(" "));
            socket.write(constants.message.DELIMITER);
        });

        socket.on("error", function(err){
            return fn(err);
        });

        socket.on("data", function(data){
            socket.destroy();

            data = data.toString().split(constants.message.DELIMITER)[0];

            if(_.isEmpty(data))
                return fn();

            return fn(null, data.split(","));
        });
    }
}
