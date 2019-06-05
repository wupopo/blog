const session = require('express-session');
const apiCtrl=require('../../controller/apiCtrl');
module.exports = (app) => {
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        name: 'EtCHHAiKL',
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 3, httpOnly: true
        }
        //cookie: { secure: true }   /*secure https这样的情况才可以访问cookie*/
    }));

    app.use(function (err, req, res, next) {
        if (err) {
            console.error(err.stack)
            res.status(500).send('Something broke!');
            return;
        }
        next();
    });


    app.get('/changeinfo',apiCtrl.changInfoApi);//信息修改api
};