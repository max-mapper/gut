//trees.expresso.js
/*
Tree helper methods,
branches -> get all branches.
leaves -> get all leaves.
paths -> get all paths.
*/

var tr
var trees = require('trees')
  , inspect = require('sys').inspect
  , should = require('should')
  , assert = require('assert')
  
var a,b,c,d,e

var tree = 
  a = { a: 7
      , b: b =
        { c: c = [1,2,3]}
      , d: d =
        { e: e = {x: 'X'}}}
var graph = 
  w = { w: 7
      , x: x =
        { y: y = [1,2,3]}
      , z: z =
        { u: u = {x: 'X'}}}
 graph.w.y = y
// graph. = y
 graph.z.z = z

var branches = [a,b,c,d,e]
var leaves = [7,1,2,3,'X']
var gBranches = [w,x,y,z,u]

exports ['branches lists all branches'] = function (){

  assert.deepEqual(trees.branches(tree),branches)

  trees.branches(graph) //if you use deep equal, error gets obscured by cannot convert circular structure to JSON.
    .should.eql(gBranches)
}
exports ['leaves gets all leaves'] = function (){
  trees.leaves(tree)
    .should.eql(leaves)

  trees.leaves(graph)
    .should.eql(leaves)
}

exports ['can copy a graph'] = function (){
  var it = 
    trees.copy(tree)
      .should.eql(tree)
  assert.notStrictEqual(it,tree)

  var it = 
    trees.copy(graph)

  assert.notStrictEqual(it,tree)
  assert.ok(trees.graphEqual(it,tree))
}

