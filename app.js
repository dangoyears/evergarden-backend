const express = require('express');
const bodyParser = require('body-parser');

const PORT = 3000;


const app = express();


// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// 静态文件
app.get('.*(.jpg|.jpeg|.png)', (req, res) => {
    console.log(__dirname + path);
});


// Book接口
app.get('/book/', (req, res) => {
    res.send(req.query['title']);
});


app.listen(PORT, () => {
    console.log(`Evergarden API service is running at port ${PORT}.`);
});
