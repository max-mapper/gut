//asserters

var assert = require('assert')
  , traverser = require('traverser')
  , render = require('render')

exports = module.exports = {
  typeof: function (actual,expected,message){
    if(expected !== typeof actual)
      assert.fail(actual, expected, (actual + ' typeof ' + expected),'typeof',arguments.callee)
  }
, instanceof: function (actual,expected,message){
    if(!(actual instanceof expected))
      assert.fail(actual,expected, message,'instanceof',arguments.callee)
  }
, primitive: function (actual,message){
    if('function' == typeof actual || 'object' == typeof actual) 
      assert.fail(actual, 'must be number, string, boolean, or undefined'
        , message,'primitive',arguments.callee)
  }
, complex: function (actual,message){
    if('function' !== typeof actual && 'object' !== typeof actual) 
      assert.fail(actual,'must be object or function' 
        , message,'complex',arguments.callee)
  }
, function: function (actual,message){
    if('function' !== typeof actual) 
      assert.fail('function',actual 
        , message,'should be a',arguments.callee)
  }
, property: function (actual,property,value,message){
    if(!actual[property] && value == null)
    //checks that property is defined on actual, even if it is undefined (but not deleted)
      assert.fail(actual , property
        , message,'must have property',arguments.callee)
    //if value is a function, assume it is an assertion... apply it to actual[property]
    if('function' == typeof value)
      value(actual[property])
    else if (value != null) //else if value is exiting, check it's equal to actual[property]
      exports.equal(actual[property],value, message) 
      
    //if you want to assert a value is null or undefined,
    //use .property(name,it.equal(null|undefined))
  }
, has: has
, every: every
, throws: throws
, matches : function (input,pattern,message) {
    if(!pattern(input))
      assert.fail(input, pattern
      , (message || '')  + "RegExp " +
      + pattern + ' didn\'t match \'' + input+ '\' ' , 'matches',arguments.callee)
  //JSON doesn't write functions, (i.e. regexps,). make a custom message
  }
, like: function (actual,expected,respect,message) {
    respect = respect || {} 
    var op = 'like({' +
      [ respect.case ? 'case: true' : '' 
      , respect.whitespace ? 'whitespace: true' : '' 
      , respect.quotes ? 'quotes: true' : '' 
      ].join() 
      + '})'
      
    var a = '' + actual, e = '' + expected
    
    if(!respect.case) {
      a = a.toLowerCase()
      e = e.toLowerCase()
    }
    if(!respect.whitespace) {
      a = a.replace(/\s/g,'')
      e = e.replace(/\s/g,'')
    }
    if(!respect.quotes) {
      a = a.replace(/\"|\'/g,'\"')
      e = e.replace(/\"|\'/g,'\"')
    }

    if(a != e)
      assert.fail(a, e
      , message , 'like',arguments.callee)
  }
}
exports.__proto__ = assert

//man, prototypal inheritence is WAY better than classical!
//if only it supported multiple inheritence. that would be awesome.

function throws(tested,checker) {
  try{
    tested()
  } catch (err){
    if(checker)
      checker(err)
    return 
  }
  throw new assert.AssertionError ({message: "expected function" + tested + "to throw"})
}

function every (array,func){
  try{
  assert.equal(typeof array,'object',"*is not an object*")
  }catch(err){
    err.every = array
    err.index = -1
    throw err
  }
  for(var i in array){
    try {
      func.call(null,array[i])
    } catch (err) {
      if(!(err instanceof Error) || !err.stack){
        var n = new Error("non error type '" + err + "' thrown as error.")
        n.thrownValue = err
        err = n
      }
      err.every = array
      err.index = i
      throw err
    }
  }
}

function has(obj,props) {
  var pathTo = []
  
  //traverser has lots og functions, so it needs a longer stack trace.
  var orig = Error.stackTraceLimit 
  Error.stackTraceLimit = orig + 20

  try{
    assert.ok(obj,"it has no properties!")
    assert.ok(props)

    traverser(props,{leaf:leaf, branch: branch})
  } catch (err){
      if(!(err instanceof Error) || !err.stack) {
        var n = new Error("non error type '" + err + "' thrown as error.")
        n.thrownValue = err
        err = n
      }
      err.stack = 
        "it/asserters.has intercepted error at path: " 
          + renderPath(pathTo) + "\n" + err.stack
      err.props = props
      err.object = obj
      err.path = pathTo
      Error.stackTraceLimit = orig

      throw err
  }
  function leaf(p){
    pathTo = p.path
    var other = path(obj,p.path)
    if('function' == typeof p.value){
      p.value.call(p.value.parent,other)
    } 
    else {
    //since this is the leaf function, it cannot be an object.
    assert.equal(other,p.value)
    }
  }
  function branch (p){
    pathTo = p.path

    var other = path(obj,p.path)
    if('function' !== typeof p.value)
      exports.complex(other, other + " should be a type which can have properties")
    p.each()
  }
}

function path(obj,path,message){
  var object = obj
  for(i in path){
    var key = path[i]
    obj = obj[path[i]]
    if(obj === undefined) 
      assert.fail("expected " + render(object),renderPath(path),message,"hasPath",arguments.callee)
  }
  return obj
}

function renderPath(path){
  return path.map(function (e){
    if(!isNaN(e))
      return '[' + e + ']'
    if(/^\w+$/(e))
      return '.' + e
    return '[' + JSON.stringify(e) + ']' 
  }).join('')
}
