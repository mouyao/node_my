var http = require('http');//内置的http模块，提供http服务器和客户端服务
var fs  = require('fs');  //文件处理模块，读取写入内容到本地
var path = require('path'); //提供与文件系统路径相关的功能
var mime = require('mime');//有根据文件名得出mime类型的能力
var cache = {}; //用来缓存文件内容的对象

//当出错时，返回错误信息
function send404(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Error 404: resource not found.');
  response.end();
}

//将获取到的页面路径返回给浏览器
function sendFile(response, filePath, fileContents) {
  response.writeHead(200,{"content-type": mime.lookup(path.basename(filePath))});
  response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
  if (cache[absPath]) {
    sendFile(response, absPath, cache[absPath]);
  } else {
    fs.exists(absPath, function(exists) {
      if (exists) {
        fs.readFile(absPath, function(err, data) {
          if (err) {
            send404(response);
          } else {
            cache[absPath] = data;
            sendFile(response, absPath, data); //将获取到的页面内容返回给浏览器
          }
        });
      } else {
        send404(response);
      }
    });
  }
}


//创建服务器，建立
  var server = http.createServer(function(request, response) {
  var filePath = false;
  if (request.url == '/') {
    filePath = 'public/index.html';
  } else {
    filePath = 'public' + request.url;
  }

  var absPath = './' + filePath;
   console.log(response+cache+absPath+"测试的三个数据");
   console.log(filePath+"测试路径");
  serveStatic(response, cache, absPath);  //建立页面和端口号之间的路径；
});


var  autoOpenPage= require('child_process'); 
server.listen(3000, function() {
    autoOpenPage.exec("start http:192.168.0.4:3000"); //自动调用默认浏览器打开这个链接
    console.log("Server listening on port 3000.");
});


//引入后台聊天服务器，后台服务器监控前端服务器的消息转发情况，做好消息的转发；
var chatServer = require('./lib/chat_server');
chatServer.listen(server); 
