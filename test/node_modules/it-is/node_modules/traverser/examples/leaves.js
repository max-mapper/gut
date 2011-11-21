 var traverser = require('traverser')

exports.leaves = leaves

function leaves (obj){
    var leaves = []

    function leaf(props){
      leaves.push(props.value)
    }

    traverser(obj,{leaf: leaf})
    return leaves
}

    console.log(leaves([1,2,{},3,["x"]]))

    //[ [ 1, 2, 3, 'x' ]
