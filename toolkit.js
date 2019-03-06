// 实用程序


const fs = require('fs');
const path = require('path');
const config = require('./config');


// 清理缓存目录中存在时间超过config.CACHE_EXPIRATION_MS中指定毫秒数的文件
function cleanCache() {
    let unlink_count = 0;

    fs.readdirSync(config.CACHE_PATH).forEach((dir) => {
        let dirpath = path.join(config.CACHE_PATH, dir);

        try {
            fs.readdirSync(dirpath).forEach((file => {
                let filepath = path.join(dirpath, file);
                let modifiedDate = fs.lstatSync(filepath).mtime;
                
                if (modifiedDate.getTime() + config.CACHE_EXPIRATION_MS < new Date().getTime()) {
                    fs.unlinkSync(filepath);
                    unlink_count++;
                }
            }));
        }
        catch (err) {
            if (err.code !== 'ENOTDIR') {
                console.log(err);  // 打印除“指定路径不是目录”之外的错误
            }
        }
    });

    console.log(`${new Date()}，清理的文件的数量：${unlink_count}`);
}


module.exports = {
    cleanCache
};
