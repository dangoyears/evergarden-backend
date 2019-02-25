const express = require('express');
const bodyParser = require('body-parser');



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


// Book接口
app.get('/book/', (req, res) => {
    res.send(req.query['title']);
});


app.listen(PORT, () => {
    console.log(`Evergarden API service is running at port ${PORT}.`);
});
