//traverser2
var curry = require('curry')
  , sync = require('./iterators').sync
  , async = require('./iterators').async

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
  return complex[typeof props.value]
}
function defaultLeaf(p){
  return p.value
}
function defaultBranch (p){
  return p.iterate()
}
function defaultLeafAsync(p,next){
  next(p.value)
}
function defaultBranchAsync (p,next){
  //log('DEFAULT BRANCH ASYNC')
  p.iterate(next)
}

function traverse (object,opts,done){

  if('function' == typeof opts)
    opts = { each: opts
           , done: done }

  opts.async = !!(opts.done)//async mode if done is defined.

  if (opts.each)
    opts.leaf = opts.branch = opts.each
  if(!opts.leaf)
    opts.leaf = opts.async ? defaultLeafAsync : defaultLeaf
  if(!opts.branch)
    opts.branch = opts.async ? defaultBranchAsync : defaultBranch

  if(!opts.isBranch)
    opts.isBranch = exports.isObject

  var cont = opts.done ? async : sync

  if(!opts.iterator)
    opts.iterator = 'map'

  if('string' == typeof opts.iterator){
    var s = opts.iterator
    opts.iterator = cont[s]
    
    if (!opts.iterator)
      throw new Error('\'' + s + '\' is not the name of a traverse iterator.'
        + ' try one of [' + Object.keys(cont) + ']')
    }

  function iterate(iterator,done){
    var _parent = props.parent
      , _key = props.key
      , _value = props.value
      , _index = props.index
      , _referenced = props.referenced
      , r
    //log('DONE()',done)
    props.ancestors.push(props.value)
    props.parent = props.value
    props.next = c
    r = iterator(props.value,makeCall,c)
    //seperate this function for async
    if(!opts.async) return c(r)
    function c(r){
      //log('teardown branch ',r)
      
      props.key = _key
      props.value = _value
      props.parent = _parent
      props.index = _index
      if(opts.pre)
        props.referenced = _referenced

      props.ancestors.pop()
      if(opts.async) done(r)
      return r //returned will be ignored if async
    }
  }


  var props = 
        { parent: null
        , key: null
        , value: object
        , before: true
        , circular: false
        , reference: false
        , path: [] 
        , seen: []
        , ancestors: []
        , iterate: curry([opts.iterator],iterate)
        }

  //setup iterator functions -- DIFFERENT IF ASYNC
  Object.keys(cont).forEach(function(key){
    var func = cont[key]
    props[key] = curry([func],iterate)
  })

  if(opts.pre){
    props.referenced = false
    var refs = []
    
    function check(p){
      if(p.reference)
        refs.push(p.value)
      else
        p.each()
    }

    traverse(object, {branch: check})

    props.repeated = refs
  }

  function makeCall(value,key,next){//next func here if async.
    var r, index
    //using immutable objects would simplify this greatly, 
    //because I could not have to teardown...
    //maybe. would have to not depend on closures.
    if(key !== null)
      props.path.push(key)
    props.key = key
    props.value = value
    if(opts.async)
      props.next = c

    if(opts.isBranch(props)){
      index = 
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

      r = opts.branch(props,c)
    } else {
      r = opts.leaf(props,c)
    }
    
    if(!opts.async) return c(r) //finish up, if sync
    function c (r){
      if(key !== null)
        props.path.pop()
      if(opts.async) next(r)
      return r
    }
  }
  
 return makeCall(object,null,opts.done)
}
