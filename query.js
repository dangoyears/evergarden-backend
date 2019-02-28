// 查询书籍


const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const config = require('./config');
const crawler = require('./crawler');


// 通过同步方法返回数据
function queryByTitle(title, sync) {
    if (!title) {  // 如果标题为空，拒绝查询
        return {
            statusCode: -1,
            statusDescription: '查询请求已拒绝，书名不能为空',
        };
    }

    let payload;  // 返回的JSON数据
    let hash = crypto.createHash('sha1').update(title).digest('hex');
    let filepath = path.join(config.CACHE_PATH, 'query', hash);  // 保存任务状态的文件路径


    // 同步的查询方法
    function Sync() {
        let missons = [
            'crawlDangdang'
        ];
        let results = [];
        
        missons.forEach((misson) => {
            let result = await crawler[misson]();
        });
    }


    // 异步的查询方法
    function Async() {
        // 所有爬取操作完成后的回调函数
        function finished(books) {
            payload = JSON.parse(fs.readFileSync(filepath).toString());
            payload.statusCode = 2;
            payload.statusDescription = '查询请求已完成';
            payload.books = books;
            fs.writeFileSync(filepath, JSON.stringify(payload));
        }
    }

    return sync ? Sync() : Async();
}


function middleware(req, res) {
    let sync = req.query['sync'];
    let title = (req.query['title'] || '').trim();

    let startedTime = new Date();
    let payload = queryByTitle(title, sync)
    let finishedTime = new Date();
    payload['processTime'] = finishedTime.getTime() - startedTime.getTime();
    res.json(payload);
}


module.exports = { middleware };
