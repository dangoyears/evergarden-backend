// 爬虫


const util = require('util');
const querystring = require('querystring');
const request = require('request');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');


// 当当网爬虫
var DangdangCrawler = {
    
    // 通过标题获取书单
    getList: async (title) => {
        let url_path = 'http://search.dangdang.com/';  // 当当网搜索主页
        let url_querystring = querystring.stringify({
            key: title,
            category_path: '01.00.00.00.00.00'  // 指定仅在图书分类下搜索
        });
        let url = `${url_path}?${url_querystring}`;
    
        let books = [];  // 爬取的书籍数据
        let request_promise = util.promisify(request);
        await request_promise({ uri: url, encoding: null})
            .then((ret) => {
                let headers = ret.headers, body = ret.body;
    
                let charset = headers['content-type'].match(/charset=(.*)$/)[1];  // 获取网页编码
                body = iconv.decode(body, charset).toString();  // 解码网页
    
                const $ = cheerio.load(body);
                $('div [dd_name=普通商品区域] ul li').each((i, elem) => {
                    let title = $('.name', elem).text();
                    let link = $('.name', elem).children('a').attr('href');
                    let imgUrl = $('a.pic', elem).children('img').attr('data-original') || $('a.pic', elem).children('img').attr('src');
                    let price = $('.search_now_price', elem).text();
                    let detail = $('.detail', elem).text();
                    books.push({
                        title: title,
                        link: link,
                        price: price,
                        imgUrl: imgUrl,
                        detail: detail
                    });
                });
            })
            .catch((err) => {
                console.log(err);
            });
    
        return books;
    },

    // 通过URL获取书籍具体信息
    getBook: async (book_url) => {
        let info = {};  // 爬取的书籍信息
        let request_promise = util.promisify(request);

        await request_promise({ uri: book_url, encoding: null })
            .then((ret) => {
                let headers = ret.headers, body = ret.body;
    
                let charset = headers['content-type'].match(/charset=(.*)$/)[1];  // 获取网页编码
                body = iconv.decode(body, charset).toString();  // 解码网页

                const $ = cheerio.load(body);

                console.log(body);
                info.raw = body;
            })
            .catch((err) => {
                console.log(err);
            });
        
        return info;
    }
};


module.exports = {
    DangdangCrawler
};
