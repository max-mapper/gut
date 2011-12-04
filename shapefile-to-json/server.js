var http = require('http');
var spawn = require('child_process').spawn;
var fs = require('fs');
var toJSON = require('shp2json');

http.createServer(function (req, res) {
    res.setHeader('content-type', 'application/json');
    
    var stream = toJSON(req);
    stream.on('error', function (err) {
        res.setHeader('content-type', 'text/plain');
        res.statusCode = 500;
        res.end(err + '\n');
    });
    stream.pipe(res);
}).listen(process.argv[2] || 80);
