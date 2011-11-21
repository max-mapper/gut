var it = require('it-is')
  , render = require('../render')
  , log = console.log
  , examples = [
        {}
      , [1,2,3,4]
      , 123
      , "hello"
      , {valid: true}
      , new Date()
      , {regexp: /hello/}
      , {x: {y: 1}}
      ]

function make(stringify) {
  return function (){

    it(examples).every(function (e){
      var json = stringify(e)
      console.log("attempting to parse:",json, JSON.stringify(e))
      var parsed = JSON.stringify(JSON.parse(json))
      it(parsed).equal(JSON.stringify(e))
    })
  }
}

exports ['render.json'] = make(render.json)
exports ['render.json.ct'] = make(render.json.ct)
exports ['render.json.cf'] = make(render.json.cf)
exports ['render.json.ctbn'] = make(render.json.ctbn)
exports ['render.json.cfbn'] = make(render.json.cfbn)
