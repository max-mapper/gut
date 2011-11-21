/*
  on second thoughts, having this in style is not 'one module that does one thing well'
  
*/


var should = require ('should')
  , test = require('assert')
  , errorStyle = require('../error')
  , style = require('../style')
  , eq = null
  , log = console.log
  , assert = require('assert')

try{assert.equal(3,7)} catch (err){eq = err}

exports ['can print errors'] = function (){
  log("THIS IS JUST A DRILL. TESTING ERROR MESSAGE PRINTING")
  log (errorStyle.printError(new Error("TESTING ERROR MESSAGES")))
  log (errorStyle.printError(eq))
  log (errorStyle.printError("sdjflasjdfl TESTING ERROR MESSAGES"))
  log (errorStyle.printError({name: "Literial Object", message : "Hello. TESTING ERROR MESSAGES" }))
  log("DRILL OVER. ERROR MESSAGES ARE REAL AGAIN.")
}

exports ['can print errors in colour'] = function (){
  log("THIS IS JUST A DRILL. TESTING ERROR MESSAGE PRINTING")

  log(errorStyle.styleError(new Error("TESTING ERROR MESSAGES")))
  log(errorStyle.styleError(eq))
  log(errorStyle.styleError("sdjflasjdfl TESTING ERROR MESSAGES"))
  log(errorStyle.styleError({name: "Literial Object", message : "Hello. TESTING ERROR MESSAGES" }))

  log("DRILL OVER. ERROR MESSAGES ARE REAL AGAIN.")
}

exports ['can parse an error and get everything out of it'] = function (){
var stack = 
  "AssertionError: 7 == 3\n"
    + "at Object.equal (/home/dominic/code/node/meta-test/test_reports.js:21:13)\n"
    + "at Array.0 (/home/dominic/code/node/meta-test/test/test_reports.asynct.js:201:49)\n"
    + "at runTestFunc (/home/dominic/code/node/async_testing/lib/testing.js:99:22)\n"
    + "at startNextTest (/home/dominic/code/node/async_testing/lib/testing.js:83:5)\n"
    + "at Array.0 (/home/dominic/code/node/async_testing/lib/testing.js:232:6)\n" 
    + "at EventEmitter._tickCallback (node.js:42:22)\n"
    + "at node.js:634:9\n"

var error = {name: "AssertionError" , message: "7 == 3", stack: stack}

var obj = errorStyle.parseError(error)

 obj.should.have.property('name', "AssertionError")
 obj.should.have.property('stack').instanceof(Array)
 

   obj.stack[1].should.have.property('function','Object.equal')
   obj.stack[1].should.have.property('file','/home/dominic/code/node/meta-test/test_reports.js')
   obj.stack[1].should.have.property('line',21)
   obj.stack[1].should.have.property('column',13)
}

exports ['can parse information from a stack trace'] = function (){
  var lines = 

  [ { unmatched: "at Object.equal (/home/dominic/code/node/meta-test/test_reports.js:21:13)" 

    , function : 'Object.equal'
    , file : '/home/dominic/code/node/meta-test/test_reports.js'
    , line : 21
    , column: 13 }

  , { unmatched: "at Array.0 (/home/dominic/code/node/meta-test/test/test_reports.asynct.js:201:49)"
  
    , function : 'Array.0'
    , file : '/home/dominic/code/node/meta-test/test/test_reports.asynct.js'
    , line : 201
    , column: 49 }

  , { unmatched: "at runTestFunc (/home/dominic/code/node/async_testing/lib/testing.js:99:22)"
  
    , function : 'runTestFunc'
    , file : '/home/dominic/code/node/async_testing/lib/testing.js'
    , line : 99
    , column: 22 }

  , { unmatched: "at Array.forEach (native)"
  
    , function : 'Array.forEach'
    , file : 'native' }

  , { unmatched: "at Object.<anonymous> (/home/dominic/code/node/style/test/error.expresso.js:6:12)"
  
    , function : 'Object.<anonymous>'
    , file : '/home/dominic/code/node/style/test/error.expresso.js' 
    , line : 6
    , column: 12 }
    
  , { unmatched: "at [object Context]:1:9"
  
    , file : '[object Context]' 
    , line : 1
    , column: 9 }
  , { unmatched: "expected context-free grammar parser to accept:'the cat ate the mouse'"
      //occasionally i've had confusing errors where the regex was over zealously parseing the message...
      //this messsage should not match!
    }

  ]

  lines.forEach(function (l){
    var o = errorStyle.parseStackLine(l.unmatched)
   if(l.function)
     o.should.have.property('function',l.function)

   if(l.file) //so verbose!
     o.should.have.property('file',l.file)
   else
     o.should.not.have.property('file')

   if(l.line)
     o.should.have.property('line',l.line)
   else
     o.should.not.have.property('line')
   
   if(l.column)
     o.should.have.property('column',l.column)
   else
     o.should.not.have.property('column')
  })
}


exports ['can parseError for non errorStyle types'] = function (){
  
  var nostack = '[no stack trace]'
  
  var st = errorStyle.parseError("STRING THROW")
  var nt = errorStyle.parseError(123)
  var ot = errorStyle.parseError({name: "whatever", message: "non Error error TESTING ERROR MESSAGES"})
  
  st.should.have.property('name','thrown')
  st.should.have.property('message','STRING THROW')
  st.should.have.property('stack').eql([{unmatched:nostack}])  
  
  nt.should.have.property('name','thrown')
  nt.should.have.property('message').eql(123)
  nt.should.have.property('stack').eql([{unmatched:nostack}])  
  
  ot.should.have.property('name','whatever')
  ot.should.have.property('message','non Error error TESTING ERROR MESSAGES')
  ot.should.have.property('stack').eql([{unmatched:nostack}])  
}

exports ['can style a falsey error'] = function (){
var falsey = [false,0,undefined,null]

  falsey.map(errorStyle.styleError)

}
