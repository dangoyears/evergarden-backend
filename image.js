// 图像路由


const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const config = require('./config');
const crawlers = require('./crawler');


// 通过URL爬取图片
async function getImageByUrl(url)
{
    let dangdang_pattern = /.*?ddimg.cn.*/;
    
    if (dangdang_pattern.test(url)) {
        let crawler = crawlers.DangdangCrawler.getImageByUrl;
        return await crawler(url);
    }
}


async function middleware(req, res) {
    let image_base_path = path.join(config.CACHE_PATH, 'image');

    let image_url = (req.query['url'] || '').trim();
    if (!image_url) {
        res.status(400);
        res.send('请求中必须包含url参数。');
        return;
    }

    let hash = crypto.createHash('sha1').update(image_url).digest('hex');
    try {
        let image_info_path = path.resolve(path.join(image_base_path, hash + '.info'));
        let image_raw_path = path.resolve(path.join(image_base_path, hash + '.raw'));
        if (fs.existsSync(image_info_path) && fs.existsSync(image_raw_path)) {
            let content_type = fs.readFileSync(image_info_path).toString();
            res.setHeader('content-type', content_type);
            res.sendFile(image_raw_path);
        }
        else {
            res.status(202);
            res.send('正在爬取图片。');
            let image = await getImageByUrl(image_url);
            fs.writeFileSync(image_raw_path, image.raw);
            fs.writeFileSync(image_info_path, image.info);
        }
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = {
    middleware
};
