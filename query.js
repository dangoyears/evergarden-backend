// 查询书籍


const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const crawler = require('./crawler');


function search_book(title) {
    let hash = crypto.createHash('sha1').update(title).digest('hex');
    
    return crawler(title);
}


function middleware(req, res) {
    let title = req.query['title'];
    
    if (!title) {
        res.send('必须通过书名查询');
    }
    res.send(search_book(title));
}


module.exports = { middleware };
