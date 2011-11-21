//untangle2.js

//just thought of a much more space-efficent way.

var traverse = require('traverser')
  , assert = require('assert')

exports.retangle = retangle
exports.untangle = untangle
exports.stringify = stringify
exports.parse = parse

function untangle(obj){
  var repeats = []
  var t = traverse(obj,{ branch: branch, pre: true })
    
  return t

  function branch (p){

    if(p.referenced && -1 == repeats.indexOf(p.value)){
      repeats.push(p.value)
      return  { '*@': p.index.repeated
              , '*=': p.copy() }
    }
    else if (p.reference){
      return { '*^': p.index.repeated }
    }
    if(p.value == null)
      return null//this is a bug in traverser.

    if(p.value['*$'] || p.value['*='] || p.value['*^'])
      throw new Error("object uses FORBIDDEN PROPERTY NAMES:"
        + " '*$','*=' & '*^' have a special meaning in untangle.")

    return p.copy()
  }
}
function retangle(obj){

  var repeats = []
  var t = traverse(obj,{ branch: branch})
    
  return obj

  function branch (p){
  
    if(!p.value){
      return p.value
    }

    if(p.value['*@'] !== undefined && p.value['*='] !== undefined){
      repeats[p.value['*@']] = p.value['*=']
      if(p.parent)
        p.parent[p.key] = p.value['*=']
      else
        obj = p.value['*=']
    }
    else if (p.value['*^'] !== undefined){
      p.parent[p.key] = repeats[p.value['*^']] //p.value.REPEATED
//      return repeats[REPEATED_INDEX]
    }
    return p.each()
  }
}

function stringify(obj,b,c){
  return JSON.stringify(untangle(obj),b,c)
}

function parse(obj,b,c){
  return retangle(JSON.parse(obj,b,c))
}


