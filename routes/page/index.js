var pageCtrl = require("../../controller/pageCtrl.js");
var session = require('express-session');
module.exports=app=>{
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


    app.get("/", pageCtrl.indexPage);
    app.get('/blog', pageCtrl.blogPage);
    app.get('/blog/:bid', pageCtrl.blogDetailsPage);
    app.get('/login',pageCtrl.loginPage);
    app.get('/registered', pageCtrl.registeredPage);
    app.get('/Vlog', pageCtrl.vlogPage);
    app.get('/Vlog/:id', pageCtrl.vlogDetailsPage);
    app.get('/home/:username', pageCtrl.homePage);
    app.get('/adlogin', pageCtrl.adminLoginPage);
    app.get('/admin', pageCtrl.adminPage);
};