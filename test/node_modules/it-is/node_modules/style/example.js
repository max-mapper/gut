var log = console.log
var style = require('./style');

log("" + style('Rainbows are fun!').rainbow);
log("" + style('So ').italic + style('are').underline + style(' styles! ').bold + style('inverse').inverse); // styles not widely supported
log("" + style('Chains are also cool.').bold.italic.underline.red); // styles not widely supported
