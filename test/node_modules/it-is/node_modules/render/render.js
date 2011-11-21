//render2.js
//a better renderer using traverser

var traverser = require('traverser')
//  , inspect = require('sys').inspect
exports = module.exports = render

exports.Special = Special

function Special (string){
  if(!(this instanceof Special)) return new Special(string)
  this.toString = function(){return string}
}

var defaults = {
  indent: ''
, pad: ''
, padKey: ' '
, padSingle: ['', '']
, padJoin: [' ', ' ']
, padMulti: ['', '']
, padRoot: ['', '']
, joiner: ', '
, padJoinCompact: [' ', ' ']
, joinerCompact: ', '
, indentCompact: ''
, compactLength: false
, isCompact: function (object,p){
    if(!this.compactLength)
      return false
    var length = 0
    for(var i in object){
      if(object[i] && ('object' == typeof object[i] || 'function' == typeof object[i]))
        length += object[i].length || 5
      else
        length += ('' + object[i]).length + 2
    }
    return (length < this.compactLength)
  }
, string: function (string,p){
    return JSON.stringify(string)
  }
, value: function (value,p){
    if(p.value === undefined)
      return 'undefined'
    if('string' === typeof value){
      return this.string(value,p,function (z,x,c){return this.__proto__.string(z,x,c)})
    }
//      return "\"" + value.split('\n').join('\n ') + "\""

    return JSON.stringify(value)
  }
, key: function (key, p){
    return p.parent instanceof Array ? '' : (/^\w+$/(key) ? key : "'" + key + "'") + ":" + this.padKey
  }
, join: function (lines,p,def){
    var self = this
      , pad = lines.length ? self.pad : ''
      , joiner = this.joiner
      , padJoin = this.padJoin
      , indentation = this.indent

    if(!lines.length)
      return ''
    if(this.isCompact(lines,p)){
      joiner = this.joinerCompact
      padJoin = this.padJoinCompact
      indentation = this.indentCompact
    }

    return ( padJoin[0] + 
              lines.map 
              ( function (e) {return indent(e, indentation)} ).join (joiner)
            + padJoin[1])
  }
, reference: function (rendered,p){
  return 'var' + p.index.repeated
}
, referenced: function (index,p){
   return 'var' + index + '='
}
, surround: function (objString,p){
    if(p.value instanceof Date || p.value instanceof RegExp || p.value instanceof Special)
      return p.value.toString()
    if(p.value instanceof Array)
      return '[' + objString + ']'
    if(p.value === null)
      return 'null'
    if('function' == typeof p.value)
      return  p.value.toString().replace(/{(\n|.)+}$/,'{...}')
    return '{' + objString + '}'
  }
, multiline: function (objString,p){
  if(p.parent)
    return this.padMulti[0] + objString + this.padMulti[1]
  return this.padRoot[0] + objString + this.padRoot[1]
}
}
function render (obj, options){
  options = options || {}
  if(options.multi){
    options.indent = '  '
    options.joiner = '\n, '
/*    options.padSingle = ['','']
    options.padJoin = [' ',' ']*/
  }

  options.__proto__ = defaults
  return traverser(obj, {branch: branch, leaf: leaf, isBranch:isBranch, pre:true, iterator:options.iterator || 'map'})
  
  function isBranch(p){
    return ('function' == typeof p.value || 'object' == typeof p.value)
  }
  function branch (p){
    var key = (p.parent ? call('key',p.key,p) : '')    

    if(p.reference && ~p.index.repeated){
     var r = call('reference',p.index.repeated,p)
      if(r !== undefined) return key + r
    }
    var object = call('surround',call('join',p.iterate(),p),p)
      if(object && -1 !== object.indexOf('\n') )
        object = call('multiline',object,p)

    return key + (p.referenced ? call('referenced',p.index.repeated,p) : '') + object
  }
  function leaf (p){
    return (p.parent ? call('key',p.key,p) : '') + options.padSingle[0] + call('value',p.value,p) + options.padSingle[1]
  }
  function call(method,value,p){
    return options[method](value,p,function (x,y,z){return options.__proto__[method](x,y,z)})
  }
}

function indent (s, ch){
    return s.split('\n').join('\n' + ch)
}

render.json = function (renderme){
  return render(renderme,json)
}

/*
  I describe all these helpful styles in the readme, why not add them as functions?
*/

var settings = {
  cf:{joiner:"\n, ", indent: '  ', padMulti: ['\n','']}
, ct:{joiner:",\n  ", indent: '  ', padMulti: ['\n','']}
, cfbn: {joiner:"\n, ", indent: '  ', padJoin: ['\n  ','\n']}
, ctbn: {joiner:",\n  ", indent: '  ', padJoin: ['\n  ','\n']}
}
var json = {
      key: function (value,p){
          return p.parent instanceof Array ? '' : JSON.stringify(p.key) + ":" + this.padKey
        }
      , surround: function (objString,p,def){
          if('function' === typeof p.value)
            return 'null'
          if(p.value instanceof Date || p.value instanceof RegExp || 'function' == typeof p.value)
            return JSON.stringify(p.value)
          return def(objString,p)
         }
      , iterator: function (obj, func){
          var mapped = []
          Object.keys(obj).forEach(function (e){
            if('function' != typeof obj[e])
              mapped.push(func(obj[e],e))
          })
          return mapped
        }
      }

function merge (bottom,top){
  var n = {}
  for(var key in bottom){
    n[key] = bottom[key]
  }
  for(var key in top){
    n[key] = top[key]
  }
  return n
}

function loggify(func){
  func.log = function (){
    var args = [].slice.call(arguments)
    console.log.apply(null,args.map(function (x){return func(x)}))
  }
}

loggify(render)

//install modes
for(var key in settings){
  (function (key) {
    render.json[key] = function (renderme){return render(renderme, merge(json,settings[key]))}
    render[key] = function (renderme){return render(renderme, settings[key])}
    render.log[key] = function (renderme){return console.log(render(renderme, settings[key]))}
  })(key)
}

//this is the old api, I have a few modules somewhere that depend on this style
loggify(render.ct)
loggify(render.cf)
loggify(render.ctbn)
loggify(render.cfbn)
