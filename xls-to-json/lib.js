var _ = require('underscore'),
    request = require('request').defaults({json: true}),
    http = require('http'),
    xmlParser = require('xml2json'),
    child = require('child_process').spawn
    ;
    
module.exports = http.createServer(function (req, res) {
  var xml = "", xls = "";
  xlhtml = child('xlhtml', ['-xml'])
  req.pipe(xlhtml.stdin)
  xlhtml.stdout.on('data', function(data) {
    console.log('dataz')
    xml += data;
  });
  xlhtml.stdout.on('error', function(yomammy) {
    console.log('xl err', yomammy)
  })
  xlhtml.on('exit', function() {
    res.statusCode = 202;
    res.end();
    var rows = xmlParser.toJson(xml, {object: true})
    request({uri: req.headers['x-callback'], method: "POST", body: {rows: rows}}, function(e,r,b) {
      if (e) console.log('error' + e);
    });    
  });
})