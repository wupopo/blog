const apiCtrl=require('../../controller/apiCtrl');
const jwt=require('../../model/jwt');
const Requests = require('../../model/Requests.js');
module.exports=(app)=>{
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

    app.get('/webdata',apiCtrl.getwebdata);  //website data
    app.post('/loginad',urlencodedParser,apiCtrl.adlogin);//admin login
    app.get('/delete_user',apiCtrl.deleteUser);//delete user
    app.get('/userList',apiCtrl.getUserList); //getuserlist
    app.post('/oneuserinfo',urlencodedParser,apiCtrl.getUserone); //get one user info
    app.post('/changeConfig',urlencodedParser,apiCtrl.changepageinfo);
    app.get('/addVlog',apiCtrl.addvlog);
    app.post('/addSubject',urlencodedParser,apiCtrl.addSub);
}