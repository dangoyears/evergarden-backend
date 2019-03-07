// 图像路由


const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const config = require('./config');
const crawlers = require('./crawler');


function getImageByUrl(url)
{
    let dangdang_pattern = /.*?ddimg.cn.*/;
    
    if (dangdang_pattern.test(url)) {
        let crawler = crawlers.DangdangCrawler.getBookByUrl;
    }
}


async function middleware(req, res) {
    let image_base_path = path.join(config.CACHE_PATH, 'image');

    let image_url = (req.query['url'] || '').trim();
    if (!image_url) {
        res.status(400);
        res.send('请求中必须包含url参数。');
    }

    // @todo 创建hash.raw和hash.info一遍对图像的元数据进行处理

    let hash = crypto.createHash('sha1').update('image_url').digest('hex');
    try {
        let image_path = path.resolve(path.join(image_base_path, hash));
        if (fs.existsSync(image_path)) {
            res.sendFile(image_path);
        }
        else {
            res.send(hash);
        }
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = {
    middleware
}
