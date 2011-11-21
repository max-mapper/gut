var var0,var1,var2,var3,var4,var5,var6,var7,var8,var9,var10
   ,var11,var12,var13,var14,var15,var16,var17,var18,var19,var20
   ,var21,var22,var23,var24
var complex = 
{
 'meta-test/asynct_adapter': {
   'async_testing/lib/testing': {
     assert: var1={}
    , path: var2={}
    , fs: var0={}
    , child_process: var3={}
    , 'async_testing/lib/messages': {}
    , inspect: var6={
       'inspect/inspect': {}
       }
     }
  , 'meta-test/test_reports': {
     easyfs: {
       'easyfs/easyfs': {
         fs: var0
        , util: var4={}
        , assert: var1
        , path: var2
        , child_process: var3
         }
       }
    , util: var4
    , assert: var1
    , query: {
       'query/query': {
         inspect: var6
         }
       }
     }
  , inspect: var6
  , 'style/error': var10={
     style: var8={
       'style/style': {}
       }
     }
  , style: var8
  , '/home/dominic/dev/miniorm/test/miniorm-async.asynct.js': {
     'miniorm/miniorm-async': {
       dirty: {
         'dirty/lib/dirty': {
           'dirty/lib/dirty/dirty': {
             fs: var0
            , sys: {}
            , events: {}
             }
           }
         }
      , curry: var13={
         'curry/curry': {}
         }
      , 'traverser/iterators': var19={
         logger: var14={
           'style/error': var10
          , style: var8
          , inspect: var6
           }
        , curry: var13
         }
      , logger: var14
       }
    , it: {
       'it/it': {
         'c-assert': {
           'c-assert/c-assert': {
             assert: var1
            , 'traverser/equals': {
               'traverser/traverser2': var24={
                 inspect: var6
                , logger: var14
                , curry: var13
                , 'traverser/iterators': var19
                 }
              , logger: var14
              , style: var8
               }
            , style: var8
             }
           }
        , 'it/assert': {
           assert: var1
          , 'traverser/traverser2': var24
          , logger: var14
          , inspect: var6
           }
        , logger: var14
        , inspect: var6
        , 'render/render2': {
           traverser: {
             'traverser/traverser2': var24
             }
          , logger: var14
           }
         }
       }
     }
   }
 }
 var REF0,REF1,REF2,REF3,REF4,REF5,REF6,REF7,REF8
var wrong = 
{ 'meta-test/asynct_adapter': { 'async_testing/lib/testing': { assert: REF0 = {}
    , path: REF1 = {}
    , fs: REF2 = {}
    , child_process: REF3 = {}
    , 'async_testing/lib/messages': {}
    , inspect: REF4 = {'inspect/inspect': {}} }
  , 'meta-test/test_reports': { easyfs: { 'easyfs/easyfs': {fs: REF2, util: {}, assert: REF0, path: REF1, child_process: REF3} }
    , util: REF2
    , assert: REF0
    , query: {'query/query': {inspect: REF4}} }
  , inspect: REF4
  , 'style/error': {style: {'style/style': REF5 = {}}}
  , style: REF3
  , '/home/dominic/dev/miniorm/test/miniorm-async.asynct.js': REF6 = 
  { 'miniorm/miniorm-async': REF7 = 
  { dirty: { 'dirty/lib/dirty': {'dirty/lib/dirty/dirty': {fs: REF2, sys: {}, events: REF8 = {}}} }
      , curry: {'curry/curry': {}}
      , 'traverser/iterators': {logger: {'style/error': REF1, style: REF3, inspect: REF4}, curry: REF5}
      , logger: REF7 }
    , it: { 'it/it': { 'c-assert': { 'c-assert/c-assert': { assert: REF0
            , 'traverser/equals': { 'traverser/traverser2': { inspect: REF4
                , logger: REF7
                , curry: REF5
                , 'traverser/iterators': REF6 }
              , logger: REF7
              , style: REF3 }
            , style: REF3 } }
        , 'it/assert': { assert: REF0
          , 'traverser/traverser2': REF8
          , logger: REF7
          , inspect: REF4 }
        , logger: REF7
        , inspect: REF4
        , 'render/render2': {traverser: {'traverser/traverser2': REF8}, logger: REF7} } } } } }
        
var untangle = require('trees').untangle
  , equals = require('trees').equals
  , inspect = require('sys').inspect
  , assert = require('assert')
  , log = console.log
  
exports ['untangle complex graphs'] = function (){

var untangled = untangle.untangle(complex)
var retangled =  untangle.retangle(untangled)
  
  log(
    '\n##############################################\n'
  , "COMPLEX\n"
  , complex
  , '\n##############################################\n'
  , "UNTANGLED\n"
  , untangled
  , '\n##############################################\n'
  , "RETANGLED\n"
  , retangled
  , '\n##############################################\n\n')

  , jsoned = untangle.parse(untangle.stringify(complex))

  assert.ok(!equals.graphs(wrong,complex).eq,'equals.graphs returned equal for wrong and complex ')
  assert.equal(inspect(untangled),inspect(complex))
  assert.equal(inspect(jsoned),inspect(complex))
  assert.ok(equals.graphs(retangled,complex).eq,'equals.graphs returned equal for retangled and complex ')
  assert.ok(equals.graphs(jsoned,complex).eq,'equals.graphs returned equal for retangled and complex ')

//  log(equals.graphs(wrong,complex).message)// I don't have the rendering good enough... so this is not readible.
//  assert.ok(equals.graphs(json,complex))
//  assert.equal(inspect(json),inspect(complex))

}
