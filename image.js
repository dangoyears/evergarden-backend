// 图像路由


const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const config = require('./config');
const crawlers = require('./crawler');


async function getImageByUrl(url)
{
    let dangdang_pattern = /.*?ddimg.cn.*/;
    
    if (dangdang_pattern.test(url)) {
        let crawler = crawlers.DangdangCrawler.getImageByUrl;
        let image = await crawler(url);
        
        console.log(image.info, image.raw.length);
    }
}


// 检查指定hash的图像的完整性
// 即检查指定图像是否存在、图像的元数据信息是否完整
function existsImage(hash)
{
    return false;
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
        let image_info_path = path.resolve(path.join(image_base_path, hash + '.info'));
        let image_raw_path = path.resolve(path.join(image_base_path, hash + '.raw'));
        if (fs.existsSync(image_info_path)) {
            res.sendFile(image_raw_path);
        }
        else {
            res.send(hash);
            await getImageByUrl(image_url);
        }
        console.log(image_info_path, image_raw_path);
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = {
    middleware
}
