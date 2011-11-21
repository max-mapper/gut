var it = require('../it-is')
  , assert = require('assert')

exports ['chained assertions return nice toString()'] = function (){

  var examples = 
  [ [ it.ok(),'it.ok()'] 
  , [ it.ok().ifError(),'it.ok().ifError()'] 
  , [ it.ok(null),'it.ok(null)']
  , [ it.every(it.ok()),'it.every(it.ok())']
  , [ it.ok().ifError().has({ stack: it.typeof('string')} )
    , 'it.ok().ifError().has({ stack: it.typeof("string") })'] 
  ]
  examples.forEach(function (e){
    var v = e[0].toString()
    console.log(v)
    assert.equal(v,e[1])
  })
}
