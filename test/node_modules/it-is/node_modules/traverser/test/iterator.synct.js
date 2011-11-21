//test iterator.sync.expresso

var sync = require('../iterators').sync
  , test = require('assert')
/*
  each
  find
  map
  copy
  min
  max
*/

function value (v,k,o){

  test.deepEqual(v,o[k])
  return v
}

exports.max = function (){
  var l = [1,234,543,44,5555,534,6,456]
    , r = sync.max(l,value)
    
  test.equal(r,5555)
}
exports.min = function (){
  var l = [234,543,1,44,5555,534,6,456]
    , r = sync.min(l,value)
    
  test.equal(r,1)
}
exports.copy = function (){
  var l = [234,543,1,44,5555,null,534,6,456]
    , o = {a: 123, b: 123, $: null, c:'sdf', l: l}
    , n = null
    , r = sync.copy(l,value)
    , r2 = sync.copy(o,value)
    , r3 = sync.copy(null,value)
    
    test.deepEqual(r,l)
    test.deepEqual(r2,o)
    test.deepEqual(r3,n)
}
exports.map = function (){
  var l = [234,543,1,44,5555,534,6,456]
    , o = {a: 123, b: 123, c:'sdf', l: l}
    , m = [123,123,'sdf',l]
    , r = sync.map(l,value)
    , r2 = sync.map(o,value)
    
    test.deepEqual(r,l)
    test.deepEqual(r2,m)
}
exports.each = function (){
  var l = [234,543,1,44,5555,534,6,456]
    , o = {a: 123, b: 123, c:'sdf', l: l}
    , count = 0
    sync.each(l,value)
    sync.each(o,value)

    sync.each(l,cnt)

    test.equal(count,8)
    count = 0

    sync.each(o,cnt)
    test.equal(count,4)
    
    function cnt(){
      count ++
    }
}
exports.find = function (){
  var l = [234,543,1,44,5555,'ffffffffffff',534,6,456]
    , o = {a: 123, b: 123, c:'sdf', l: l}
    , r = sync.find(l,isString)
    , r2 = sync.find(o,isString)

  test.equal(r,'ffffffffffff')
  test.equal(r2,'sdf')

  function isString (v,k,o){
    value(v,k,o)
    return ('string' == typeof v)
  }
}

