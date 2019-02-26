const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');


// 服务器配置
var config = {
    PORT: 3000,  // 监听端口
};

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
        app.get(route, middleware);
    }
});


app.listen(config.PORT, () => {
    console.log(`Evergarden API service is running at port ${config.PORT}.`);
});


module.exports = { config }
