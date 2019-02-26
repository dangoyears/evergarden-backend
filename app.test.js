const cheerio = require('cheerio');

// CheerIO测试

let html = `<ul id="fruits">
<li class="orange">
Orange
<p>hello</p>
<li class="apple">
    Apple
    <p>123</p>
</li>
</li>
<li class="pear">Pear</li>
</ul>`

let $ = cheerio.load(html);


$('p').each((i, elem) => {
    console.log(elem.nodeValue);
    let q = $(elem);
});
