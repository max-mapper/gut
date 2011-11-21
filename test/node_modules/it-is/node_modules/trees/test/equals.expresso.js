//equals.expresso
/*
  checks the equality of complex objects, 
  generates a colour coded message to show the difference.

*/
var equals = require('trees').equals
  , inspect = require('sys').inspect
  , test = require('assert')
  , log = console.log
//  , curry = require('curry')
exports ['can compare trees correctly'] = function (){

  /*on a tree, only values are compared, and references are assumed not to exist.
  */
  
  var a,b,b2,c,d
    , x = function (){"source code"}
    , y = function (){"source code 2"}
  var eq = 
      //[a ,b ,tree,dag,cyclic]
      [ [[],[],true,true]
      , [[1,2,3],[1,2,4],false,false]
      , [[],[[]],false,false]
      , [[],[{}],false,false]
      , [[],{},false,false]
      , [[[]],[{}],false,false]
      , [[[]],[],false,false]
      , [[1,2,3,4,[5,5],6,76,78,8,45,456],[1,2,3,4,[5,6],6,7326,78,8,45,456],false,false]
      , [{a: 'asdsd', b :'asdgsb',c: 525234},{a: 'asdsd', b :'asdgsb',c: 5252334},false,false]
      , [a = [1,2,3],a,true,true]
      , [[[1,2,3],[1,2,3]],[a,a], true,false] 
      , [b = [],b, Error,true]
      , [[1,2,3,x],[1,2,3,x], true,true]
      , [[1,2,3,x],[1,2,3,y], false,false]
      , [b,b2 = [], Error,true]
      , [c = [1,2,3], [1,2,3,[1,2,3,[1,2,3]]], Error,false] 
      ]

  b.push(b)
  b2.push(b2)
  c.push(c)

/*
  how to deal with infinite trees?
  for example:
    a = [1,2,3]
    a.push(a)

  has the same values as:
    b = [1,2,3,[1,2,3]]
    b[3].push(b)

  although they are not graph equal...
  
  simplest solution: don't allow it. throw infinite tree exception.

*/
 eq.forEach(function (e,k){
    var r
  if(e[2] == Error){
    try {
      r = equals.trees(e[0],e[1])
      test.ok(false,"did not throw error on infinite tree:"  + r)
    } catch (err){
      if(-1 == err.message.indexOf('infinite tree'))
        throw err
    }
  } else {
    r = equals.trees(e[0],e[1])
      log('tree equals:', r.message)
    test.equal(r.eq,e[2], 
      "expected [" + k + ']' + inspect(e[0]) + (e[2]?' to':' to not') + " tree equal " + inspect(e[1]))
  }  
//  log('self:',e[0])
  var diff = equals.graphs(e[0],e[1])
  log('graph difference:',diff.message)
  test.equal(diff.eq,e[3], 
    "expected [" + k + ']' + inspect(e[0]) + (e[3]?' to':' to not') + " graph equal " + inspect(e[1]))
 })

}


exports ['can check for structure type tree/dag/cyclic'] = function (){

  var a,b,c // for dags
  var x,y,z // for dags

  var trees = [ []
      , {a:1,b:2,c:3}
      , {a:1,b: [1,2,3], b2: [1,2,3]} ]
  var dags = [[b = [1,2,3], b,b,b]
      , {a:1,b:b,c:{b: b}}
      , {a:1,c: c = [1,2,3], b2: [1,2,c]} ]
  var cyclic = [x = [b = [1,2,3], b,b]
      , y = {a:1,b:b,c:{b: b}}
      , z = {a:1,c: c = [1,2,3], b2: [1,2,c]} ]

  x.push(x)
  y.c.y = y
  z.c.push(z)

  trees.forEach(function (t){
    checkTopo(t,'tree',equals.isTree)
  })
  dags.forEach(function (t){
    checkTopo(t,'dag',equals.isDag)
  })
  cyclic.forEach(function (t){
    checkTopo(t,'cyclic',equals.isCyclic)
  })

  function checkTopo(t,type,func){
    var got = equals.topologyType(t)
    test.equal(got,type, 'expected ' + inspect(t) + " to be a '" + type + "', but got '" + got + "'")
    test.equal(func(t),true, 'expected ' + func.name + "(" + inspect(t) + ") to be true")
  }
}

exports ['string equals'] = function (){
  var
    neq = 
      [ [ 'a','b' ,0 ]
      , [ 'aa','ab',1 ] 
      , [ 'aabababbbbabbaaw','aabababbbbabxbaa',12 ]
      , [ 'aab\naba\nbbb\nbab\nnba\n','aab\naba\nbbb\nbab\nnba\n\n',20 ]
      , [ 3.141592653,22/7,4 ]
      , [ ' _____         _\n' 
        + '|_   _|__  ___| |_\n'
        + '  | |/ _ \\/ __| __|\n'
        + '  | |  __/\\__ \\ |_\n'
        + '  |_|\\___||___/\\__|\n'
        , ' _____         _\n' 
        + '|_   _|__  ___| |_\n'
        + '  | |/ _ \/ __| __|\n'
        + '  | |  __/\__ \ |_\n'
        + '  |_|\___||___/\__|\n'
        , 45]
      , [true, false,0]
      , [null, undefined]
      , [0, false]
      , [12352,NaN,0]
      , [NaN,NaN,0]//stupid, but consistant with ==
      , ['NaN',NaN,0]//stupid, but consistant with ==
      ]

  neq.forEach(function (n,k){
    var r = equals.string(n[0],n[1])
    var eq = !(n.length == 3)
    test.equal(r.eq,eq)
    test.ok(r.message,"message property should exist")
    log('string equals:', r.message, 'at:' + k)

    if(!eq)
      test.equal(r.at,n[2])
  })
}
//*/
