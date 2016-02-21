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
            client.socket.write(["GET", key].join(" "));
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
