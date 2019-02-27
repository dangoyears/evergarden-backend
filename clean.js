const fs = require('fs');
const path = require('path');
const config = require('./config');


var timeSpanMiliseconds = 2 * 60 * 1000;


fs.readdir(config.CACHE_PATH, (err, dirs) => {
    dirs.forEach((dir => {
        let dirpath = path.join(config.CACHE_PATH, dir);
        fs.readdir(dirpath, (err, files) => {
            files.forEach((file => {
                let filepath = path.join(dirpath, file);
                let modifiedDate = fs.lstatSync(filepath).mtime;
                
                if (modifiedDate.getTime() + timeSpanMiliseconds < new Date().getTime()) {
                    fs.unlinkSync(filepath);
                }
            }));
        }) 
    }));
});
