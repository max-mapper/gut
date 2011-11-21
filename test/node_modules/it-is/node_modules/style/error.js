var style = require('style');

exports.printError = printError
function printError(error){
  colourError(error,false)
}

exports.parseStackLine = parseStackLine
function parseStackLine (row){
  var regex = /^\s*?at\s+([\w\.\-\_\<\>]*)?\s*\(?([\[\ \]\/\-\_\w\.]+)/g //
      lines = /.*?\:(\d+)\:(\d+)/
    , m = regex.exec(row)
    , ln = lines.exec(row)
    , line = {}
  if (m){
   line = { function: m[1]
    , file: m[2]
    , line: (ln ? 1 * ln[1] : undefined)
    , column:  (ln ? 1 * ln[2] : undefined) } } 
    
  line.unmatched = row
  return line    
}

exports.parseError = parseError
function parseError(error){
  var obj

/*  if(!error)
    return style('' + error).red
*/
  obj = 
    { name: ('object' == typeof error && error != null) ? (error.name || error.constructor.name) : 'thrown'
    }
    if(error && error.stack){
      var stack = stackStr = error.stack.split("\n")
      obj.stack = stack.map(parseStackLine)
    } else {
      obj.message = (error && error.message) || '' + error 
      obj.stack = [{unmatched: '[no stack trace]'}] // same format as a propper error, so printing is easy
    }
  return obj
}

exports.styleError = colourError
function colourError(error,enable){
  
  style = style.enable(enable === false ? false : true)
  var s = parsed = parseError(error)
  
  s = style(parsed.name).red.bold + ": " + (parsed.message ? style(parsed.message).yellow.bold : "")
  s += "\n"
  s += parsed.stack.map(function (row){
    if(row.file){
      var file = row.file.replace(process.ENV.NODE_PATH,'$')

      return style(style(" " + row.function).yellow.rpad(30,style('.').grey)
          + " "
          + style(file).white.bold).rpad(70,style('.').grey)
        + style(row.line || '?').lpad(3,style('.').grey).cyan
        + ":"
        + style(row.column || '?').lpad(3,style('.').grey).magenta
    }
    return (row.unmatched)
  }).join("\n") + "\n" //+ end
  
  //console.log(s)
  return s
}
