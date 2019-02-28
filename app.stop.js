const fs = require('fs');
const path = require('path');
const config = require('./config');


// 允许通过`node app.stop.js --stop`杀死进程
if (process.argv[2] && process.argv[2].toLowerCase() === '--stop') {
    let pid = parseInt(fs.readFileSync(path.join(config.CACHE_PATH, 'PID')).toString());
    process.kill(pid);
}
