const fs = require('fs');
const path = require('path');
const config = require('./config');


// 清理缓存目录中存在时间超过config.CACHE_EXPIRATION_MS中指定毫秒数的文件
function cleanCache() {
    fs.readdir(config.CACHE_PATH, (err, dirs) => {
        dirs.forEach((dir => {
            let dirpath = path.join(config.CACHE_PATH, dir);
            fs.readdir(dirpath, (err, files) => {
                if (!err) {
                    files.forEach((file => {
                        let filepath = path.join(dirpath, file);
                        let modifiedDate = fs.lstatSync(filepath).mtime;
                        
                        if (modifiedDate.getTime() + config.CACHE_EXPIRATION_MS < new Date().getTime()) {
                            fs.unlinkSync(filepath);
                        }
                    }));
                }
            });
        }));
    });
}


module.exports = {
    cleanCache
};
