// 爬虫


const fs = require('fs');
const request = require('request');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');


function crawl(title) {
    request(
        {
            uri:`http://search.dangdang.com/?key=${title}&category_path=01.00.00.00.00.00`,
            encoding: null
        },
        function (err, res, body) {
            body = iconv.decode(body, 'gb2312').toString();
            
        }
    );
}

module.exports = crawl;
