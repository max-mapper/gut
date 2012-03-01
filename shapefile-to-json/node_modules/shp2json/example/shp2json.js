var toJSON = require('../');
toJSON(process.stdin).pipe(process.stdout);
process.stdin.resume();
