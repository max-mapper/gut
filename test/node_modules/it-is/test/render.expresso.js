//render.expresso.js

var it, is = it = require('../it-is')
  , it_ascii = it.renderStyle('ascii')
  , log = console.log

/*test the rendering of error messages.*/

exports ['simple'] = function (){
  
  function renderIt(it,it2,enforce){
  it2([ 
    [null, it.ok(), 'it(!null!).!ok!()'] 
  , [1, it.equal(2), 'it(!1!).!equal!(2)'] 
  , ['12345', it.like('1\n2\n3\n4\n'), 'it("1234!5!").!like!("1234!!")'] 
  , [2, it.notEqual(2) ,'it(!2!).!notEqual!(2)'] 
  , ['x', it.typeof('number'), 'it(!"x"!).!typeof!(\"number\")'] 
  , [{}, it.instanceof(Array), 'it(!{}!).!instanceof!(Array)'] 
  , ['zxcvzbnxcvn', it.matches(/[asdfghjkl]+/), 'it(!"zxcvzbnxcvn"!).!matches!(/[asdfghjkl]+/)']
  , [[1,2,3,'XXX',4], it.every(it.typeof('number')), 'it([1,2,3,!"XXX"!,4]).!every!(it(!"XXX"!).!typeof!("number"))'] 
  , [7
    , it.every(it.typeof('number'))
    , 'it(!7!).every(*is not an object*)' ]
  , [ {a: 1, b:false}
    , it.has({a: it.typeof("number"),b: it.ok()})
    , 'it({ a: 1, b: !false! }).!has!({ a: it.typeof("number"), b: it(!false!).!ok!() })' ]
  , [ {a: 1, b:true }
    , it.has( {b: false } )
    , 'it({ a: 1, b: !true! }).!has!({ b: !true! == false})' ]
  , [ {a: 1, b: {} }
    , it.has( {b:{c: {} } } )
    , 'it({a: 1, b: !{}! }).!has!({b:{c: !expected {a: 1, b: {} }! hasPath .b.c}})' ]
  , [ undefined
    , it.has( {} )
    , 'it(!undefined!).!has!(ERROR: it has no properties!)' ]
  , [ {a:true}
    , it.has( {b: true} )
    , 'it(!{a:true}!).!has!({b: !expected{a:true}! haspath .b })' ]
  ])
  .every(function checkCorrectErrorMessage(actual){
    var nothrow
    try{
      actual[1](actual[0])
      nothrow = true
    } catch (exp){
      log(exp.message)
      if(enforce)
        it2(exp.message).like(actual[2])
      else
        return
    }
    if(nothrow)
      throw new Error("expected " + actual[1] + "(" + JSON.stringify(actual[2]) + ") to throw")
  })
  
  }
  
  renderIt(it_ascii,it,true) //ascii, check for errors
  renderIt(it,it) //colour, log to terminal to check.
  
}

exports ['nested it.every'] = function (){
  try{
  it([
    [1,2,3,4] ,
    [4,5,6,'?']
    ]).every(it.every(is.typeof('number')))
  } catch(error){
    console.log(error.message)
  }
}