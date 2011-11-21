//traverser2.expresso.js

var should = require('should')
  , traverser = require('../traverser.sync')
  , test = require('assert')

exports ['calls search function with properties object'] = function(){
  var obj = {}
  traverser(obj,function (props){//calls this function on every element.
    var it = props
      it.should.have.property ('path').eql([]).instanceof(Array)
      it.should.have.property ('parent',null)
      it.should.have.property ('value',obj)
      it.should.have.property ('key',null)
      it.should.have.property ('each').a('function')
  })
}



exports ['iterates over a list'] = function(){
  var list = [0,10,20,30,40,50,60,70,80,90,100]
    , leafCalled = false
    , leafCounter = 0
  traverser(list,{branch: branch, leaf: leaf})
  
  function leaf (props){
    var it = props
    it.should.have.property('parent', list)
    it.should.have.property('key','' + (leafCounter ++))
    it.should.have.property('value',list[props.key])
    it.should.have.property('path').eql([props.key])
    it.should.have.property('ancestors').eql([list])
    leafCalled = true;
  }

  function branch (props){//calls this function on every element.

    var it = props
      it.should.have.property ('path').eql([]).instanceof(Array)
      it.should.have.property ('parent',null)
      it.should.have.property ('value',list)
      it.should.have.property ('key',null)
      it.should.have.property ('each').a('function')

    props.each()

    var it = props
      it.should.have.property ('path').eql([]).instanceof(Array)
      it.should.have.property ('parent',null)
      it.should.have.property ('value',list)
      it.should.have.property ('key',null)
      it.should.have.property ('each').a('function')
  }
  leafCalled.should.be.ok
}

exports ['iterates over a tree'] = function (){

  var list = [0,10,20,[100,200],30,40,[1000,2000,[10000]],50,60,70,80,90,100]
    , leafCalled = false
    , leafCounter = 0
    , branchCounter = 0
  traverser(list,{branch: branch, leaf: leaf})

  function leaf(props){
    leafCounter ++
  }

  function branch(props){
    var _parent = props.parent
      , _path = [].concat(props.path)
      , _ancestors = [].concat(props.ancestors)
      , _key = props.key
      , _value = props.value
      
      props.each()
      branchCounter ++ 
    var it = props
      it.should.have.property('parent',_parent)
      it.should.have.property('path').eql(_path)
      it.should.have.property('ancestors').eql(_ancestors)
      it.should.have.property('key',_key)
      it.should.have.property('value',_value)
  }

  leafCounter.should.eql(16)
  branchCounter.should.eql(4)
}

/*
  this feels like it is going way smoother than the first time.
  
  ...although, havn't tried anything hard yet.
*/

exports ['map to a string'] = function (){

  var list = [0,10,20,[100,200],30,40,[1000,2000,[10000]],50,60,70,80,90,100]
    , r = traverser(list, {branch: branch})
    
  r.should.eql('(0 10 20 (100 200) 30 40 (1000 2000 (10000)) 50 60 70 80 90 100)')
    
  function branch (p){
    return '(' + p.map().join(' ') + ')'
  }
}

exports ['branch and leaf both have sensible defaults'] = function (){

  var list = [0,10,20,[100,200],30,40,[1000,2000,[10000]],50,60,70,80,90,100]
    , r = traverser(list, {leaf: invert, iterator: 'map'})
    
  r.should.eql([0,-10,-20,[-100,-200],-30,-40,[-1000,-2000,[-10000]],-50,-60,-70,-80,-90,-100])
  
  function invert(props){
    return -1 * props.value 
  }
}

exports ['can copy objects'] = function (){

  var list = {list: [0,10,20,{a: 100, b: 200},30,40,[1000,2000,{k: 10000}],50,60,70,null,80,90,100]}
    , r = traverser(list, {iterator: 'copy'})
    
  r.should.eql(list)
}

exports ['has a property for reference and circular'] = function (){
  var referenced = false
    , circular = false
  var list = {}
      list.list = list
  var x = {complex: [12,3,4], simple: '!!!'}
      x.self = x
      x.list = [1,2,3,x.complex,5,6,x.simple]
  
  var r = traverser(list, {branch: branch})
    referenced = false
  var r = traverser(x, {branch: branch})
    
  referenced.should.be.true
  circular.should.be.true
  
  function branch(props){
    var it = props
    it.should.have.property('circular').a('boolean')
    it.should.have.property('reference').a('boolean')
    it.should.have.property('seen').instanceof(Array)
    
    if(props.reference == true){
      props.seen.should.contain(props.value)
      referenced = true

      if(props.circular){
         circular = true
        return
        }
    } else {
      it.should.have.property('circular',false)
      props.ancestors.should.not.contain(props.value)
    }
    props.each()
  }
}

exports ['easy to render a string'] = function (){

  var x = {complex: [12,3,4], simple: '!!!'}
      x.self = x
      x.list = [1,2,3,x.complex,5,6,x.simple]

  var r = traverser(x, {branch: branch, leaf: leaf})
  r.should.eql("{{12 3 4} '!!!' @ {1 2 3 ^ 5 6 '!!!'}}")

  function leaf (p){
    return 'string' === typeof p.value ? "'" + p.value + "'" : p.value
  }

  function branch (p){
    if(p.reference)
      return p.circular ? '@' : '^'

    var op = p instanceof Array ? '[' : '{'
      , cl = p instanceof Array ? ']' : '}'
    return op + p.map().join(' ') + cl    
  }
}
/**/
/*
  it was SO much easier to do it this way it was amazing.
  
  ideas to expand this:
    what about a use a function to generate the objects?
    & async looping
    optionally initial pass to find repeats & give paths to original
    
    make the properties object immutable and use prototypes to layer new data on it
      - make path & ancestors lazy getters
*/

exports ['can pre-traverse to check for references'] = function (){
   var list = {}
      list.list = list
  traverser(list,{branch: branch, pre: true})
  
  function branch(p){
    p.should.have.property('referenced',true)
  } 
}

exports ['can pre-traverse to check for references, complex'] = function (){
  var x = {complex: [12,3,4], simple: '!!!'}
      x.self = x
      x.list = [1,2,3,x.complex,5,6,x.simple]
  var r = traverser(x,{branch: branch, leaf: leaf, pre: true})
  r.should.eql('$0=(complex->$1=(12 3 4) simple->!!! self->[$0] list->(1 2 3 [$1] 5 6 !!!))')

  function key(p,rest){
    return (isNaN(p.key) ? p.key +'->' : '') + rest }
  function leaf(p){
    return key(p, p.value) }
  function branch(p){
    var name = '$' + p.index.repeated // i should store the index the first time.
    if(p.reference)
      return key(p, '[' + name + ']') 

    return  key(p, (p.referenced ? name + '=' : '')  + '(' + p.map().join(' ') + ')' )
  } 
}
/*
  what about functions? should they be treated as branches, leaves, or both?
  
  simple way is to pass in a function to decide...
  ...be useful if you want to treat particular things as branches or not.

  maybe options to assume it is a 'tree','dag','cyclic' (and don't check for references if it's tree)
*/

exports ['can control what is considered a branch and what is a leaf'] = function (){

//for example: function can have properties, so they are branches.

  var x = function (){return "SOURCE CODE"}
    x.x = x
    x.y = "yyyy"
  var brackets =
    { 'Array' : ['[',']']
    , 'Object': ['{','}']
    , 'Function': ['<function ()','>']
    }
  var study =
      [ [x, '<function ()x:@ y:\'yyyy\'>',true]
      , [[x],'[<function ()x:@ y:\'yyyy\'>]',true]
      , [[1,2,3],'[1 2 3]',true]
      , [x, "function (){return \"SOURCE CODE\"}",false]
      , [[x],'[function (){return \"SOURCE CODE\"}]',false] ]
    , branchChecked = false

  study.forEach(function (e,k){
    branchChecked = false
    var r
    if(e[2]) {
      r = traverser(e[0],{branch: branch, leaf: leaf, isBranch: isBranch})
      test.ok(branchChecked)
    } else {
      r = traverser(e[0],{branch: branch, leaf: leaf})
    }
    test.equal(branchChecked, e[2])
    test.equal(r,e[1])
  })
  
  function key(p,rest){
    return (isNaN(p.key) ? p.key +':' : '') + rest
    }
  
  function leaf (p){
    return key(p,'string' === typeof p.value ? "'" + p.value + "'" : '' + p.value) }

  function branch (p){
    if(p.reference)
      return key(p,p.circular ? '@' : '^')

    var op = brackets[p.value.constructor.name][0]
      , cl = brackets[p.value.constructor.name][1]
    return key(p,op + p.map().join(' ') + cl)
  }

  function isBranch(p){
    branchChecked = true
    return brackets[p.value.constructor.name] != null
  }
}


exports ['has min and max iterators'] = function (){
  var obj = [10,20,30,40,[200,4,6600,2],564]
    , max = traverser(obj,{iterator: 'max'})
    , min = traverser(obj,{iterator: 'min'})

  max.should.eql(6600)
  min.should.eql(2)
}
