// 书单查询接口


const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const config = require('./config');
const crawlers = require('./crawler');


// 通过标题列出书单
async function listBookByTitle(title, sync) {
    let payload = {};  // 返回的数据

    if (!title) {  // 如果标题为空，拒绝查询
        payload.code = 400;
        payload.message = '标题不能为空';
        return payload;
    }

    // 对各个数据源的爬取动作
    let queries = [
        ['dangdang', crawlers.DangdangCrawler.getListByTitle]
    ]; 
    let hash = crypto.createHash('sha1').update(title).digest('hex');
    let filepath = path.join(config.CACHE_PATH, 'list', hash);  // 保存任务状态的文件路径


    // 检查是否有同标题的查询
    if (fs.existsSync(filepath)) {
        // 若有，检查该查询是否在config.CACHE_EXPIRATION_MS的时限内进行过
        if (new Date().getTime() - fs.lstatSync(filepath).mtime <= config.CACHE_EXPIRATION_MS) {
            // 若为5分钟内进行的查询，则直接采用该查询的信息
            try {
                payload = JSON.parse(fs.readFileSync(filepath).toString());
                
                // 若该查询的状态为200，则修改为304，告知客户端返回的信息为从缓存中读取的信息
                // 否则，不修改查询的状态
                if (payload.code === 200) {
                    payload.code = 304;
                    payload.message = '从缓存中读取的信息';
                }
                return payload;
            }
            catch (err) {
                fs.unlink(filepath, (err) => {
                    console.log(err);
                });
            }
        }
    }


    // 同步的查询方法
    async function Sync() {  
        let books = [];
        
        for (let i = 0; i < queries.length; ++i) {
            let result = await queries[i][1](title);
            result.forEach((book) => {
                book.provider = queries[i][0];
                books.push(book);
            });
        }

        payload.code = 200;
        payload.message = '已列出书单';
        payload.date = new Date();
        payload.books = books;

        // 将查询的结果写入文件保存
        fs.writeFile(filepath, JSON.stringify(payload), (err) => {
            if (err) {
                console.log(err);
            }
        });
    }


    // 异步的查询方法
    async function Async() {
        let books = [];

        payload.code = 206;
        payload.message = '正在列出书单';
        fs.writeFileSync(filepath, JSON.stringify(payload));  // 建立任务

        let task_count = queries.length;
        let finished_count = 0;

        queries.forEach(async (query) => {
            let result = await query[1](title);
            result.forEach((book) => {
                book.provider = query[0];
                books.push(book);
            });
            finished_count++;

            console.log(finished_count, task_count);
            if (task_count === finished_count) {
                payload.code = 200;
                payload.message = '已列出书单';
            }
            payload.date = new Date();
            payload.books = books;
            fs.writeFileSync(filepath, JSON.stringify(payload));
        });
    }

    sync ? await Sync() : Async();
    return payload;
}


async function middleware(req, res) {
    let sync = req.query['sync'];
    let title = (req.query['title'] || '').trim();

    let startedTime = new Date();
    let payload = await listBookByTitle(title, sync);
    let finidshdTime = new Date();
    payload.during = finidshdTime.getTime() - startedTime.getTime();
    res.json(payload);
}


module.exports = { middleware };
