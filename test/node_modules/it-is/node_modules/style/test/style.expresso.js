//test
var style = require('../style')
  , assert = require('assert')
  
exports ['style wraps a string '] = function (){
  var h = "hello"
  var s = style(h)
  assert.equal(h.length, s.length) // length should appear the same.

  assert.strictEqual(s.toString(),h)
}

exports ['style can pad a string '] = function (){
  var h = "hello"
  var s = style(h)
  assert.equal(h.length, s.length) // length should appear the same.

  s.lpad (10)

  assert.strictEqual(s.length,10)
  s.rpad (10)
  assert.strictEqual(s.length,10)

  //the order of padding is significant
  s.rpad (20)
  assert.strictEqual(s.length,20)
}

exports ['pad still works for non strings, i.e. numbers '] = function (){
  var h = 123
  var s = style(h)
  assert.equal(('' + h).length, s.length) // length should appear the same.

  s.lpad (10)

  assert.strictEqual(s.length,10)
  assert.equal(s.toString(),"       123")

  s = style(h).rpad(10)
  assert.equal(s.toString(),"123       ")
}

exports ['style can pad with different character '] = function (){
  var h = "hello"
  var s = style(h)
  assert.equal(h.length, s.length) // length should appear the same.

  s.lpad (10,"!")

  assert.strictEqual(s.length,10)
  assert.equal(s.toString(),"!!!!!hello")

  s = style(h).rpad (10,"!")

  assert.equal(s.toString(),"hello!!!!!")
}

exports ['style lpad and rpad are chainable '] = function (){
  var h = "hello"
  var s = style(h)
  assert.equal(h.length, s.length)

  s.lpad (10).rpad(15)

  assert.strictEqual(s.length,15)

  //calling lpad or rpad more than once has undefined behaviour.
}

exports ['can set colours of styled strings '] = function (){
  var h = "hello"
  var s = style(h).red
  assert.ok(s,"styled string has color properties")
  
  assert.deepEqual(s.styles,['red'])
 
  s = style(h)
 
  ;[  'bold', 'underline', 'italic'
   , 'inverse', 'grey', 'yellow'
   , 'red', 'green', 'blue', 'white'
   , 'cyan', 'magenta',"rainbow"].forEach(function(e){
    assert.deepEqual(s[e],s,"style:'" + e + "' is chainable")
  })
  
  assert.equal(h.length, s.length)

  //calling lpad or rpad more than once has undefined behaviour.
}

exports ['style is applied on toString'] = function (){
  var h = "hello"
  var s = style(h).blue

  assert.notEqual("" + s, h)
  console.log("" + s)
}

exports ['ruby style .to_s, for lazyness'] = function (){
  var h = "hello"
  var s = style(h).red

  assert.equal(s.to_s,"" + s)
  console.log("" + s)
}

exports ['style exposes styles'] = function (){
  var styleKeys = style.styles
  
  styleKeys.forEach(function showStyle (h){
    var s = style(h)[h]
    console.log("style:" + s)
    assert.ok(s, "has style:" + h)
  })
}

exports ['style colours can be disabled'] = function (){
  var styleKeys = style.styles
  unstyle = style.enable(false)
  
  styleKeys.forEach(function showStyle (h){
    var s = unstyle(h)[h]
    assert.equal(s, h, "'" + s + "' should not have style:" + h)
  })
}

exports ['when padding is styled, it is only styled once'] = function (){
  var h = "hello"
  var s = style(h)
  var pad = style('!').red
  assert.equal(h.length, s.length) // length should appear the same.

  s.lpad (10,pad)
  padded = ("" + s)
  pad_length = ("" + pad).length
  extra = pad_length - 1
  assert.ok(padded.length <=  10 + extra, 
      "length of styled padding:" + padded + ".length == " + (padded.length)
    + " should be <= " + (extra + 10))
  assert.ok(padded.length >=  10 , 
      "length of styled padding:" + padded + ".length == " + (padded.length)
    + " should be >= " + ( 10))
}

exports ['can destyle a string'] = function () {

  var dr = 'double rainbow'
    , r = style(dr).rainbow
    , flat = "" + r
    
  assert.notEqual(r,dr)
  assert.notEqual(flat,dr)
  assert.equal(style.destyle(flat),dr)
}

exports ['destyled padded style will be same length as un styled string'] = function (){
    plain = style.enable(false)
  
  var dr = 'double rainbow'
    , r = style(dr).rainbow.rpad(50,'!')
    , p = plain(dr).rainbow.rpad(50,'!')
      
     assert.ok(("" + r).length > ("" + p).length, 
        'styled length: ' + r + ' should be much longer'
     +  ' than plain: ' + p
     )

     assert.ok(("" + style.destyle(r)).length == ("" + p).length)    
}

exports ['apply a style to multiple objects'] = function (){
 var rb = style().rainbow.styler
  , dr = 'double rainbow'
 assert.ok('function',typeof rb)
 assert.equal('' + rb(dr), '' + style(dr).rainbow)
}
