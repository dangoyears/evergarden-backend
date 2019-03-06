// 书籍查询接口


const crawlers = require('./crawler');


async function getBookByUrl(book_url) {
    let payload = {};  // 返回客户端的数据

    if (!book_url) {
        payload.code = 400;
        payload.message = '书籍URL不能为空';
        return payload;
    }

    let dangdang_pattern = /.*?product.dangdang.com\/.*/;

    if (dangdang_pattern.test(book_url)) {
        let crawler = crawlers.DangdangCrawler.getBook;
        payload.info = await crawler(book_url);
    }
    else {
        payload.code = 400;
        payload.message = '不能解析书籍URL';
    }

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
