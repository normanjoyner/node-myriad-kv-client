var _ = require("lodash");
var errors = require([__dirname, "..", "lib", "errors"].join("/"));
var constants = require([__dirname, "..", "lib", "constants"].join("/"));

module.exports = function(client){
    return function(pattern, fn){
        if(_.isFunction(pattern)){
            fn = pattern;
            pattern = undefined;
        }

        client.socket.connect(client.options.port, client.options.host, function(){
            client.socket.write(["KEYS", pattern].join(" "));
            client.socket.write(constants.message.DELIMITER);
        });

        client.socket.on("error", function(err){
            return fn(err);
        });

        client.socket.on("data", function(data){
            client.socket.destroy();

            data = data.toString().split(constants.message.DELIMITER)[0];

            if(_.isEmpty(data))
                return fn();

            return fn(null, data);
        });
    }
}
