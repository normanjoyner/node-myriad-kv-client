var net = require("net");
var _ = require("lodash");
var errors = require([__dirname, "..", "lib", "errors"].join("/"));
var constants = require([__dirname, "..", "lib", "constants"].join("/"));

module.exports = function(client){
    return function(fn){
        var socket = new net.Socket();

        socket.connect(client.options.port, client.options.host, function(){
            socket.write("FLUSH");
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
                var no_key = new errors.ENOKEY();
                var no_leader = new errors.ENOLEADER();
                var failed_proxy = new errors.EFAILEDPROXY();

                if(JSON.parse(data).error == no_key.message)
                    return fn(no_key);
                else if(JSON.parse(data).error == no_leader.message)
                    return fn(no_leader);
                else if(JSON.parse(data).error == failed_proxy.message)
                    return fn(failed_proxy);
                else
                    return fn(null, data);
            }
            catch(err){
                return fn(null, data);
            }
        });

    }
}
