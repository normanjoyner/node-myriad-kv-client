var _ = require("lodash");
var errors = require([__dirname, "..", "lib", "errors"].join("/"));
var constants = require([__dirname, "..", "lib", "constants"].join("/"));

module.exports = function(client){
    return function(key, fn){
        if(_.isFunction(key)){
            fn = key;
            key = undefined;
        }

        if(_.isUndefined(key))
            return fn(new errors.EINSUFFINFO());

        client.socket.connect(client.options.port, client.options.host, function(){
            client.socket.write(["DELETE", key].join(" "));
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

