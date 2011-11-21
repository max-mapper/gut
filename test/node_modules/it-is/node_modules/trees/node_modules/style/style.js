

//style.js

/*
style(list of functions, or function names) // returns a function which will apply those functions to it's args.



style('red')(message) //make message red,
style('red','bold')(message) //make message red, and bold.
style('red','bold', function (v){return v})(message) //make message red, and bold.

style.add(name,function) //add function under name



*/

var curry  = require('curry')

module.exports = nu()

function nu (){

  function style (){

  var funx = []
  for(var i in arguments){
    var func = arguments[i]
    funx.push('function' == typeof func ? func : style[func])
  }

  return function (v){

    funx.forEach(function (x){
      v = x(v)
    })

    return v
  }

  }

  function termStyle (start,end,content){

    return '\033[' + start + 'm' + content +
           '\033[' + end + 'm';

  }
  var styles = {
    //styles
    'bold'      : [1,  22],
    'italic'    : [3,  23],
    'underline' : [4,  24],
    'inverse'   : [7,  27],
    //grayscale
    'white'     : [37, 39],
    'grey'      : [90, 39],
    'black'     : [90, 39],
    //colors
    'blue'      : [34, 39],
    'cyan'      : [36, 39],
    'green'     : [32, 39],
    'magenta'   : [35, 39],
    'red'       : [31, 39],
    'yellow'    : [33, 39],
    };


  for(var name in styles){
    style[name] = curry(styles[name],termStyle)

  }

  style.identity = function (v){return v}
  style.plain = function (v){

    return v.replace(/\u001b\[\d+m/g,'')
  }

  style.new = nu

  return style
}