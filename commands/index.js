module.exports = {
    get: require([__dirname, "get"].join("/")),
    delete: require([__dirname, "delete"].join("/")),
    flush: require([__dirname, "flush"].join("/")),
    keys: require([__dirname, "keys"].join("/")),
    set: require([__dirname, "set"].join("/")),
    snapshot: require([__dirname, "snapshot"].join("/")),
    stat: require([__dirname, "stat"].join("/")),
    ttl: require([__dirname, "ttl"].join("/"))
}
