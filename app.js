const express=require("express");
const app=express();
const fs = require('fs');
const path=require('path');
const http = require('http');
const https = require('https');
const crypto = require("crypto");
const io = require('socket.io')(http);
const uploadfile=require("./model/uploadfile.js");
uploadfile(app);
const cookieParser=require('cookie-parser');
const routes=require("./routes/router.js");
const controller=require("./controller/controller.js");
/*var multer  = require('multer');*/
//配置静态资源文件
app.use(express.static("Public"));
//配置模板引擎
/*app.use(multer({ dest: './data/userimg'}).array('image'));*/
app.set("view engine","ejs");
app.use(cookieParser());
routes(app);
controller.requests(app);

//数据实现更新方法
/*
io.on('connection', function(socket){
    console.log('a user connected');
});
*/
const options={
    key:fs.readFileSync('./key/2_www.wupopo.club.key'),
    cert:fs.readFileSync('./key/1_www.wupopo.club_bundle.crt')
};
const httpsServer = https.createServer(options,app);
const httpServer = http.createServer(app);

httpsServer.listen(3001, function() {
    console.log('HTTPS Server is running on: https://localhost:%s', 3001);
});
httpServer.listen(3000, function(){
    console.log('HTTP Server is running on: http://127.0.0.1:%s',3000);
});