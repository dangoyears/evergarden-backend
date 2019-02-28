// 查询书籍


const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const config = require('./config');
const crawler = require('./crawler');


// 通过标题查询数据
async function queryByTitle(title, sync) {
    if (!title) {  // 如果标题为空，拒绝查询
        return {
            statusCode: -1,
            statusDescription: '查询请求已拒绝，书名不能为空',
        };
    }

    let payload = {};  // 向客户端返回的数据
    let datasources_crawlers = [
        'crawlDangdangTitle'
    ];  // 爬虫
    payload.totalDataSources = datasources_crawlers.length;
    let hash = crypto.createHash('sha1').update(title).digest('hex');
    let filepath = path.join(config.CACHE_PATH, 'query', hash);  // 保存任务状态的文件路径


    // 同步的查询方法
    async function Sync() {  
        let results = [];
        
        for (let i = 0; i < datasources_crawlers.length; ++i) {
            let result = await crawler[datasources_crawlers[i]](title);
            results.push(result);
        }

        return results;
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

    payload.books = sync ? await Sync() : Async();
    return payload;
}


async function middleware(req, res) {
    let sync = req.query['sync'];
    let title = (req.query['title'] || '').trim();

    let startedTime = new Date();
    let payload = await queryByTitle(title, sync);
    let finishedTime = new Date();
    payload['processTime'] = finishedTime.getTime() - startedTime.getTime();
    res.json(payload);
}


module.exports = { middleware };
