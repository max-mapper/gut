
var t = require('trees').untangle
  , equals = require('trees').equals
  , inspect = require('sys').inspect
  , test = require('assert')
  
exports ['can remove repeats from a object to be JSONed'] = function (){
  var a
    , x = [a = [1,2,3],a]
    , y = [[1,2,3],[1,2,3]]

  test.equal(JSON.stringify(x),JSON.stringify(y))

//  test.deepEqual(x,retangle(untangle(x)))
  test.strictEqual(x[0],x[1])

  var z = t.retangle(t.untangle(x))
  test.strictEqual(x[0],x[1])
}
exports ['can remove cycles from a object to be JSONed'] = function (){
  var x = [1]
    x.push(x)
    
  test.strictEqual(x,x[1])
  var _z = t.untangle(x)

  var z = t.retangle(_z)

  test.strictEqual(z,z[1])
}
exports ['handles null values'] = function (){
  var x = [1,2,3,null,4]
    , $x = t.untangle(x)
    , _x = t.retangle($x)
    
  test.deepEqual(x,_x)
}


exports ['can untangle and serialize to JSON and parse back'] = function (){
  var x = [10,20,30], a, b, c = {a : a = [1,2,3], x: x}, e, f, d = [1,2,3,34,x,6534]
  x.push(x)
  c.c = c
  var these =
    [ [a,a]
    , x 
    , {a : a, a2: a, x: x}
    , c
    , 'hello'
    , { a : a
      , a2: e = 
        { z: 'asdfasddgsdafgasg'
        , x: x
        , y: 'yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy'
        }
      , x: x
      , f: {a: a, b: b, c: c, d: d,e: e }
      }
    ]

  these.forEach(function(x){

    var y = t.retangle(JSON.parse(JSON.stringify(t.untangle(x))))
      , z = t.parse(t.stringify(x))
    test.ok(equals.graphs(x,y), "expected " + inspect(x) + " to equal " + inspect(y))

    test.ok(equals.graphs(x,z), "expected " + inspect(x) + " to equal " + inspect(z))

  })

}
//*/  
