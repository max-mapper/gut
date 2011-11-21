<h1>colors.js - get color and style in your node.js console like what</h1>

<img src="http://i.imgur.com/goJdO.png" border = "0"/>

       var sys = require('sys');
       var style = require('style');

       sys.puts(style('hello').green); // outputs green text
       sys.puts(style('i like cake and pies').underline.red) // outputs red underlined text
       sys.puts(style('inverse the color').inverse); // inverses the color
       sys.puts(style('OMG Rainbows!').rainbow); // rainbow (ignores spaces)
       
##disable style, for plain output
       
       style = require('style').enable(false) //... which you may want to do at some point!
       
       sys.puts(style('hello').green); // plain text
       sys.puts(style('i like cake and pies').underline.red) // plain text
       sys.puts(style('inverse the color').inverse); // plain text
       sys.puts(style('OMG Rainbows!').rainbow); // plain text
       
       //ALSO: does not monkeypatch string with 13 new properties!
       
## ALSO! pad your strings:

    style("hello").lpad(20)
    "               hello"
    style("goodbye").rpad(20,".")
    "goodbye.............."

    you can even style you padding

    style("goodbye").rpad(20,style(".").grey)
    
    style is aware of it self, and will style the pading as one chunk.
    when style is disabled, padding will still be the same size.

## remove style information:

    style.destyle( 'styled string' )
      
##colors and styles!##
- bold
- italic
- underline
- inverse
- yellow
- cyan
- white
- magenta
- green
- red
- grey
- blue
- black



## run tests

    >npm install expresso
    >expresso style.expresso.js

### Authors 

#### Alexis Sellier (cloudhead) , Marak Squires , Justin Campbell, Dominic Tarr
