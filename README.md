# node-myriad-kv-client

## About

### Build Status
[![Build Status](https://drone.containership.io/api/badges/containership/node-myriad-kv-client/status.svg)](https://drone.containership.io/containership/node-myriad-kv-client)

### Description
A nodejs myriad-kv client

### Author
ContainerShip Developers - developers@containership.io

## Installation
`npm install myriad-kv-client`

## Usage

### Instantiation
Create a new MyriadKVClient
```javascript
var MyriadKVClient = require("myriad-kv-client");
var myriad_kv_client = new MyriadKVClient({
    host: "192.168.1.10", // interface where myriad is listening. defaults to 127.0.0.1
    port: 2666 // myriad management port. defaults to 2666
});
```

### Keys
Get all keys
```javascript
myriad_kv_client.keys(function(err, keys){
    if(err)
        throw err;

    console.log(keys);
});
```

Get a subset of keys, given a regex pattern
```javascript
myriad_kv_client.keys("a::[a-z]::d", function(err, keys){
    if(err)
        throw err;

    console.log(keys);
});
```

### Get
Get value for given key
```javascript
myriad_kv_client.get("mykey", function(err, value){
    if(err)
        throw err;

    console.log(value);
});
```

### Set
Set key and value
```javascript
myriad_kv_client.set("mykey", "myvalue", function(err){
    if(err)
        throw err;
});
```

### TTL
Get TTL value for given key
```javascript
myriad_kv_client.ttl("mykey", function(err, ttl){
    if(err)
        throw err;

    console.log(ttl);
});
```

Set TTL value for given key in ms
```javascript
myriad_kv_client.ttl("mykey", 60000, function(err){
    if(err)
        throw err;
});
```

### Stat
Get myriad stats
```javascript
myriad_kv_client.stat(function(err, stats){
    if(err)
        throw err;

    console.log(stats);
});
```

### Snapshot
Force leader to create a snapshot
```javascript
myriad_kv_client.snapshot(function(err){
    if(err)
        throw err;
});
```

### Delete
Delete given key
```javascript
myriad_kv_client.delete("mykey", function(err){
    if(err)
        throw err;
});
```

### Flushes
Flushes all keys / values
```javascript
myriad_kv_client.flush(function(err){
    if(err)
        throw err;
});
```

## Errors
There are various errors that myriad-kv-client may return:
* `EINSUFFINFO` - not enough parameters provided to function to successfully complete request
* `ENOKEY` - requested key was not found
* `EFAILEDPROXY` - failed to proxy request to leader node
* `ENOLEADER` - no leader node found

## Contributing
Pull requests and issues are encouraged!
