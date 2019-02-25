const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');


// 监听端口
const PORT = 3000;


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


// 路由
fs.readdirSync(path.join(__dirname, 'route')).forEach((filename) => {
    if (!filename.match(/.js$/i)) return;
    let route = '/' + filename.replace(/.js$/i, '').replace('_', '/');
    let middleware = require(path.join(__dirname, 'route', filename));

    app.get(route, middleware);
});


app.listen(PORT, () => {
    console.log(`Evergarden API service is running at port ${PORT}.`);
});
