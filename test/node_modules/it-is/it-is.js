var asserters = require('./assert')
  , render = require('render')

module.exports = renderStyle(null /*styles.colour*/) //now default to no style.

function renderStyle(style) {
  var renderers

  if(style){
   renderers = require('./renderer')
    , styles = require('./styles')

  if('string' === typeof style)
    style = styles[style] || styles.colour
  }

  module.exports = It

  function merge(a,b){
    var ary = [a]
    for(i in b){
      ary.push(b[i])
    }
    return ary
  }

  function renderer (err,name){
    return (renderers[name] || renderers['default']).call(renderers,err,style,name)
  }

  function applyAssertion(actual,assertion,expected,name){
    try{
      assertion.apply(null, merge(actual,expected)) //call the assertion.
    } catch (err){

      if(style){//don't apply message rendering if renderStyle is null
        var m = renderer(err,name)
        if(!err.originalStack){
          err.message = undefined
          var stack = err.stack
          err.originalStack = err.stack
          Object.defineProperty(err,'stack',{
            get: function (){return err.message + '\n' + err.originalStack}
          })
        }
        err.message = m
      }
      throw err  
    }
  }

  /**
   * first way to use it-is
   * it(actual).assertion(expected)
   * assertion function is called directly as if it was invoked like assertion(actual,expected)
  */

  function It(obj){
    if(!(this instanceof It))
      return new It(obj)

    this.obj = obj
    this.assertion = function (name,func,args){
      applyAssertion(this.obj,func,args,name) //just call the function immediately.
      return this
    }
  }

  var asserts = It.prototype = It

  //add all the standard assert methods.

  for(i in asserters) {
    It[i] = asserter(asserters[i],i)
  }

  function asserter(func,name){
    return function (){
      //for(var i in arguments) you cannot do this over arguments in firefox.
      var a = []
      while (arguments.length) 
        {a.push([].shift.call(arguments))};
      return this.assertion(name,func,a/*,renderer*/)  
    }
  }

  /**
   * second way to use it-is
   * it.assertion(expected) (actual)
   * it.assertion(expected) creates a function which will make that assertion on it's argument.
   * like: function (actual) {assertion(actual,expected) return this}
   *
   * it-is has several methods which check properties against a function. this is very helpful:
   *
   * it([1,2,3,4,5]).every(is.typeof('number'))
   *
   * `every` makes an assertion about every property (in this case, 1,2,3,4 & 5)
   * it's argument is a function that makes an assertion. 
   * in this case the function created by `is.typeof('number')`
   *
   * to achive this some wrestling with prototypes is necessary.
   * create a function and tell it it's prototype is asserts
   * then teach it how to be a function again (apply and call)
  */

  It.assertion = function (name,func,args){
    var assertions = [[func,args,name]]
      , self = AssertionList

    AssertionList.assertion = function (name,func,args){
      assertions.push([func,args,name])
      return AssertionList
    }

    AssertionList.toString = function (){
        var r =  "it" + assertions.map(function (e){
          return '.' + e[2] + '(' + renderArgs(e[1]) + ')'
        }).join('')
        return r
    }
    for(i in asserters) {
      AssertionList[i] = asserter(asserters[i],i)
    }

    return AssertionList

    function AssertionList (actual) {
      assertions.forEach(function (assertion){
        applyAssertion(actual,assertion[0],assertion[1],assertion[2]) //just call the function immediately.
      })
    }
  }

  function renderIt(i){
    return render(i, {value: function (v,p,def){
        if(v && v.name == 'AssertionList')
          return v.toString()
        return def(v,p)
      } } )
  }

  function renderArgs(args){
    var l = []
    for(i in args){
     l.push(renderIt(args[i]))
    }
    return l.join('\n ,')
  }

  It.renderStyle = renderStyle
  It.style = renderStyle
return It
}
