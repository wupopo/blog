const session = require('express-session');
const apiCtrl = require('../../controller/apiCtrl');
var uploadBlogimg = require("../../model/uploadBlogimg.js");
module.exports = (app) => {
    app.use(function (err, req, res, next) {
        if (err) {
            console.error(err.stack)
            res.status(500).send('Something broke!');
            return;
        }
        next();
    });
    const bodyParser = require('body-parser');
    let urlencodedParser = bodyParser.urlencoded({extended: false});
    const jwt=require('../../model/jwt');
    app.use((req, res, next) => {
        if(req.headers.authorization){
            let token = String(req.headers.authorization.split(" ").pop());
            let newjwt=new jwt({token});
            req.userinfo=newjwt.getJWT();
        }else {
            req.userinfo={};
        }
        next();
    })

    app.get('/registereds', apiCtrl.registeredApi);
    app.post('/logins',urlencodedParser, apiCtrl.userLogin);
    app.get('/isLogin',apiCtrl.isLogin);
    app.post('/getmsg',urlencodedParser,apiCtrl.getmsg);
    app.get('/sendcomm',apiCtrl.sendComm);
    app.get('/like',apiCtrl.like);
    app.post('/sendblog',urlencodedParser,apiCtrl.sendblog);
    app.get('/retrieve',apiCtrl.findBackPwd);
    app.get('/setuserimg',apiCtrl.setUserimg);
    app.post('/upblogimg', uploadBlogimg.uploadfile);   //博客图片上传到服务器
    app.post('/search',urlencodedParser,apiCtrl.search);
    app.post('/getComments',urlencodedParser,apiCtrl.getComment);
    app.get('/readIt',apiCtrl.readMsgAll);
    app.post("/getVlog", urlencodedParser,apiCtrl.getvlog);
    app.get('/getSublist',apiCtrl.getSublist)
};