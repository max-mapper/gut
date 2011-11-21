//renderer.js

var render = require('render')
  , trees = require('trees')
  , assert = require('assert')

function pathTo(obj,path){
  for(var i in path)
    obj = obj[path[i]]
  return obj
}

function pathToEnd(obj,path){
  for(var i in path){
    if(obj[path[i]] === undefined){
      var r = {value:obj, path: path.slice(0,i)}
      return r 
    }
    obj = obj[path[i]]
  }
  return {value:obj, path: path}
}


module.exports = {
  ok: function (error,style){
    return style.render(style.red(error.actual),'',style.red('ok'))
  }
, instanceof: function (error,style){
    return style.render 
      ( style.red (style.stringify(error.actual))
      , style.green (error.expected.name)
      , style.red('instanceof') )
  }
, like: function (error,style){
  var m = stringEq(error.actual,error.expected,style)
  return style.render("'" + m[0] + "'","'" + m[1] + "'",style.red('like'))
}
, equal: function (error,style,name){
  if('string' == typeof error.expected){
    var m = stringEq(error.actual,error.expected,style)
    return style.render("'" + m[0] + "'","'" +m[1] + "'",style.red('equal'))
  }
  return this.default(error,style,name)
}
, every : function (error,style){
    var m = [] //error.every instanceof Array ? [] : {}
      , found = false
    if(error.index === -1) //if every is given an empty list or the wrong parameters
      return style.render
        ( style.red(style.stringify(error.every))
        , error.message
        , 'every' )
    
    function value(v,k,o){
      if(i == error.index){
        found = true
        return render.Special(style.red(style.stringify(v)))
      } else if (!found)
        return render.Special(style.green(style.stringify(v)))
      else  
        return render.Special(style.yellow(style.stringify(v)))
    }
    for(var i in error.every){
        m[i] = value(error.every[i],i,error.every)
    }

/*  var op = '{',cl = '}'
    if (error.every instanceof Array)
      op = '[',cl = ']'*/

    return style.render(style.stringify(m),error.message,style.red('every'))
  }

, has: function (error,style){
  if(error.object == null)
    return style.render
      ( style.red(object)
      , "ERROR: it has no properties!"
      , style.red('has') )


    var props = trees.copy(error.props)
      , object = trees.copy(error.object)
      , parentPath = trees.copy(error.path)
      , key = parentPath.pop()
      , found = pathToEnd(error.object,error.path) //

    pathTo(props,parentPath)[key] = render.Special(errorMessage(error,style)) //Special makes render not stringify (no ""'s)

    var last = found.path.pop()
    var at = pathTo(object,found.path)
    if(at){
      if(last)
        at[last] = render.Special(style.red(style.stringify(found.value)))
      else
        object = render.Special(style.red(style.stringify(at)))
      
    }
    //also, need propper indentation so it's readable.
    //and make red() configurable, so it can term-colour, or ascii only.
    //shift render code out into another module 

    return style.render
      ( style.stringify(object)
      , style.stringify(props)
      , style.red('has') )
    //render has, and it but replace the error causing item in has with the error message.
  }
, default: function (error,style,name){
    return style.render
      ( style.red (style.stringify(error.actual))
      , style.green (style.stringify(error.expected))
      , style.red (name) )
  }
}

function stringEq(x,y,style){
  x = '' + x
  y = '' + y

  var left = '', right = ''

  if(isNaN(x) && isNaN(y) && ('number' === typeof x || 'number' === typeof y))
    return [style.red(x), style.red(y)]

  var l = '' + x, s = '' + y
  if(y.length > x.length){
    l = y; s = x
  }
  if(x != y)
    for(i in l){
      if (y[i] !== x[i]){
        left = 
          '' + style.green(x.slice(0,i) || '') 
             + style.red(x.slice(i,x.length) || '')
        right = 
          '' + style.green(y.slice(0,i) || '') 
             + style.red(y.slice(i,y.length) || '')
             
        return [left, right]
      }
    }
  return [style.green(x), style.green(y)]
}

function errorMessage(error,style){
  if(error.message)
    return error.message
  
  if(error instanceof assert.AssertionError)
    return style.red(error.actual) + ' ' + error.operator + ' ' + style.green(error.expected)
}
