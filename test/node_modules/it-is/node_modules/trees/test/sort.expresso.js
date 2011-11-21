//sort.expresso

/*
  test topographical sort
*/

var sort = require('trees').sort
  , assert = require('assert')
  , log = console.log

function checkSort(graph){

  var deps = sort(graph)
    , seen = []
    
    log(deps)
  deps.forEach(each)

  function each(e){
    var module = e[0]
      , requires = e[1]
    
    requires.forEach(checkSeen)
    
    function checkSeen(s){
      if(!~seen.indexOf(s))
        assert.fail(seen,s, null, "is a member of", arguments.callee)
    }
    seen.push(module)  
  }
}

exports ['can topographical sort'] = function (){
var a
  , graph = 
{ 'remap/test/.examples/e': 
  { 'remap/test/.examples/a': a = {}
  , 'remap/test/.examples/d': 
    {'remap/test/.examples/a': a}
  , 'remap/test/.examples/b': 
    {'remap/test/.examples/c': {} } } }

  checkSort(graph)
}

exports ['can topographical sort2'] = function (){
var var0,var1,var2,var3,
 graph = 
{ 'remap/modules': { 'path': var0 = {}
  , 'remap/resolve': var1 = {'remap/common': var2 = {}, path: var0}
  , 'remap/loading': { 'remap/common': var2
    , 'remap/module': {'path': var0, 'remap/common': var2}
    , 'remap/resolve': var1
    , 'assert': var3 = {} }
  , 'assert': var3 } }

  checkSort(graph)
}

exports ['empty tree returns empty list'] = function (){
  assert.deepEqual(sort({}),[])
}
