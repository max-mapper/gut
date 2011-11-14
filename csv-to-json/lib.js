var vm = require('vm'),
    _ = require('underscore'),
    async = require('async'),
    csv = require('csv'),
    request = require('request').defaults({json: true}),
    http = require('http'),
    crypto = require('crypto')
    ;

module.exports = http.createServer(function (req, res) {
  var headers, dataset, rows = [];

  csv()
  .fromStream(req)
  .on('data',function(data, index) {
    if (!headers) {
      headers = data;
      return;
    }
    var row = {}
    _(_.zip(headers, data)).each(function(tuple) {
      row[_.first(tuple)] = _.last(tuple)
    })
    rows.push(row);
  })
  .on('end', function(count) {
    res.statusCode = 202;
    res.end();
    headers = _.map(headers, function(head) { return {name: head} })
    request({uri: req.headers['x-callback'], method: "POST", body: {headers: headers, rows: rows}}, function(e,r,b) {
      if (e) console.log('upload error on ' + dataset + ': ' + e);
    });
  })
  .on('error',function(error){
    console.log("csv error!", error.message);
  });
})

// sandbox = {
//   animal: 'cat',
//   count: 2
// };
// vm.runInNewContext('count += 1; name = "kitty"', sandbox, 'myfile.vm');
