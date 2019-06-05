const querysql = require('../model/querysql.js');
const permissions = require('../model/permissions.js');

/************公共接口控制**************/
exports.changInfoApi = (req, res) => {
    let operator;
    let role;
    let username;
    if (req.session.userinfo) {
        operator = req.session.userinfo.username;
        role = 'user';
        username=operator;
    } else if (req.session.admininfo) {
        operator = req.session.admininfo.username;
        role = 'admin';
        username=req.query['username'];
    } else {
        res.status(403).send({code: 403, data: [], msg: "请登录后进行此操作！"})
        return;
    }
    let dataObj = {
        operator: operator,
        role: role,
        name: req.query['name'],
        username:username,
        phone: req.query['phone'],
        mail: req.query['mail'],
        sex: req.query['sex'],
        age: req.query['age']
    };
    querysql.changInfoM(dataObj,function (data) {
        res.status(data.code).send(data);
    })
};