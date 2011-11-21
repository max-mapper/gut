
#Traverser#

search through a complex object (nearly) as easily as forEach

all the nitty-gritty stuff is taken care of.

including:
  # checking for repeats.
  # checking for cycles.
  # getting the path the the current object. etc!

#simple example#
collect all branches in a tree.

    var traverser = require('traverser')
      , branches = []

    function branch(props){
      if(!props.reference) //since we check for references with will work in cyclic graphs, without stackoverflows.
        branches.push(props.value)

      props.each()//continue working through the children of this object.
    }

    traverser([1,2,{},3,["x"]],{branch: branch})
    
    console.log(branches)

#simple example2#
collect all leaves in a tree. (only functions and primitives)

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
    //[1,2,3,'x']
    
#complex example#
even quite complex things like a topological sort are now achivable in ~30 lines.
see `traverser/examples/topo-sort`


#API#

  `traverser (obj, options)`
  
  obj: graph/tree to traverse
  
    options: (each of the following is optional)
    {
      branch: function to call on a branch of the tree (by default, where typeof == 'object'
    , leaf: function to call on primitives and functions
    , isBranch: return true if current value should be treated as a branch
    }
    
each function is passed one arg, a properties object which describes the state of the traverse.
  
    {
      value: this object
    , parent: object which this item is a property of. (null if your on the root object)
    , key: key of this item on parent. (null if your on the root object)
    , path: [list of keys from root object to current item]
    , reference: true if this object is a repeat
    , circular: true if this object is in the ancestors list.
    , seen: list of objects seen so far
    , ancestors: list of objects between value and root object.

    //when your in the branch function, you need to call one of the following to iterate over the children.
    //none of these require an argument.

    , each: iterate over each property
    , find: iterate untill the first truthy return, returns the item.
    , map: collects return values into an Array
    , copy: copies objects, preserving whether it's a {} or a []
    , max: iterate over all properties and return max return value
    , min: iterate over all properties and return min return value
    }

###feel free to ask me questions if you need help!###

###see https://github.com/dominictarr/trees for more examples.###

