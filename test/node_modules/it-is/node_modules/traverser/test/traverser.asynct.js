//traverser2.expresso.js

var describe = require('should').describe
  , traverser = require('traverser')
  , inspect = require('sys').inspect
  , should = require('should')
  
exports ['calls search function with properties object'] = function(test){
  var obj = {}
  traverser(obj,function (props,next){//calls this function on every element.
    var it = props
      it.should.have.property ('path').eql([]).instanceof(Array)
      it.should.have.property ('parent',null)
      it.should.have.property ('value',obj)
      it.should.have.property ('key',null)
      it.should.have.property ('each').a('function')
      it.should.have.property ('next').a('function')
    //log('next',next.toString())
    next()
  },test.finish)
}


exports ['iterates over a list'] = function(test){
  var list = [0,10,20,30,40,50,60,70,80,90,100]
    , leafCalled = false
    , leafCounter = 0
    , branchPost = false
  traverser(list,{branch: branch, leaf: leaf, done: finished})
  
  function leaf (props,next){
    var it = props
    it.should.have.property('parent', list)
    it.should.have.property('key','' + (leafCounter ++))
    it.should.have.property('value',list[props.key])
    it.should.have.property('path').eql([props.key])
    it.should.have.property('ancestors').eql([list])
    leafCalled = true;
    next()
  }

  function branch (props,next){//calls this function on every element.

    var it = props
      it.should.have.property ('path').eql([]).instanceof(Array)
      it.should.have.property ('parent',null)
      it.should.have.property ('value',list)
      it.should.have.property ('key',null)
      it.should.have.property ('each').a('function')

    props.each(c)
    function c(r){
    branchPost = true

    var it = props
      it.should.have.property ('path').eql([]).instanceof(Array)
      it.should.have.property ('parent',null)
      it.should.have.property ('value',list)
      it.should.have.property ('key',null)
      it.should.have.property ('each').a('function')
      next(r)
    }
  }

  function finished(){
    leafCalled
      .should.be.ok
    branchPost
      .should.be.ok
    test.finish()
  }
}

exports ['iterates over a tree'] = function (test){

  var list = [0,10,20,[100,200],30,40,[1000,2000,[10000]],50,60,70,80,90,100]
    , leafCalled = false
    , leafCounter = 0
    , branchCounter = 0
  traverser(list,{branch: branch, leaf: leaf,done:finished})

  function leaf(props,next){
    leafCounter ++
    next()
  }

  function branch(props,next){
    var _parent = props.parent
      , _path = [].concat(props.path)
      , _ancestors = [].concat(props.ancestors)
      , _key = props.key
      , _value = props.value
      
    props.each(c)
    function c(){
      branchCounter ++ 
      var it = props
      it.should.have.property('parent',_parent)
      it.should.have.property('path').eql(_path)
      it.should.have.property('ancestors').eql(_ancestors)
      it.should.have.property('key',_key)
      it.should.have.property('value',_value)
      next()
    }
  }
  function finished(){
    leafCounter
      .should.eql(16)
    branchCounter
      .should.eql(4)
    test.finish()
  }
}
/**/
exports ['map to a string'] = function (test){

  var list = [0,10,20,[100,200],30,40,[1000,2000,[10000]],50,60,70,80,90,100]
    , r = traverser(list, {branch: branch, done:returned})
    
  function returned(r){
    r.should.eql('(0 10 20 (100 200) 30 40 (1000 2000 (10000)) 50 60 70 80 90 100)')
     
    //log(r)
    test.finish()
  }
  function branch (p,next){
    p.map(c)
    function c(map){
      next('(' + map.join(' ') + ')')
    }
  }
}
/**/
exports ['branch and leaf both have sensible defaults'] = function (test){

  var list = [0,10,20,[100,200],30,40,[1000,2000,[10000]],50,60,70,80,90,100]
  
  traverser(list, {leaf: invert, iterator: 'map', done:returned})

  function returned(r){
    //log('reaturned',r)
    r.should.eql([0,-10,-20,[-100,-200],-30,-40,[-1000,-2000,[-10000]],-50,-60,-70,-80,-90,-100])
    test.finish()
  }
  function invert(props,next){
    //log('invert!',props.value)
    next( -1 * props.value )
  }
  function map(props,next){//iterate should do this by default
    props.map(next)
  }
}


exports ['can copy objects'] = function (test){

  var list = {list: [0,10,20,{a: 100, b: 200},30,40,[1000,2000,{k: 10000}],50,60,70,80,90,100]}
  traverser(list, {iterator: 'copy', done:returned})
  function returned(r){
    
    r.should.eql(list)
    test.finish()
  }
}

//check that reference and circular are correct.

function checkRefs (obj,done){
  traverser(obj, {branch: branch, /*leaf: leaf,*/ done: c})
  function c(r){
    referenced
      .should.be.true

    circular
      .should.be.true

    done()
  }
  function branch(props,next){
    var it = props
    it.should.have.property('circular').a('boolean')
    it.should.have.property('reference').a('boolean')
    it.should.have.property('seen').instanceof(Array)
    
    if(props.reference == true){
      props.seen
        .should.contain(props.value)
      referenced = true

      if(props.circular){
         circular = true
        return next()
        }
    } else {
      it.should.have.property('circular',false)
      props.ancestors
        .should.not.contain(props.value)
    }
    props.each(next)
  }

}

exports ['has a property for reference and circular'] = function (test){
  var referenced = false
    , circular = false

  var list = {}
      list.list = list

  var x = {complex: [12,3,4], simple: '!!!'}
      x.self = x
      x.list = [1,2,3,x.complex,5,6,x.simple]
      
    checkRefs (list,c)
    function c (){
      checkRefs (x,test.finish)
    }
   
}

exports ['easy to render a string'] = function (test){

  var x = {complex: [12,3,4], simple: '!!!'}
      x.self = x
      x.list = [1,2,3,x.complex,5,6,x.simple]

  traverser(x, {branch: branch, leaf: leaf, done: c})
  
  function c(r){
    r.should.eql("{{12 3 4} '!!!' @ {1 2 3 ^ 5 6 '!!!'}}")
    test.finish()
  }
  function leaf (p,next){
    next ( 'string' === typeof p.value ? "'" + p.value + "'" : p.value )
  }
  function branch (p,next){
    if(p.reference)
      return next ( p.circular ? '@' : '^' )

    var op = p instanceof Array ? '[' : '{'
      , cl = p instanceof Array ? ']' : '}'
    p.map(c)
    function c(map){
      next ( op + map.join(' ') + cl )
    }
  }
}


exports ['can pre-traverse to check for references'] = function (test){
   var list = {}
      list.list = list
  traverser(list,{branch: branch, pre: true, done:test.finish})
  
  function branch(p,next){
    p.should.have.property('referenced',true)
    next()
  } 
}

  
exports ['can pre-traverse to check for references, complex'] = function (test){
  var x = {complex: [12,3,4], simple: '!!!'}
      x.self = x
      x.list = [1,2,3,x.complex,5,6,x.simple]
  traverser(x,{branch: branch, leaf: leaf, pre: true, done:returned})

  function returned(r){
    r.should.eql('$0=(complex->$1=(12 3 4) simple->!!! self->[$0] list->(1 2 3 [$1] 5 6 !!!))')

    test.finish()
  }
  function key(p,rest){
    return (isNaN(p.key) ? p.key +'->' : '') + rest }
  function leaf(p,next){
    next( key(p, p.value) ) }
  function branch(p,next){
    var name = '$' + p.index.repeated // i should store the index the first time.
      , wasReferenced = p.referenced
    if(p.reference)
      return next ( key(p, '[' + name + ']') )

    p.map(c)
    function c (map){
      //reference isn't unset right.
      p.referenced.should.eql(wasReferenced)
      if(p.referenced)
        test.equal ('$-1' != name,true, 'expected name to not equal $-1')

      next( key(p, (p.referenced ? name + '=' : '')  + '(' + map.join(' ') + ')' ) )
    }
  } 
}
/**/
/*
//this feature probably works, but I'm getting bored of converting sync to async.
 
exports ['can control what is considered a branch and what is a leaf'] = function (test){

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

//  study.forEach(function (e,k){
    branchChecked = false
    var r
    if(e[2]) {
      r = traverser(e[0],{branch: branch, leaf: leaf, isBranch: isBranch})
      test.ok(branchChecked)
    } else {
      r = traverser(e[0],{branch: branch, leaf: leaf})
    }
    //log(k,r)
    //log(k,e[0])

    test.equal(branchChecked, e[2])
    test.equal(r,e[1])
  //})
  
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
//*/

exports ['has min and max iterators'] = function (test){
  var obj = [10,20,30,40,[200,4,6600,2],564]
  traverser(obj,{iterator: 'max',done: c})
  function c(max){
    max.should.eql(6600)
  
    traverser(obj,{iterator: 'min',done: c})
    function c(min){
      min.should.eql(2)
      test.finish()
    }
  }
}
