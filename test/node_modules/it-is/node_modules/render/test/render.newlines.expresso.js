//render.multiline.expresso.js
/*
what are all the different styles for rendering js?

//inline:
{ key1: value, key2: value, child: {key: value} }

new lines:

{ key1: value
, key2: value
, child: 
  { key1: value
  , key2: value } }

comma after

{ key1: value,
  key2: value,
  child: { key1: value,
    key2: value, } }
  
multi line if properties:

{ key1: value,
  key2: value,
  child: 
    { key1: value,
      key2: value } }

or

{ key1: value,
  key2: value,
  child: {
    key1: value,
    key2: value } }

bracketts on it's own line or not:

{
  key1: value,
  key2: value,
  child: {
    key1: value,
    key2: value 
  }
}


opening on it's own line
closing on it's own line
comma end or next
*/

var it, is = it = require('it-is')
  , render = require('../render')
function para(){
  var s = []
  for(var i in arguments)
    s.push(arguments[i])
    
  return s.join('\n')
}

var renderme = 
    { key1: 1
    , key2: 2
    , child: 
      { key1: 3
      , key2: 4 } }

exports ['test render in different styles'] = function (){
  
  //indented with comma first
  
  it(render(renderme,{joiner:"\n, ", indent: '  '}))
    .equal(
      para
      ( '{ key1: 1'
      , ', key2: 2'
      , ', child: { key1: 3'
      , '  , key2: 4 } }' ) )

  //indented, comma-first, start-newline

  it(render(renderme,{joiner:"\n, ", indent: '  ', padMulti: ['\n','']}))
    .equal(
      para
      ( '{ key1: 1'
      , ', key2: 2'
      , ', child: '
      , '  { key1: 3'
      , '  , key2: 4 } }' ) )

  //indented, comma-first, bracket-ownline, cl-bracket-trailing

  it(render(renderme,{joiner:"\n, ", indent: '  ', padJoin: ['\n  ',' ']}))
    .equal(
      para
      ( '{'
      , '  key1: 1'
      , ', key2: 2'
      , ', child: {'
      , '    key1: 3'
      , '  , key2: 4 } }' ) )

  //indented, comma-first, bracket-newline, cl-bracket-newline

  it(render(renderme,{joiner:"\n, ", indent: '  ', padJoin: ['\n  ','\n']}))
    .equal(
      para
      ( '{'
      , '  key1: 1'
      , ', key2: 2'
      , ', child: {'
      , '    key1: 3'
      , '  , key2: 4'
      , '  }'
      , '}' ) )

  //indented, comma-trailing, bracket-newline, cl-bracket-newline

  it(render(renderme,{joiner:",\n  ", indent: '  ', padJoin: ['\n  ','\n']}))
    .equal(
      para
      ( '{'
      , '  key1: 1,'
      , '  key2: 2,'
      , '  child: {'
      , '    key1: 3,'
      , '    key2: 4'
      , '  }'
      , '}' ) )

}
