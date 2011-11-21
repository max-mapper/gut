 var traverser = require('traverser')

exports.branches = branches

function branches (obj){
    var branches = []

    function branch(props){
      if(!props.reference)
        branches.push(props.value)

      props.each()//continue working through the children of this object.
    }

    traverser(obj,{branch: branch})
    return branches
}

    console.log(branches([1,2,{},3,["x"]]))
    //[ [ 1, 2, {}, 3, [ 'x' ] ], {}, [ 'x' ] ]
