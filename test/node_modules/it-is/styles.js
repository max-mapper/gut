var render = require('render')

function indent(string){
  return string.split('\n').map(function (e){return '  ' + e}).join('\n')
}

var ascii = {
     red: function (value) { return '!' + value + '!' } //is in error
,  green: function (value) { return value } //is okay
,  yellow: function (value) { return value } //was not checked.
}
/*
 \033[VALUEm

  'blue'      : [34, 39],
  'cyan'      : [36, 39],
  'green'     : [32, 39],
  'magenta'   : [35, 39],
  'red'       : [31, 39],
  'yellow'    : [33, 39],
*/

var colour = {
  render: function (actual,expected,name){
    return 'it(' + actual + ').' + name + '(' + expected + ')'
  }
,    red: function (value) { return '\033[31m' + (value) + '\033[39m'} //is in error
,  green: function (value) { return '\033[32m' + (value) + '\033[39m'} //is okay
,  yellow: function (value) { return '\033[33m' + (value) + '\033[39m'} //was not checked.
, stringify: function (value) { 
  return render 
    ( value
    , { joiner:",\n  "
      , indent: '  '
      , padJoin: ['\n  ','\n']
      , compactLength: 60
      , string: function (value,p,def){
        if(value.length < 20)
          return JSON.stringify(value)
       else
          return '\n' + indent(JSON.stringify(value)) + '\n'
      }
    } ) 
  }
}

ascii.__proto__ = colour

exports.ascii = ascii
exports.colour = colour

