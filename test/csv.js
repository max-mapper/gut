/**
 * integration tests for csv.js
 * run via 'npm test'. no output means everything passed!
 */
 
var it = require('it-is')
  , _ = require('underscore')
  , request = require('request')
  , http = require('http')
  , asyncTester = require('./test-helper')
  , csvPipe = require('../csv')
  ;

var receiver = function(callback) {
  return http.createServer(function (req, res) {
  var incoming = "";
  req
    .on('data', function(data) { incoming += data }) 
    .on('end', function() {
      callback(incoming);
      res.statusCode = 200;
      res.end();
    })
    .on('error',function(error) {
      throw new Error("receiver error!", error);
    });
  })
}

function waitForData(callback) {
  var start = new Date();
  if( (new Date() - start) > 5000 ) callback(true, "took too long")
  if (receivedData) {
    callback(false, false, receivedData)
  } else {
    setTimeout(function() { waitForData(callback) }, 100)
  }
}

var csvReceiver, csvData = "name,appearance\nchewbacca,hairy", jsonData = {name: "chewbacca", appearance: "hairy"}, receivedData;

asyncTester.run([
  {
    description: "parse csv",
    setup: [
      function(next) {
        csvPipe.listen(8000, 'localhost')
        csvReceiver = receiver(function(data) { receivedData = data })
        csvReceiver.listen(9000, 'localhost')
        next()
      }
    ],
    requests: {
      send: function(cb) { 
        request({
          uri: 'http://localhost:8000',
          headers: {'content-type': 'text/csv', 'x-callback': 'http://localhost:9000'},
          body: csvData
        }, cb)
      },
      received: function(cb) { waitForData(cb) }
    },
    asserts: function(err, results, done) {
      done(null, "parse csv");
     },
     cleanup: [
       function(next) { 
         csvReceiver.close()
         csvPipe.close()
         receivedData = false
         next()
       }
     ]
  }
])