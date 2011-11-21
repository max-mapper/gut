
exports.__defineGetter__('untangle', function (){return require('./untangle')})
exports.__defineGetter__('sort', function (){return require('./sort')})
exports.__defineGetter__('equals', function (){return require('./equals')})


var traverser = require('traverser')
  , untangle = require('./untangle')


exports.branches = branches

function branches(tree){
  var b = []
  traverser(tree,{branch: branch})
  return b

  function branch(p){
    if(!p.reference){
      b.push(p.value)
      p.each() 
    }        
  }
}

exports.leaves = leaves

function leaves(tree){
  var l = []
  traverser(tree,{leaf: leaf,branch:branch})
  return l
  function leaf(p){
    l.push(p.value)  
  }
  function branch (p){
    if(!p.reference)
      p.each()
  }
}

exports.copy = copy

function copy (tree){
  return untangle.retangle(untangle.untangle(tree))
  //return traverser(tree,{branch: branch})
  
/*  function branch (p){
    if(!p.reference)
      return p.copy()
  }*/
}

exports.graphEqual = graphEqual
function graphEqual(actual,expected){
  return require('./equals').graphs(actual,expected)
}
