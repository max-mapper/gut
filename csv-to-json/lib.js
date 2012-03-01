var vm = require('vm'),
    _ = require('underscore'),
    async = require('async'),
    csv = require('csv'),
    request = require('request').defaults({json: true}),
    http = require('http'),
    crypto = require('crypto'),
    stream = require('stream')
    ;

module.exports = http.createServer(function (req, res) {
  var headers, dataset;
  
  var jsonStream = new stream.Stream();
  jsonStream.writeable = true;
  jsonStream.readable = true;
  
  jsonStream.pipe(res)

  var separator = ''

  csv()
  .fromStream(req)
  .on('data',function(data, index) {
    if (!headers) {
      jsonStream.emit("data", "{\"docs\":[")
      headers = data;
      return;
    }
    var row = {}
    _(_.zip(headers, data)).each(function(tuple) {
      row[_.first(tuple)] = _.last(tuple)
    })
    jsonStream.emit('data', separator + JSON.stringify(row))
    separator = ','
  })
  .on('end', function(count) {
    jsonStream.emit('data', "]}")
    jsonStream.emit('end')
  })
  .on('error',function(error) {
    jsonStream.emit('error', error)
    console.log('csv error', error.message);
  });
})