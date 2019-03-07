// 书籍查询接口


const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const crawlers = require('./crawler');
const config = require('./config');


async function getBookByUrl(book_url) {
    let payload = {};  // 返回客户端的数据

    if (!book_url) {
        payload.code = 400;
        payload.message = '书籍URL不能为空';
        return payload;
    }

    let hash = crypto.createHash('sha1').update(book_url).digest('hex');
    let filepath = path.join(config.CACHE_PATH, 'list', hash);  // 保存任务状态的文件路径

    // 检查是否有同URL的查询
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

    let dangdang_pattern = /.*?product.dangdang.com\/.*/;

    if (dangdang_pattern.test(book_url)) {
        let crawler = crawlers.DangdangCrawler.getBookByUrl;
        payload.info = await crawler(book_url);
        payload.info.provider = 'dangdang';
        payload.code = 200;
    }
    else {
        payload.code = 400;
        payload.message = '不能解析书籍URL';
    }

    payload.date = new Date();
    return payload;
}


async function middleware(req, res) {
    let book_url = (req.query['url'] || '').trim();

    let startedTime = new Date();
    let payload = await getBookByUrl(book_url);
    let finishedTime = new Date();
    payload['during'] = finishedTime.getTime() - startedTime.getTime();
    res.json(payload);
}


module.exports = {
    middleware
};
