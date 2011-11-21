var it = require('it-is') //defaults to colour

var assertions = 
  { 'numbers': 
      "it(10000).equal(10001)"

  , 'strings': 
      "it('check string equality').equal('check string smameness')"

  , 'like (case/whitespace insensitive)': 
      "it('check STRING like').like('check\\n string\\n like S ')"

  , '{} instanceof Array': 
      "it({}).instanceof(Array)"

  , 'function x(){} is primitive ': 
      "it(function x(){}).primitive()"

  , 'every one of 1,2,3,\'X\',4 is a number': 
      "it([1,2,3,'X',4]).every(it.typeof('number'))"

  , 'object {a: {b: 1}, z: 2} has .a.b which is equal to 10': 
      "it({a: {b: 1}, z: 2}).has({a: {b: it.equal(10) } })"

  , 'object {a: {b: 1}, z: 2} has .a.b which is equal to 10': 
      "it({a: 1, b: {} }).has( {b:{c: {} } } )"

  }
    

for (var i in exports){
  Error.stackTraceLimit = 1
  try{
    eval(assertions[i])
  } catch (error){

    console.log("> " + exports[i])
    console.log()
    console.log(error.stack)
    console.log()
  }


