
var it = require('it-is')
  , render = require('../render')
  , log = console.log
  
exports ['renders an object'] = function (test){
  var a,b,c
  c = []
  c.push(c)
  var examples =
  [ [ [1,2,3,4], '[ 1, 2, 3, 4 ]']
  , [ {}, /^{}$/]
  , [ {a:'b'}, '{ a: "b" }']
  , [ d = new Date, d.toString()]
  , [ /xyz/, '/xyz/']
  , [ null, 'null']
  , [ undefined, 'undefined']
  , [ c, 'var0=[ var0 ]']
  , [ function a (x,y,z){}, 'function a(x,y,z){}']
  , [ function (){'blah blah blah'}, 'function (){...}']
  , [ {X: function (){'blah blah blah'
          return } }, '{ X: function (){...} }']
  ]

//thats a basics. multilines and indentation.

  it(examples).every(function (e){
    if('string' == typeof e[1])
      it(render(e[0])).equal(e[1])
    else
      it(render(e[0])).matches(e[1])
  })
}

exports ['multiline and indentation'] = function (test) {
   var a,b,c
  c = []
  c.push(c)

  var examples =
  [ [ [1,2,3,4], "[ 1\n, 2\n, 3\n, 4 ]"]
  , [ [1,2,[3,4]], "[ 1\n, 2\n, [ 3\n  , 4 ] ]"]
  , [ [1,2,[[[]]],[3,4]], "[ 1\n, 2\n, [ [ [] ] ]\n, [ 3\n  , 4 ] ]"]
  , [ [1,2,{x:'asdfasfasf',y:{K:21434}},[3,4]]
    , "[ 1\n, 2\n, { x: \"asdfasfasf\"\n  , y: { K: 21434 } }\n, [ 3\n  , 4 ] ]" ]
  , [ {}, '{}']
/*  , [ [1,2,"hello\nthere",4] 
    , "[ 1\n, 2\n, \"hello\n   there\"\n, 4 ]" ]*/
  , [ {a:'b'}, '{ a: "b" }']
  , [ c, 'var0=[ var0 ]']
  , [ function a (x,y,z){}, 'function a(x,y,z){}']
  , [ function (){'blah blah blah'}, 'function (){...}']
  ]

//thats a basics. multilines and indentation.

  it(examples).every(function (e){
    var r = render(e[0],{multi:true})
    log(r)
    it(r).equal(e[1])
  })
}
