var net = require("net");
var _ = require("lodash");
var errors = require([__dirname, "..", "lib", "errors"].join("/"));
var constants = require([__dirname, "..", "lib", "constants"].join("/"));

module.exports = function(client){
    return function(key, fn){
        var socket = new net.Socket();

        if(_.isFunction(key)){
            fn = key;
            key = undefined;
        }

        if(_.isUndefined(key))
            return fn(new errors.EINSUFFINFO());

        socket.connect(client.options.port, client.options.host, function(){
            socket.write(["GET", key].join(" "));
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

            try{
                var error = new errors.ENOKEY();
                if(JSON.parse(data).error == error.message)
                    return fn(error);
                else
                    return fn(null, data);
            }
            catch(err){
                return fn(null, data);
            }
        });
    }
}
