var traverser = require('../traverser.sync')
  , assert = require('assert')

exports ['calls search function with properties object'] = function(){
  var obj = {}
  traverser(obj,function (props){//calls this function on every element.
    assert.deepEqual(props.path,[])
    assert.equal(props.value,obj)
    assert.equal(props.key,null)
    assert.ok('function' == typeof props.each)
  })
}


exports ['iterates over a list'] = function(){
  var list = [0,10,20,30,40,50,60,70,80,90,100]
    , leafCalled = false
    , leafCounter = 0
  traverser(list,{branch: branch, leaf: leaf})
  
  function leaf (props){
    assert.deepEqual(props.parent,list)
    assert.equal(props.key,'' + (leafCounter ++))
    assert.equal(props.value, list[props.key])
    assert.deepEqual(props.path, [props.key])
    assert.deepEqual(props.ancestors, [list])
    leafCalled = true;
  }

  function branch (props){//calls this function on every element.

    assert.deepEqual(props.path,[])
    assert.deepEqual(props.parent,null)
    assert.equal(props.key,null)
    assert.equal(props.value, list)
    assert.ok('function' == typeof props.each)

    props.each()

    assert.deepEqual(props.path,[])
    assert.deepEqual(props.parent,null)
    assert.equal(props.value, list)
    assert.equal(props.key,null)
    assert.ok('function' == typeof props.each)

  }
  assert.ok(leafCalled)
}
//*/

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

      assert.equal(props.parent,_parent)
      assert.deepEqual(props.path,_path)
      assert.deepEqual(props.ancestors,_ancestors)
      assert.equal(props.key,_key)
      assert.deepEqual(props.value,_value)
  }

  assert.equal(leafCounter,16)
  assert.equal(branchCounter,4)
}


exports ['map to a string'] = function (){

  var list = [0,10,20,[100,200],30,40,[1000,2000,[10000]],50,60,70,80,90,100]
    , r = traverser(list, {branch: branch})
    
  assert.equal(r,'(0 10 20 (100 200) 30 40 (1000 2000 (10000)) 50 60 70 80 90 100)')
    
  function branch (p){
    return '(' + p.map().join(' ') + ')'
  }
}

exports ['branch and leaf both have sensible defaults'] = function (){

  var list = [0,10,20,[100,200],30,40,[1000,2000,[10000]],50,60,70,80,90,100]
    , r = traverser(list, {leaf: invert, iterator: 'map'})
    
  assert.deepEqual(r,[0,-10,-20,[-100,-200],-30,-40,[-1000,-2000,[-10000]],-50,-60,-70,-80,-90,-100])
  
  function invert(props){
    return -1 * props.value 
  }
}

exports ['can copy objects'] = function (){

  var list = {list: [0,10,20,{a: 100, b: 200},30,40,[1000,2000,{k: 10000}],50,60,70,null,80,90,100]}
    , r = traverser(list, {iterator: 'copy'})
    
  assert.deepEqual(r,list)
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
    
  assert.ok(referenced)
  assert.ok(circular)

  function branch(props){
    //var it = props
    assert.ok(props.circular != undefined)
    assert.equal(typeof props.circular, 'boolean')
    assert.ok(props.reference != undefined)
    assert.equal(typeof props.reference, 'boolean')
    assert.ok(props.seen instanceof Array)
    
    if(props.reference == true){
      assert.ok(~props.seen.indexOf(props.value))

      referenced = true

      if(props.circular){
         circular = true
        return
        }
    } else {
      assert.equal(props.circular,false)
      assert.equal(~props.ancestors.indexOf(props.value),0)
    }
    props.each()
  }
}

exports ['easy to render a string'] = function (){

  var x = {complex: [12,3,4], simple: '!!!'}
      x.self = x
      x.list = [1,2,3,x.complex,5,6,x.simple]

  var r = traverser(x, {branch: branch, leaf: leaf})
  assert.equal(r,"{{12 3 4} '!!!' @ {1 2 3 ^ 5 6 '!!!'}}")

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

exports ['can pre-traverse to check for references'] = function (){
   var list = {}
      list.list = list
  traverser(list,{branch: branch, pre: true})
  
  function branch(p){
    assert.ok(p.referenced)
  } 
}

exports ['can pre-traverse to check for references, complex'] = function (){
  var x = {complex: [12,3,4], simple: '!!!'}
      x.self = x
      x.list = [1,2,3,x.complex,5,6,x.simple]
  var r = traverser(x,{branch: branch, leaf: leaf, pre: true})
  assert.equal(r,'$0=(complex->$1=(12 3 4) simple->!!! self->[$0] list->(1 2 3 [$1] 5 6 !!!))')

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
      assert.ok(branchChecked)
    } else {
      r = traverser(e[0],{branch: branch, leaf: leaf})
    }
    assert.equal(branchChecked, e[2])
    assert.equal(r,e[1])
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

  assert.equal(max,6600)
  assert.equal(min,2)
}
