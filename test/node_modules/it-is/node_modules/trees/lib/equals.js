//equals

var traverser = require('traverser')
  , style = require('style')
  , inspect = require ('sys').inspect
var styles = 
    { red : style().red.styler
    , green: style().green.styler }
  
exports.trees = trees
exports.graphs = graphs
exports.isTree = isTree
exports.isDag = isDag
exports.isCyclic = isCyclic
exports.topologyType = topologyType

function graphs (a,b){
  //check whether a == b, assuming a tree struture
  var diff = 
      { left:{}
      , right: {} 
      , eq: false
      }

  subgraph(a,b,diff.left)
  subgraph(b,a,diff.right)
  diff.eq = diff.left.eq && diff.right.eq

  diff.message = diff.left.message + (diff.eq ? ' == ' : ' != ') + diff.right.message
  return diff
}

function subgraph(self,other,diff){
  var matched = true

  var seen = []
  diff.message = traverser(self,{branch: branch, leaf: leaf, isBranch: traverser.isComplex, pre:true})
  

  function leaf(p){
    var x = styles.green
    if(p.value !== rGet(p.path,other)){
      matched = false
      x = styles.red
    }
      return x(key(p,p.value))
  }
  function branch(p){
    var ov = rGet(p.path,other)
      , index
      , x = styles.green
    if(ov === undefined) {
      matched = false 
      x = styles.red
    }
    if((ov instanceof Array) !== (p.value instanceof Array)) {
      matched = false 
      x = styles.red
    }

    index = seen.indexOf(ov)
    if(-1 == index)
      seen.push(ov)

    if(/*ref && */p.reference && index != p.index.seen) {
      x = styles.red
      matched = false
      return styles.red('var' + p.index.repeated)
    } else if (p.circular) {
      return styles.green('var' + p.index.repeated)
    }    return group(p,x)
  }

  if(diff)
    diff.eq = matched
  return matched
}

function trees (a,b){
  var diff = 
      { left:{}
      , right: {} 
      , eq: false
      }
  subtree(a,b,diff.left)
  subtree(b,a,diff.right)
  diff.eq = diff.left.eq && diff.right.eq
  diff.message = diff.left.message + (diff.eq ? ' == ' : ' != ') + diff.right.message
  return diff
}

function subtree(self,other,diff,allow,soft){
  var matched = true
    , x = styles.green
  diff.message = traverser(self,{branch: branch, leaf: leaf, isBranch: traverser.isComplex})
  
  function branch(p){
    var ov = rGet(p.path,other)
    if(ov === undefined){
      matched = false    
    }      
    if((ov instanceof Array) !== (p.value instanceof Array)) {
      matched = false 
      x = styles.red
    }
    if(p.circular)
      if(allow) {
        if(ov !== p.value)
          matched = false
        return '[circular]'
      } else
        throw new Error("infinite tree. cannot compare tree due to circular reference\n" 
                      + "self:" + inspect(self) + '\n'
                      + "other:" + inspect(other) )

/*    if(ov === p.value)
      return group(p,x)*/
    return group(p,x)
  }
  function leaf(p){
    var x = styles.green
      , ov = rGet(p.path,other)
    if((!soft && p.value !== ov) || (soft && p.value != ov)){
      matched = false
      x = styles.red
    }
    return x(key(p,p.value))
  }
  diff.eq = matched
  return matched
}


function rGet(path,obj){
  for (i in path){
    var key = path[i]
    obj = obj[key]
    if(!obj) 
      return obj
  }
  return obj
}

/**
* topologyType (obj)
*
* returns 'cyclic', 'dag', 'tree' if obj has circular references,
* or has repeated but non circular references, or just single references, respectively.
*/

function topologyType(obj){
  var struct = 'tree'
  traverser(obj,{branch: check, leaf: rFalse})

  function check(p){
    if(p.circular)
      return struct = 'cyclic'
    else {
      if(p.reference)
        struct = 'dag'
      return p.find()       
    }
  }
  return struct
}

function rFalse(){ return false; }

function isTree (obj){
  return topologyType(obj) === 'tree' }
function isDag (obj){
  return topologyType(obj) === 'dag' }
function isCyclic (obj){
  return topologyType(obj) === 'cyclic' }

/*
idea: immutable object datatypes... instead setting property a on x,
create new object y = {a: whatever} and set y.__proto__ = x
thus, x.a = first
but also, y.a = whatever
but otherwise y shares structure with x.

this will be handy for generating the properties object.
would need to specificially adapt this for Array style object, and probably forbid shift... 
and handle the order of keys...
*/
  
function key (p,rest){
  return (!p.parent || p.parent instanceof Array ? '' : p.key + ': ') + rest
}
function group (p,style){
  var b
    , pre =  '' 
    , post = ''

  if(p.referenced){
    pre = '(var' + p.index.repeated + '='
    post = ')' }

  if(p.value instanceof Array){
    b = ['[',']']    
  } else if (p.value instanceof Function) {
    b = ['[function ()',']']
  } else { b = ['{','}'] } 
  var items = p.map()
    , length = 0
    , join = ', '
    items.forEach(function (x){ length += ('' + x).length})
  return pre + key(p,style(b[0]) + items.join(join) + style(b[1])) + post
}

function format(s,ml){
  if(!/\n/.exec(s))
    return s
  if(ml === undefined && s.length > 80)
    ml = true
  s = s.replace(/\n/g,ml ? '\\n\n' : '\\n').split('\n')
  if(/\\u\d+\[\d+m/.exec(s[s.length - 1]))
    s.pop()
  
  return '\n( ' +
    s.map(function (x){
      return '\'' + x + '\''
    })
    .join('\n+ ') + ')\n'
}

exports.string = function (x,y){
  var diff = 
      { left:{}
      , right:{} 
      , eq: x == y
      }
  if(isNaN(x) && isNaN(y) && ('number' === typeof x || 'number' === typeof y)){
    diff.message = styles.red(x) + ' != ' + styles.red(y) + ' (this is correct js: WTF?)'
    diff.at = 0
    return diff
    }

  x = '' + x
  y = '' + y

  var l = '' + x, s = '' + y
  if(y.length > x.length){
    l = y; s = x
  }
  if(!diff.eq)
    for(i in l){
      if (y[i] !== x[i]){
        diff.left.message = 
          '' + styles.green(x.slice(0,i) || '') 
             + styles.red(x.slice(i,x.length) || '')
        diff.right.message = 
          '' + styles.green(y.slice(0,i) || '') 
             + styles.red(y.slice(i,y.length) || '')
             
        diff.message = 
            format(diff.left.message)
          + (diff.eq ? ' == ' : ' != ') 
          + format(diff.right.message)
        diff.at = i
        return diff
      }
    }
  diff.message = styles.green(x) + ' == ' + styles.green(y)
  return diff
}

exports.deep = function (left,right){
  var diff = 
      { left:{}
      , right: {} 
      , eq: false
      }
  subtree(left,right,diff.left,true,true)
  subtree(right,left,diff.right,true,true)
  diff.eq = diff.left.eq && diff.right.eq
  diff.message = diff.left.message + (diff.eq ? ' == ' : ' != ') + diff.right.message
  return diff
}

