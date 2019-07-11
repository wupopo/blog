const querysql = require('../model/querysql.js');
const permissions = require('../model/permissions.js');
const deleteQcloudfile = require('../model/deleteQcloudfile.js');
const qcloudsms = require('../model/qcloudsms_js.js');
const jwt = require('../model/jwt.js');
/************公共接口控制**************/
exports.changInfoApi = (req, res) => {
    let operator;
    let role;
    let username;
    if (req.userinfo) {
        operator = req.userinfo.username;
        role = 'user';
        username = operator;
    } else if (req.admininfo) {
        operator = req.admininfo.username;
        role = 'admin';
        username = req.query['username'];
    } else {
        res.status(403).send({ code: 403, data: [], msg: "请登录后进行此操作！" })
        return;
    }
    let dataObj = {
        operator: operator,
        role: role,
        name: req.query['name'],
        username: username,
        phone: req.query['phone'],
        mail: req.query['mail'],
        sex: req.query['sex'],
        age: req.query['age']
    };
    querysql.changInfoM(dataObj, function (data) {
        res.status(data.code).send(data);
    })
};

exports.exitApi = (req, res) => {
    var role;
    if (req.query["role"] == "user") {
        req.userinfo = null
    } else if (req.query["role"] == "admin") {
        req.admin = null
    }
    res.cookie(role, '', { expires: new Date(0) });
    res.send('ok');
};

exports.deleteBlogApi = (req, res) => {
    if (!req.session.userinfo) {
        res.status(400).send({ code: 400, data: [], msg: '你没得权限' });
        return;
    }
    var datas = {
        username: req.session.userinfo.username,
        blogid: req.query['blogid'],
        time: req.query['time']
    };
    querysql.blogone(datas.blogid, function (data) {
        if (data) {
            var str = data[0].content;
            var imgReg = /<img src="https:\/\/wupopo-1256296697.cos.ap-chengdu.myqcloud.com.*?(?:>|\/>)/gi;
            var arr = str.match(imgReg);
            if (arr == null) {
                querysql.deleblogbyid(datas, function (data) {
                    res.status(data.code).send(data);
                })
            } else {
                var dataarr = [];
                for (var i = 0; i < arr.length; i++) {
                    var obj = {};
                    var key = arr[i].match(/myqcloud.com\/(\S*)"/)[1];
                    obj.Key = key;
                    dataarr.push(obj);
                }
                console.log(dataarr);
                deleteQcloudfile.deleteimgs(dataarr, function (data) {
                    if (data == "error") {
                        console.log("云端照片删除失败");
                    } else {
                        console.log("云端照片删除成功");
                    }
                    querysql.deleblogbyid(datas, function (data) {
                        res.status(data.code).send(data);
                    })
                })
            }
        }
    })
};

exports.vcodeApi = (req, res) => {
    var phone = req.query['phone'];
    /* req.session.code=1234;
     res.status(200).send({code:200,data:[],msg:'success'});*/
    qcloudsms.sendVC(phone, function (data) {
        if (data.code == 200) {
            let oldobj = req.userinfo;
            let newjwt = new jwt({ oldobj: oldobj, needobj: { vcode: data.data[0] }, timelong: "4800s" });
            let token = newjwt.createJWT();
            res.status(data.code).send({ code: data.code, data: token, msg: data.msg })
            return;
        }
        res.status(data.code).send({ code: data.code, data: [], msg: data.msg })
    });
};

exports.registeredApi = (req, res) => {
    if (Number(req.userinfo.vcode) !== Number(req.query['vc'])) {   //验证验证码
        res.status(400).send({ code: 400, data: [], msg: "验证码错误" });
        return;
    }
    let obj = {
        name: req.query['name'],
        username: req.query['username'],
        password: req.query['password'],
        phone: req.query['phone'],
        pwd: req.query['key']
    }
    querysql.queryReg(obj, function (data) {
        res.status(data.code).send(data);
    })
};
exports.userLogin = (req, res) => {
    let data = {
        user: req.body,
        role: "user"
    }

    querysql.queryLogin(data, function (data) {
        if (data.code == 200) {
            let newjwt = new jwt({ needobj: { username: data.data[0].username }, timelong: "4800s" });
            let token = newjwt.createJWT();
            res.status(data.code).send({
                code: 200,
                token: token,
                msg: "success"
            });
        } else {
            res.status(data.code).send(data);
        }
    })
}

exports.isLogin = (req, res) => {
    if (req.userinfo.username) {
        querysql.getUserOne(req.userinfo.username, function (data) {
            if (data) {
                res.send({
                    islogin: true, user: {
                        username: data.username,
                        name: data.name,
                        sex: data.sex,
                        mail: data.mail,
                        time: data.time,
                        img: data.img,
                        phone: data.phone
                    }
                })
            } else {
                res.send({ islogin: true, user: '用户信息获取失败' });
            }
        })

    } else {
        res.send({ islogin: false, username: [] })
    }
}

let unreadMsg = require('../model/unreadMsg');
exports.getmsg = (req, res) => {
    if (req.userinfo.username) {
        if (req.userinfo.username !== req.body['msg_tofrom_username']) {
            res.status(422).send({ code: 422, data: [], msg: '你没有权限获取此数据' })
        } else {
            unreadMsg.OutUnReadeMsg(req.username, function (data) {
                if (data) {
                    res.status(200).send(data);
                } else {
                    res.status(400).send({ code: 400, data: [], msg: '获取数据出错' });
                }
            })
        }
    } else {
        res.status(422).send({ code: 422, data: [], msg: '登录身份过期' })
    }
}

exports.sendComm = (req, res) => {
    if (req.userinfo.username) {
        let content = req.query['content'];
        let sendername = req.userinfo.username;
        let time = req.query["time"];
        let parent_id = req.query["parent_id"];
        let ancestors_id = req.query["ancestors_id"];
        let data = {
            ancestors_id: ancestors_id,
            parent_id: parent_id,
            content: content,
            owner_username: sendername,
            time: time,
            parent_type: req.query["parent_type"]
        };
        querysql.sendcom(data, function (data) {
            res.status(data.code).send(data);
        })
    } else {
        res.status(403).send({ code: 403, data: [], msg: "请登录后发送评论" });
    }
}

exports.like = (req, res) => {
    if (!req.userinfo.username) {
        res.status(400).send({ code: 400, data: [], msg: "你怎么不登录就点赞啊？" });
    } else {
        let data = {
            type: req.query["type"],
            blogid: req.query['blogid'],
            username: req.userinfo.username
        };
        querysql.likes(data, (data) => {
            res.status(data.code).send(data);
        })
    }
}

exports.getbloglist = (req, res) => {
    let obj = {
        start: req.body['start'],
        end: req.body['end']
    };
    let username;
    if (req.userinfo.username) {
        username = req.userinfo.username;
    } else {
        username = "nologin"
    }
    querysql.queryblogli(obj, (data) => {
        if (data.code !== 200) {
            res.status(data.code).send(data);
        } else {
            res.status(data.code).send({
                code: data.code,
                data: data.data,
                msg: username
            })
        }
    })
}

exports.getwebdata = (req, res) => {
    permissions.adminPer.needLoginTrue(req, (isTrue) => {
        if (isTrue) {
            querysql.webdata((data) => {
                res.status(data.code).send(data);
            });
        } else {
            res.status(400).send({ code: 400, data: [], msg: "你没有权限查看此数据" });
        }
    })
}

exports.adlogin = (req, res) => {
    var obj = {
        user: req.body,
        role: "admin"
    };
    querysql.queryLogin(obj, (data) => {
        if (data.code == 200) {
            let newjwt = new jwt({
                needobj: {
                    username: data.data[0].username
                }, timelong: "4800s"
            });
            let token = newjwt.createJWT();
            res.status(data.code).send({ code: 200, token: token, msg: "success" })
        } else {
            res.status(data.code).send(data);
        }
    });
}

exports.sendblog = (req, res) => {
    permissions.userPer.needLoginTrue(req, (isTrue) => {
        if (isTrue) {
            let data = {
                title: req.body['title'],
                content: req.body['blog'],
                time: req.body['time'],
                sub_id: req.body['sub_id'],
                sendername: req.userinfo.username
            };
            querysql.sendblog(data, (data) => {
                res.status(data.code).send(data);
            });

        } else {
            res.status(403).send({
                code: 403,
                data: [],
                msg: "你没有登录！"
            });
        }
    })
}

exports.deleteUser = (req, res) => {
    permissions.adminPer.needLoginTrue(req, (isTrue) => {
        if (isTrue) {
            querysql.deleteUser(req.query['opedUname'], (data) => {
                res.status(data.code).send(data);
            });
        } else {
            res.status(400).send({ code: 400, data: [], msg: "身份过期，无权限操作" });
        }
    })
}

exports.findBackPwd = (req, res) => {
    let sVc = req.userinfo.code;
    if (sVc !== req.query.vc) {
        res.status(403).send({ code: 403, data: [], msg: "验证码错误！" });
        return;
    }
    querysql.querykey(req.query.username, req.query.phone, (isUser) => {
        if (isUser) {
            querysql.changekey(req.query.newpwd, req.query.username, (data) => {
                res.status(data.code).send(data);
            });
        } else {
            res.status(403).send({ code: 400, data: [], msg: "用户不存在或手机号和用户名不匹配" });
        }
    });
}
exports.setUserimg = (req, res) => {
    permissions.userPer.needLoginTrue(req, (isTrue) => {
        if (isTrue) {
            querysql.queryuserimg(req.userinfo.username, (data) => {
                if (data) {
                    deleteQcloudfile.deleteimgone('blog/img/' + data, function (reslut) {
                        if (reslut == 'error') {
                            console.log("删除老照片" + data + "出错")
                        } else {
                            console.log("删除老照片" + data + "成功");
                        }
                    })
                }
            })
            let data = {
                username: req.userinfo.username,
                imgname: req.query['imgname']
            };
            querysql.setUserImg(data, function (data) {
                res.status(data.code).send(data);
            })

        } else {
            res.status(403).send({
                code: 403,
                data: [],
                msg: "你没得法执行这个完美的操作"
            });
        }
    })
}

exports.getUserList = (req, res) => {
    permissions.adminPer.needLoginTrue(req, (isTrue) => {
        if (isTrue) {
            querysql.queryUList((data) => {
                res.status(data.code).send(data);
            })
        } else {
            res.status(403).send({ code: 403, data: [], msg: "你没有权限！" });
        }
    })
}

exports.getUserone = (req, res) => {
    permissions.adminPer.needLoginTrue(req, (isTrue) => {
        if (isTrue) {
            let username = req.body['username'];
            querysql.home(username, (userinfo) => {
                if (userinfo) {
                    querysql.queryUserPer(username, (userPer) => {
                        userinfo.oper = userPer;
                        res.status(200).send(userinfo);
                    })
                } else {
                    res.status(500).send({ code: 500, data: [], msg: "服务器错误！" });
                }
            })
        } else {
            res.status(403).send({ code: 403, data: [], msg: "你没有权限！" });
        }
    })
}

exports.search = (req, res) => {
    let seaCon = req.body['content'];
    querysql.querysea(seaCon, (data) => {
        res.status(data.code).send(data);
    })
}

exports.getComment = (req, res) => {
    querysql.blogcomms(req.body, (data) => {
        if (data) {
            res.status(200).send(data);
        } else {
            res.status(400).send({ code: 400, data: [], msg: "error" });
        }
    })
}

exports.readMsgAll = (req, res) => {
    if (req.query.type == 'all') {
        unreadMsg.readAll(req.query.username, function (data) {
            req.status(data.code).send(data)
        })
    } else if (req.query.type == 'one') {

    } else {
        req.status(403).send({ code: 403, data: [], msg: '参数错误' })
    }
}

exports.getsidebar=(req,res)=>{
    querysql.querypageconfig((data)=>{
        if (data) {
            res.status(200).send(data);
        } else {
            res.status(400).send({code: 400, data: [], msg: "页面数据获取出错"});
        }
    });
}

exports.changepageinfo=(req,res)=>{
    let obj = {
        notice: req.body['notice'],
        recomm: req.body['recomm'],
        vlog: req.body['vlog'],
        hotblog: req.body['hotblog']
    }
    querysql.addconfig(obj,(data)=>{
        res.status(data.code).send(data);
    })
}

exports.addvlog=(req,res)=>{
    permissions.adminPer.needLoginTrue((isTrue)=>{
        if(isTrue){
            let obj = {
                title: req.query['title'],
                url: req.query['url'],
                content: req.query['content']
            }
            querysql.addVlogQ(obj,(data)=>{
                res.status(data.code).send(data);
            })
        }else{
            res.status(403).send({ code: 403, data: [], msg: "你没有权限！" });
        }
    })
}

exports.getvlog=(req,res)=>{
    permissions.userPer.needLoginTrue(req, function (isTrue) {
        if(isTrue){
            let start = req.body['start'];
            querysql.getVlogQ(start,function (data) {
                res.status(data.code).send(data);
            })
        }else{
            res.status(403).send('请求不符合安全规则！')
        }
    })
}


exports.getSublist=(req,res)=>{
    querysql.getSublistQ(function(data){
       res.status(data.code).send(data);
    });
}
exports.addSub=(req,res)=>{
    permissions.adminPer.needLoginTrue(req,(isTrue)=>{
        if(isTrue){
            querysql.addSubLiQ(req.body['subname'],function(data){
                res.status(data.code).send(data);
            })
        }else{
            res.status(403).send({
                code:403,
                data:[],
                msg:"请求不符合安全规则！"
            });
        }
    })
}