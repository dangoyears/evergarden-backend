// 服务器状态信息

const os = require('os');


function middleware(req, res) {
    let payload = {
        uptime: os.uptime(),
        loadAverage: os.loadavg(),
        memoryUsage: `${os.freemem() / os.totalmem() * 100}%`
    };
    res.json(payload);
}


module.exports = {
    middleware
};
