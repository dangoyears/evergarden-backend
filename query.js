// 查询书籍


const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const config = require('./config');
const crawler = require('./crawler');


// 通过标题搜索书籍，返回JSON搜索结果
function query_by_title(title, sync) {
    if (!title) {
        return {
            statusCode: -1,
            statusDescription: '查询请求已拒绝，书名不能为空'
        };
    }

    let payload;
    let hash = crypto.createHash('sha1').update(title).digest('hex');
    let filepath = path.join(config.CACHE_PATH, 'query', `ST${hash}`);  // 保存任务状态的文件路径

    // 判断此次查询是否正在进行
    try {
        payload = JSON.parse(fs.readFileSync(filepath).toString());
    } 
    catch(e) {
        // 若文件不存在则开始爬取
        if (sync) {
            // 同步爬取，等所有爬取任务结束后合并结果再返回
            // 正在实现
        }
        else {
            // 异步爬取
            payload = {
                statusCode: 1,
                statusDescription: '查询请求已接受，正在爬取'
            };
            fs.writeFileSync(filepath, JSON.stringify(payload));

            function finished(books) {
                payload = JSON.parse(fs.readFileSync(filepath).toString());
                payload.statusCode = 2;
                payload.statusDescription = '查询请求已完成'
                payload.books = books;
                fs.writeFileSync(filepath, JSON.stringify(payload));
            }

            crawler(title, finished);
        }
    }

    return payload;
}


function middleware(req, res) {
    let sync = req.query['sync'];
    let title = (req.query['title'] || '').trim();

    res.json(query_by_title(title, sync));
}


module.exports = { middleware };
