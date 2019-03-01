// 应用程序入口


const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const toolkit = require('./toolkit');


// 检查命令行参数
if (process.argv[2]) {
    
    // 允许通过`node app.js --stop`杀死进程
    if (process.argv[2].toLowerCase() === '--stop') {
        let pid_file_path = path.join(config.CACHE_PATH, 'PID');
        let pid = parseInt(fs.readFileSync(pid_file_path).toString());
        console.log('Evergarden API service is shutting down.');
        process.kill(pid, 'SIGTERM');
        fs.unlinkSync(pid_file_path);
        process.exit();
    }

    // 允许通过`node app.js --clean`来清理缓存目录
    if (process.argv[2].toLowerCase() === '--clean') {
        toolkit.cleanCache();
        return;
    }
}


// 确保缓存文件夹可用
['/', '/list', '/crawler'].forEach((dir) => {
    let dirpath = path.join(config.CACHE_PATH, dir);
    if (!fs.existsSync(dirpath) || !fs.lstatSync(dirpath).isDirectory()) {
        fs.mkdirSync(dirpath);
    }
});


// 将进程ID写入缓存目录中的PID文件
fs.writeFileSync(path.join(config.CACHE_PATH, 'PID'), process.pid);


// Express路由
const app = express();


// CORS
app.use((req, res, next) => {
    res.header({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': req.headers.origin || '*',
        'Access-Control-Allow-Headers': 'X-Requested-With',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
    });
    next();
});


// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// 静态文件
app.get(/.*(.jpg)|(.jpeg)/, (req, res) => {
    res.send(__dirname + req.path);
});


// 将定义了middleware函数的模块加入路由
fs.readdirSync(__dirname).forEach((filename) => {
    if (!filename.match(/.js$/i)) return;
    let middleware = require(path.join(__dirname, filename)).middleware;

    if (middleware && typeof middleware === 'function') {
        let route = '/' + filename.replace(/.js$/i, '');
        app.all(route, middleware);
    }
});


// 启动服务器
app.listen(config.PORT, () => {
    console.log(`Evergarden API service is running at port ${config.PORT}.`);
});


// 每隔config.CACHE_EXPIRATION_MS中指定的时间清理缓存
setInterval(toolkit.cleanCache, config.CACHE_EXPIRATION_MS);
