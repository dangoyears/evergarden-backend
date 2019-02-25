// 书籍接口

module.exports = (req, res) => {
    let json = {
        title: '十万个为什么',
        author: '王维'
    }
    res.json(json);
};
