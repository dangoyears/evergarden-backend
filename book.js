// 书籍查询接口


async function middleware(req, res) {

    let startedTime = new Date();
    let payload = '未实现。';
    let finishedTime = new Date();
    payload['during'] = finishedTime.getTime() - startedTime.getTime();
    res.json(payload);
}

module.exports = {
    middleware
};
