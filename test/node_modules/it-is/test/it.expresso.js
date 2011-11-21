
var it = require('../it-is')
  , assert = require('assert')
  , inspect = require('sys').inspect

exports ['make assertions about an object it(obj)'] = function (){
  var examples = 
  [ [ function (){ it(1).equal(1) } ,  true]  
  , [ function (){ it(0).equal(1) } ,  false]  
  ]

  examples.forEach(function (e){
    mightThrow(e[0],[],e[1])
  })
}

function mightThrow(func,args,shouldPass){
  var didThrow = false
  try {
    func.call(null,args)
  } catch (err) {
    if(!(err instanceof assert.AssertionError) || shouldPass)
      throw err
    didThrow = true
  }
  if(!didThrow)
    assert.equal 
      ( shouldPass, true
      , "expected " + func 
        + ' to throw, with args:' + JSON.stringify(args) )
}


exports ['make a asserting function with it.assertion(expected)'] = function (){
  var pass = true
    , fail = false
  var examples = 
  [ [1, it.equal(1), pass]
  , [0, it.equal(1), fail]
  , [0, it.notEqual(1), pass]
  , [1, it.notEqual(1), false]
  , ['ok', it.ok(), pass]
  , [null, it.ok(), fail]
  , [{a: 1}, it.has({a: 1}), pass]
  , [{a: false}, it.has({a: it.ok()}), fail]
  , [{a: false}, it.has({a: assert.ok}), fail] //will all any function with the value
  , [{a: true}, it.has({a: assert.ok}), pass]
  , [assert.ok, it.strictEqual(assert.ok), pass] //must use
  , [assert.ifError, it.strictEqual(assert.ok), fail]
  , [{}, it.has({a: {}}), fail] //should fail when it does not have an object...
  , [1, it.typeof('number'), pass]
  , [null, it.typeof('number'), fail]
  , [[1,2,3], it.every(it.typeof('number')), pass]
  , [[1,2,3,[]], it.every(it.typeof('number')), fail]
  ]

  examples.forEach(function (e){
    mightThrow(e[1],e[0],e[2])
  })
}


exports ['chain assertions'] = function (){
  var pass = true, fail = false
  var examples = 
  [ [1, it.equal(1).typeof('number').ok(), pass]
  , [true, it.ok().equal(1).strictEqual(true).notStrictEqual(1), pass ]
  ]
  examples.forEach(function (e){
    mightThrow(e[1],e[0],e[2])
  })
}

