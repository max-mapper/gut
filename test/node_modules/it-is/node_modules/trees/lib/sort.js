//topographical sort

var traverse = require('traverser')

exports = module.exports = 
  function sort(depends) {
    var levels = []
      , requires = {}
      
    if(Object.keys(depends).length == 0)
      return []
    
    traverse(depends,{branch: roots})

    sorted = levels.reduce(function (x,y){
      return x.concat(y)
    })
      
    return sorted.map(deps)
    
    function roots(p){
      var level = p.max() + 0
      if(p.parent){
        levels[level] = levels[level] || []
        if(-1 == levels[level].indexOf(p.key))
          levels[level].push(p.key)
        requires[p.key] = Object.keys(p.value)
      }
      return level + 1
    }
    function deps(x){
      return [x,requires[x]]
    }
  }
  
exports.flat = 
    function flat(depends) {
    var levels = []
      , requires = {}
      
    if(Object.keys(depends).length == 0)
      return []
    
    traverse(depends,{branch: roots})

    sorted = levels.reduce(function (x,y){
      return x.concat(y)
    })
      
    return sorted
    
    function roots(p){
      var level = p.max() + 0
      if(p.parent){
        levels[level] = levels[level] || []
        if(-1 == levels[level].indexOf(p.key))
          levels[level].push(p.key)
        requires[p.key] = Object.keys(p.value)
      }
      return level + 1
    }
  }
