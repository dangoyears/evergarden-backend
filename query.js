// 查询书籍


const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const config = require('./config');
const crawler = require('./crawler');


// 通过标题查询数据
async function queryByTitle(title, sync) {
    let payload = {
        code: 0,
        message: '',
    };  // 向客户端返回的数据


    if (!title) {  // 如果标题为空，拒绝查询
        payload.code = -1;
        payload.message = '标题不能为空。';
        return payload;
    }

    // 数据源
    let datasources_crawlers = [
        'crawlDangdangTitle'
    ]; 
    let hash = crypto.createHash('sha1').update(title).digest('hex');
    let filepath = path.join(config.CACHE_PATH, 'query', hash);  // 保存任务状态的文件路径


    // 检查是否有同标题的查询
    if (fs.existsSync(filepath)) {
        // 若有，检查该查询是否在5分钟内进行过
        if (new Date().getTime() - fs.lstatSync(filepath).mtime <= 1000 * 60 * 5) {
            // 若为5分钟内进行的查询，则直接返回该查询
            try {
                payload = JSON.parse(fs.readFileSync(filepath).toString());
                payload.code = 2;
                payload.message = '从缓存中读取查询。';
                return payload;
            }
            catch (err) {
                fs.unlink(filepath, () => {});
            }
        }
    }


    // 同步的查询方法
    async function Sync() {  
        let books = [];
        
        for (let i = 0; i < datasources_crawlers.length; ++i) {
            let result = await crawler[datasources_crawlers[i]](title);
            result.forEach((book) => books.push(book));
        }

        payload.code = 1;
        payload.message = '查询已完成。';
        payload.books = books;

        // 将查询的结果写入文件保存
        fs.writeFile(filepath, JSON.stringify(payload), (err) => {
            console.log(err);
        });
    }


    // 异步的查询方法
    function Async() {
        let books = [];

        payload.code = 0;
        payload.message = '正在查询';

        datasources_crawlers.forEach((name) => {
            crawler[name](title);
        });
        fs.writeFileSync(filepath, JSON.stringify(payload));

        // 所有爬取操作完成后的回调函数
        function finished(books) {
            payload = JSON.parse(fs.readFileSync(filepath).toString());
            payload.code = 1;
            payload.message = '查询已完成。';
            payload.books = books;
            fs.writeFile(filepath, JSON.stringify(payload), () => {});
        }
    }

    sync ? await Sync() : Async();
    return payload;
}


async function middleware(req, res) {
    let sync = req.query['sync'];
    let title = (req.query['title'] || '').trim();

    let startedTime = new Date();
    let payload = await queryByTitle(title, sync);
    let finishedTime = new Date();
    payload['during'] = finishedTime.getTime() - startedTime.getTime();
    res.json(payload);
}


module.exports = { middleware };
