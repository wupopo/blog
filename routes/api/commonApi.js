
const apiCtrl=require('../../controller/apiCtrl');
const jwt=require('../../model/jwt');
module.exports = (app) => {
   /* app.use(session({
        secret: 'keyboard cat',
        resave: false,
        name: 'EtCHHAiKL',
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 3, httpOnly: true
        }
        //cookie: { secure: true }   /!*secure https这样的情况才可以访问cookie*!/
    }));*/

    app.use(function (err, req, res, next) {
        if (err) {
            console.error(err.stack)
            res.status(500).send('Something broke!');
            return;
        }
        next();
    });

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
    app.get('/changeinfo',apiCtrl.changInfoApi);//信息修改api
    app.get('/exit',apiCtrl.exitApi);//退出登录api
    app.get('/deleteblog',apiCtrl.deleteBlogApi); //删除博客api
    app.get('/vc',apiCtrl.vcodeApi);  //验证码api
};