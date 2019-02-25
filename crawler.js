// 爬虫


const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const request = require('request');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');


function crawl(title) {
    let url_path = 'http://search.dangdang.com/';
    let url_querystring = querystring.stringify({
        key: title,
        category_path: '01.00.00.00.00.00'  // 图书分类
    })

    console.log(`${url_path}?${url_querystring}`);
    request(
        {
            uri: `${url_path}?${url_querystring}`,
            encoding: null
        },
        function (err, res, body) {
            if (!err) {
                body = iconv.decode(body, 'gb2312').toString();
                fs.writeFileSync(path.join(__dirname, 'cache', 'dangdang.html'), body);
            }
        }
    );
}

module.exports = crawl;
