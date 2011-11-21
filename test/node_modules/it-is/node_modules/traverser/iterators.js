//iterators
//var log = require('logger')

/*
~~~~~~~~~~~~~~~~~~~~~~~~
Sync


*/
/*
  i've discovered that js has some querks about properties being iteratred on
  for example: for (i in obj) will include prototype properties,
          but Object.keys(obj) will not.
          
          for greatest flex, pass in a custom function to gen prop list.

          when you are say, comparing objects, the correctness of iteration is essential.
*/

exports.sync = {
  each: function (object,func){
    for( key in object){
      var value = object[key]
      func(value,key,object)
    }
  },
  find: function (object,func){
    for( key in object){
      var value = object[key]
      var r = func(value,key,object)
      if(r){
        return value
     }
    }
  },
  map: function (object,func){
    var m = []
    for( key in object){
      var value = object[key]
      m.push(func(value,key,object))
    }
    return m
  },
  copy: function (object,func){
    if('object' !== typeof object || object === null)
      return object
    var m = (object instanceof Array ? [] : {})
    for( key in object){
      var value = object[key]
      m[key] = func(value,key,object)
    }
    return m
  },
  max: function (object,func){
    var max = null
    for( key in object){
      var value = object[key]
        , r = func(value,key,object)
        if(r > max || max === null)
          max = r
    }
    return max
  },
  min: function (object,func){
    var min = null
    for( key in object){
      var value = object[key]
        , r = func(value,key,object)
        if(r < min || min === null)
          min = r
    }
    return min
  }
}
/*
~~~~~~~~~~~~~~~~~~~~~~~~
Async


*/
// keys function consistant with for
function keysFor(obj){
  a = []
  for(i in obj)
    a.push(i)
  return a
}

var curry = require('curry')

function async(object,func,collect,done){
  var keys = keysFor(object)
    , i = 0
    item()
    function next(r){
      if(collect){//call collect(r,key,value,object,done)
        var stop = collect(r,keys[i],object[keys[i]],object)
        if(stop) return done(stop)
      } 
      i ++ 
      if(i < keys.length)
        process.nextTick(item)
      else 
        done()
    }
    function item(){
    //func(value,key,next,object)
      func(object[keys[i]],keys[i],next,object)
    }
}

exports.async = {
  each: function (object,func,done){
    async(object,func,null,done)
  },
  find: function (object,func,done){
  
    async(object,func,collect,done)
    function collect(r,k,v){
      if(r)
        return v
    }

  },
  map: function (object,func,done){
    var map = []
    async(object,func,collect,curry([map],done))//curry creates a closure around map
    function collect(r,k,v){
    //  log('map',map,'push(',r,')')
      map.push(r)
    }
  },
  copy: function (object,func,done){
    var map = (object instanceof Array ? [] : {})
    async(object,func,collect,curry([map],done))
    function collect(r,k,v){
      map[k] = (r)
    }
  },
  max: function (object,func,done){
    var max 
    async(object,func,collect,fin)
    function collect(r,k,v){
      if(r > max || max == null)
        max = r
    }
    function fin (){
      done(max)
    }
  },
  min: function (object,func,done){
    var min
    async(object,func,collect,fin)
    function collect(r,k,v){
      if(r < min || min == null)
        min = r
    }
    function fin (){
      done(min)
    }
  },

}

