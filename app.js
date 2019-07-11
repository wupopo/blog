const express=require("express");
const app=express();
const fs = require('fs');

const http = require('http');
const https = require('https');
//uploadFile getKey
const uploadfile=require("./model/uploadfile.js");
uploadfile(app);
const crypto = require("crypto");
const io = require('socket.io')(http);
app.use(express.json());
const cookieParser=require('cookie-parser');

const session = require('express-session');
 app.use(session({
        secret: 'this is code',
        resave: true,
        name: 'THIS_IS_CODE',
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 3, httpOnly: true
        }
        //cookie: { secure: true }   /*secure https这样的情况才可以访问cookie*/
    }));



//路由文件
require("./routes/page")(app);
require("./routes/api/commonApi")(app);
require("./routes/api/frontApi")(app);
require("./routes/api/adminApi")(app);



/*var multer  = require('multer');*/
//配置静态资源文件
app.use(express.static("Public"));
//配置模板引擎
/*app.use(multer({ dest: './data/userimg'}).array('image'));*/
app.set("view engine","ejs");
app.use(cookieParser());



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