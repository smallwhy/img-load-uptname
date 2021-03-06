const cheerio = require('cheerio');
var fs = require('fs');
var request = require('request');

// 读取输出到目录的所有文件名 - 到下载文件不全或错误时可使用
let imgNames = []
const files = fs.readdirSync('./images-2')
files.forEach(function (item, index) {
    imgNames.push(item);
});
console.log('images-2文件夹下的所有文件的文件名' + imgNames.join(','));

// 输出图片文件
fs.readFile("./index.html","utf-8",function(err,data){ // 读取文件index.html
    if(err) {
      console.log("index.html loading is failed :"+err);
    }
    else{
        //返回index.html页面
        var $ = cheerio.load(data); // data为index.html内容
        var tr_list = $('table tr');
        tr_list.each((index, item) => {
            var imgName = $(item).find('td').eq(0).text(); // 下载文件的最终命名
            var imgUrl = $(item).find('td').eq(1).text(); // 下载文件的URL
            var writeStream = fs.createWriteStream('./imgs/'+imgName + imgUrl.substring(imgUrl.lastIndexOf('.'))); // 创建写入流
            var readStream = request(imgUrl); // 读取流
            readStream.pipe(writeStream);
            readStream.on('end', function() { // 读取文件
                console.log('文件下载成功');
            });
            readStream.on('error', function() {
                console.log("错误信息:" + err)
            });
            writeStream.on("finish", function() { // 写入文件
                console.log("文件写入成功");
                writeStream.end();
            });
        });
    }

});

