
#It-Is#

a terse assertion DSL, inheriting from node's assert module, but enhanced with the power of functional programming & colours!

# Basic Usage#

    var it = require('it-is')
   
    it(actual).equal(10)

# High-level Usuage #

`every` applies an assertion function to every item in a list.

    it(arrayOfNumbers)
      .every(it.typeof('number'))
    

`has` applies assertion functions to leaves of a tree.

    it({a:1, b: 3})
      .has({
        a: it.typeof('number').notEqual(3)
      , b: it.equal(3)
      })

huh?

if you call `it` with an argument `it(actual)` assertions chained will be applied immediately.

    it(actual).equal(expected) 

is that same as 

    assert.equal(actual,expected)

if you don't provide an argument, but just start chaining `it.equal(expected)`, it returns a function which makes that assertion.

    it.typeof('number').notEqual(unexpected)
    
returns a function like this:

    function (actual){
      assert.typeof(actual,'number') //not in node's assert. added in it-is
      assert.notEqual(actual,unexpected)
    }

pass these functions into It-Is's every and has for terse assertion easyness!

then glance at the error messages which are highlighted to show the exact point the assertion failed:

<img src="https://github.com/dominictarr/it-is/raw/master/screenshot.png" border = "0"/>

#Assertion Methods#

node's assert module methods:

`ok`,`equal`,`notEqual`,`deepEqual`,`notDeepEqual`,`strictEqual`,`notStrictEqual`,`throws`,`doesNotThrow`,`ifError`

and also:

##typeof##
assert type, expected can be 'string', 'number', 'boolean', 'object', 'function', or 'undefined'

    it(actual).typeof(type)

##instanceof##
assert instanceof, expected should be a constructor function

    it(actual).instanceof(constructor) 
    
example:
    
    it([]).instanceof(Array)

##primitive##
assert is not an object or a function

    it(7).primitive()

##complex##
assert is an object or a function

    it({}).complex()
    
##function##
assert is a function


    it(function(){}).function()

##matches##
assert matches a regular expresson

    it(actual).matches(regex)
    
example:
    
    it('asdf@asdf.com').matches(/^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/)

##like##
assert two strings match, but ignoring case, white space and whether quotes are " or '. (is configurable)

  it(actual).like(expected, options)

options object is optional! but should be this format:

    {case: boolean,whitespace: boolean, quotes: boolean}

##every##

apply assertions to every item in an array

    it(array).every(assertion)

example:
  
    it([1,2,3,4,5]).every(it.typeof('number').notEqual(0))
    
assertion is just a function

    it([
      [1,1.0]
    , [1,1e0]
    , [1,7/7]
    ]).every(function (line){
      assert.equal(line[0],line[1])
    })
      
##property##

apply check that it has a property and apply an assertion

    it(actual).property(name,value) //checks that actual[name] == value

or if value is a function:
    
    it(actual).property(name,assertion) //checks that assertion(actual[name])

example:

    it([]).property('length',0)
    
    it({a: /sdf/}).property('a',it.instanceof(RegExp))

##has##

apply asssertions to properties of an object, checking that properties and actually there first.

    it(actual).has(properties)

if a property is primitive, it's checked for equality.
if a property is a function, it's called with actual's corrisponding property as the argument.

example:

    it({
        a: 1
      , b: 2
      , c: { x: true }
      , d: [1,2,3,4,5,true,'string'] 
      })
      .has({
        a: it.notEqual(0)
      , b: 2 //values are treated like it.equal(value)
      , c: it.complex()
      , d: it.every(it.primitive())
      })


enjoy!

next, implement and document how to add assertion functions and renderers and render styles.
