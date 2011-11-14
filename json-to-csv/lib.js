var csv = require('csv')
  , http = require('http')
  , request = require('request')
  , stream = require('stream')
  ;

module.exports = http.createServer(function (req, res) {
  var json = ""
  var jsonStream = new stream.Stream();
  jsonStream.writeable = true;
  jsonStream.readable = true;
  
  csv()
  .fromStream(jsonStream)
  .toStream(res)
  
  req.on('data', function(data) { json += data })
  req.on('end', function() {
    jsonStream.emit('data', new Buffer(json))
    jsonStream.emit('end')
  })
})