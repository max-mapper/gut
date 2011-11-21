//traverser.sync
var curry = require('curry')
  , sync = require('./iterators').sync

module.exports = traverse
exports.isObject = isObject
exports.isComplex = isComplex

function isObject (props){
  return ('object' === typeof props.value)
}
var complex =
  { 'function': true
  , 'object': true
  , 'string': false
  , 'boolean': false
  , 'number': false
  , 'undefined': false
}
function isComplex (props){
  return props.value && complex[typeof props.value]
}

function traverse (object,opts){

  if('function' == typeof opts)
    opts = {each: opts}

  if (opts.each)
    opts.leaf = opts.branch = opts.each
  if(!opts.leaf)
    opts.leaf = function (p){return p.value}
  if(!opts.branch)
    opts.branch = function (p){return p.iterate()}

  if(!opts.isBranch)
    opts.isBranch = exports.isObject

  if('string' == typeof opts.iterator){
    var s = opts.iterator
    opts.iterator = sync[s]
    
    if (!opts.iterator)
      throw new Error('\'' + s + '\' is not the name of a traverse iterator.'
        + ' try one of [' + Object.keys(sync) + ']')
    }

  var props = 
        { parent: null
        , key: null
        , value: object
        , circular: false
        , reference: false
        , path: [] 
        , seen: []
        , ancestors: []
        , iterate: curry([opts.iterator],iterate)
        }

  Object.keys(sync).forEach(function(key){
    var func = sync[key]
    props[key] = curry([func],iterate)
  })

  if(opts.pre){
    props.referenced = false
    var refs = []
    traverse(object, {branch: check})
    
    function check(p){
      if(p.reference)
        refs.push(p.value)
      else
        p.each()
    }

    props.repeated = refs
  }
        
  function iterate(iterator){
    var _parent = props.parent
      , _key = props.key
      , _value = props.value
      , returned 

    props.ancestors.push(props.value)
    props.parent = props.value
    returned = iterator(props.value,makeCall)

    props.key = _key
    props.value = _value
    props.parent = _parent

    props.ancestors.pop()
    return returned
  }

  function makeCall(value,key){
    var r

    if(key !== null)
      props.path.push(key)
    props.key = key
    props.value = value

    if(opts.isBranch(props)){
      var index = 
        { seen: props.seen.indexOf(props.value)
        , ancestors: props.ancestors.indexOf(props.value) }
        
        if(opts.pre){
          index.repeated = props.repeated.indexOf(props.value)
          props.referenced = (-1 !== index.repeated)
        }

      props.index = index
    
      props.circular = (-1 !== index.ancestors)
      ;(props.reference = (-1 !== index.seen)) 
        || props.seen.push(value)

      r = opts.branch(props)
    } else {
      r = opts.leaf(props)
    }
    if(key !== null)
      props.path.pop()
    return r
  }
  
 return makeCall(object,null)
}

