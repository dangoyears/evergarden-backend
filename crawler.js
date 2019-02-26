// 爬虫


const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const request = require('request');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');


function crawl(title) {
    let url_path = 'http://search.dangdang.com/';  // 当当网搜索主页
    let url_querystring = querystring.stringify({
        key: title,
        category_path: '01.00.00.00.00.00'  // 指定仅在图书分类下搜索
    })

    let url = `${url_path}?${url_querystring}`;
    request(
        {
            uri: url,
            encoding: null
        },
        function (err, res, body) {
            if (!err) {
                let charset = res.headers["content-type"].match(/charset=(.*)$/)[1];  // 获取网页编码
                body = iconv.decode(body, charset).toString();  // 解码网页

                const $ = cheerio.load(body);
                $('div [dd_name=普通商品区域] ul').each((i, elem) => {
                    
                });
                fs.writeFileSync(path.join(__dirname, 'cache', 'dangdang.html'), html.html());
            }
        }
    );
}

module.exports = crawl;
