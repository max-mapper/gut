//style.expresso.js

var style = require ('../style')
  , it = require('it-is')
  
exports ['style function returns functions'] = function (){

  it(style(function (v) { return v })(10)).equal(10)

  it(style).property('identity',it.function())

  var r = Math.random()

  it(style('identity')(r)).equal(r)

}


var styles = [  'bold', 'underline', 'italic'
   , 'inverse', 'grey', 'yellow'
   , 'red', 'green', 'blue', 'white'
   , 'cyan', 'magenta']

exports ['style has colour functions'] = function (){

  it(styles).every(function (e){
    style(e,console.log)(e + '   ')
    it(style(e)('x')).matches(/\u001b\[\d+m.*?\u001b\[\d+m/g)
  })
}

exports ['style has plain (strips colour info)'] = function (){

  it(styles).every(function (e){
    style(e,'plain',console.log)(e + '   ')
    it(style(e,'plain')('asdfzxcv')).equal('asdfzxcv')
  })
}