/**
 * Created by asus on 2018/12/1.
 */
// 创建 application/x-www-form-urlencoded 编码解析
var bodyParser = require('body-parser');
var multer = require('multer');
var controller = require("../controller/controller.js");
var file = require("../model/file.js");
var path = require('path');
var query = require("../model/querysql.js");
var deleteQcloudfile = require("../model/deleteQcloudfile.js");
var uploadBlogimg = require("../model/uploadBlogimg.js");
var session = require('express-session');
const Requests = require('../model/Requests.js');
const mail = require('../model/163mail.js');
let getClientIp = function (req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
};


var urlencodedParser = bodyParser.urlencoded({extended: false});


module.exports = function (app) {


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

    /*页面请求部分*/
    app.get("/", function (req, res) {
        //主页请求
        controller.tips(function (data) {
            var ud;
            if (req.session.userinfo == null) {
                ud = {
                    info: "登录",
                    style1: "display:block;",
                    url: "/login",
                    style: "display: none;",
                    hblog: data.hotblog,
                };
            } else {
                ud = {
                    info: req.session.userinfo.name,
                    style1: "display:none;",
                    url: "/home/" + req.session.userinfo.username,
                    style: "display: block;",
                    hblog: data.hotblog,
                }
            }
            res.render('index', ud);
        });

    });

    app.get('/blog', function (req, res) {   //博客页面请求

        if (req.session.userinfo == null) {
            ud = {
                info: "登录",
                url: "/login",
                style: "display: none;",
                style1: "display:block;",
            };
        } else {
            ud = {
                info: req.session.userinfo.name,
                url: "/home/" + req.session.userinfo.username,
                style: "display: block;",
                style1: "display:none;",
            }
        }
        res.render('blog', ud);

    });
    app.get('/blog/:bid', function (req, res) {     //博客详情页面请求
        var blogID = req.params.bid;
        var username = null;
        if (req.session.userinfo) {
            username = req.session.userinfo.username;
        }
        controller.blogdata(blogID, function (data) {

            if (data == false) {
                res.status(404).send("<h1 style='text-align: center;font-size: 48px'>此页面不存在404</h1><p style='text-align: center'>三秒后跳回主页</p>" +
                    "<script>" +
                    "setTimeout(function(){window.location.href='/'},3000)" +
                    "</script>");
            } else {
                var likearr = []
                if (data[0].likes) {
                    likearr = data[0].likes.split('|');
                }

                var like = "unlike";

                for (var i = 0; i < likearr.length; i++) {
                    if (username == likearr[i]) {
                        like = 'liked'
                    }
                }
                var str = data[0];
                if (req.session.userinfo) {
                    var del = "display:none;";
                    if (str.sendername == req.session.userinfo.username) {
                        del = "display:block;"
                    }
                    res.render('blogdetails', {
                        del: del,
                        htmlT: str.sname + "的文章",
                        atitle: str.title,
                        blog: str,
                        hot: likearr.length,
                        htn: like,
                        info: req.session.userinfo.name,
                        url: "/home/" + req.session.userinfo.username,
                        style: "display: block;",
                        style1: "display:none;",
                    })
                } else {
                    res.render('blogdetails', {
                        del: 'display:none;',
                        htmlT: data[0].sname + "的文章",
                        atitle: data[0].title,
                        blog: str,
                        hot: likearr.length,
                        htn: like,
                        info: "登录",
                        url: "/login",
                        style: "display: none;",
                        style1: "display:block;",
                    })
                }
            }

        });
    });


    app.get('/login', function (req, res) {        //登录页面请求
        res.render('login', {});
    });
    app.get('/registered', function (req, res) {    //注册页面请求
        res.render('registered', {});
    });
    app.get('/Vlog', function (req, res) {   //VLOG页面请求
        if (req.session.userinfo == null) {
            res.send('请登录！<a href="/login">点击跳转到登录页面</a>');
        } else {
            res.render('Vlog', {
                info: req.session.userinfo.name,
                url: "/home/" + req.session.userinfo.username,
                style: "display: block;"
            })
        }
    });
    app.get('/home/:username', function (req, res) {  //个人中心页面请求
        var username = req.params.username;
        controller.homepage(username, function (data) {
            if (!data) {
                res.status(404).send("<h1>没有这个页面<a href='/'>点击回主页</a></h1>");
            } else {
                var img;
                var mansex;
                var womansex;
                if (data.user.sex == "男") {
                    mansex = "checked";
                    womansex = '';
                }
                if (data.user.sex == "女") {
                    mansex = '';
                    womansex = "checked";
                }
                if (!data.user.sex) {
                    mansex = '';
                    womansex = '';
                }
                if (!data.user.img) {
                    img = "img/demoimg.png"
                } else {
                    img = data.user.img;
                }
                var ud = {};
                if (req.session.userinfo == null) {
                    res.render('personCenter', {
                        womansex: womansex,
                        mansex: mansex,
                        age: "隐藏",
                        mail: "隐藏",
                        phone: "隐藏",
                        sex: "隐藏",
                        img: img,
                        info: data,
                        url: "",
                        user: "",
                        style: "display: none;",
                        style1: "display: block;",
                        style2: "display: none;"
                    });
                } else {
                    if (req.session.userinfo.username == username) {
                        res.render('personCenter', {
                            womansex: womansex,
                            mansex: mansex,
                            img: img,
                            info: data,
                            age: data.user.age,
                            mail: data.user.mail,
                            phone: data.user.phone,
                            sex: data.user.sex,
                            user: req.session.userinfo.name,
                            url: "/home/" + req.session.userinfo.username,
                            style: "display: block;",
                            style1: "display: none;",
                            style2: "display: block;"
                        });
                    } else {
                        res.render('personCenter', {
                            womansex: womansex,
                            mansex: mansex,
                            age: "隐藏",
                            mail: "隐藏",
                            phone: "隐藏",
                            sex: "隐藏",
                            img: img,
                            info: data,
                            user: req.session.userinfo.name,
                            url: "/home/" + req.session.userinfo.username,
                            style: "display: block;",
                            style1: "display: none;",
                            style2: "display: none;"
                        });
                    }
                }
            }
        });
    });
    app.get('/adlogin', function (req, res) {   //管理员登录页面请求
        res.render('adlogin');
    });
    app.get('/admin', function (req, res) {   //后台页面请求
        if (!req.session.admininfo) {
            res.send("Not login");
            return;
        }
        var username = req.session.admininfo.username;
        var level = req.session.admininfo.level;
        var role;
        if (level == 1) {
            role = "超级管理员"
        } else if (level == 2) {
            role = "管理员"
        }
        res.render('admin', {
            role: role,
            username: username
        });
    });


    /***************** 数据请求*****************/
    app.get("/pageConfig", function (req, res) {
        let html_name = req.query['html_name'];
        controller.pageconfigC(html_name, function (data) {
            if (!data) {
                res.status(403).send({code: 403, data: [], msg: '页面配置获取失败'});
            } else {
                res.status(200).send(data[0]);
            }
        })
    });

    app.get("/webdata", function (req, res) { //网站数据
        if (!req.session.admininfo) {
            res.status(403).send({code: 403, data: [], msg: "你没有权限查看此数据"});
            return;
        }

        controller.webdataC(function (data) {
            if (data) {
                res.status(200).send(data);
            } else {
                res.status(400).send({
                    code: 400,
                    data: [],
                    msg: "查询出错！"
                });
            }
        })
    });


    app.get('/changeinfo', function (req, res) {    //资料修改请求处理
        query.querychge(req, res);
    });

    app.post('/loginad', urlencodedParser, function (req, res) {  //管理员登录请求处理
        var datas = {
            user: req.body,
            role: "admin"
        };
        controller.loginC(datas, function (reslut) {
            if (reslut == 'error') {
                res.status(400).send({code: 400, data: [], msg: '用户名或密码错误'})
            } else if (reslut == "Serror") {
                res.status(400).send({code: 400, data: [], msg: '服务器错误！我们将尽快处理'})
            } else {
                req.session.admininfo = reslut;

                //登录提醒
                let ip = getClientIp(req).match(/\d+.\d+.\d+.\d+/);
                ip = ip ? ip.join('.') : null;
                Requests.baiduMap(ip, function (data) {
                    mail.mail({
                        'tofrom': "1247740650@qq.com",
                        'title': "管理员登录提醒",
                        'content': "后台页面有登录行为，登录者信息如下<\/br>：" + data
                    }, function (info) {
                        if (info) {
                            console.log("后台登录邮件提醒正常")
                        } else {
                            console.log("后台登录邮件提醒出错！")
                        }
                    })
                });

                //登录成功
                res.status(200).send();
            }
        })
    });

    app.post("/logins", urlencodedParser, function (req, res) {   //用户登录请求处理
        var data = {
            user: req.body,
            role: "user"
        };
        controller.loginC(data, function (reslut) {
            if (reslut == 'error') {
                res.status(400).send({code: 400, data: [], msg: '用户名或密码错误'})
            } else if (reslut == "Serror") {
                res.status(400).send({code: 400, data: [], msg: '服务器错误！我们将尽快处理'})
            } else {
                req.session.userinfo = reslut;
                res.status(200).send();
            }
        })
    });

    app.get("/sendblog", function (req, res) {   //发送文章
        if (!req.session.userinfo) {
            res.status(400).send({code: 400, data: [], msg: 'no login'});
            return;
        }
        var data = {
            title: req.query['title'],
            content: req.query['blog'],
            time: req.query['time'],
            sendername: req.session.userinfo.username,
            sname: req.session.userinfo.name
        };
        controller.sendblog(data, function (result) {
            res.status(result.code).send(result);
        })
    });
    app.get("/like", function (req, res) {  //文章点赞
        if (!req.session.userinfo) {
            res.status(400).send({code: 400, data: [], msg: "你怎么不登录就点赞啊？"});
        } else {
            var data = {
                type: req.query["type"],
                blogid: req.query['blogid'],
                username: req.session.userinfo.username
            };
            controller.like(data, function (datas) {
                res.status(datas.code).send(datas);
            })
        }
    });

    app.get('/vc', function (req, res) {  //验证码请求
        var phone = req.query['phone'];
        controller.vc(phone, function (data) {
            if (data) {
                res.status(200).send([{code: 200, data: [], msg: "success"}]);
                console.log("手机号为：" + phone + "的用户短信发送成功！");
            } else {
                res.status(400).send([{code: 400, data: [], msg: "短信发送失败！"}]);
            }
        })
    });

    //用户注册请求处理
    app.get('/registereds', function (req, res) {
        query.queryReg(req, res);
    });
//管理员/用户退出登录请求处理
    app.get("/exit", function (req, res) {
        var role;
        if (req.query["role"] == "user") {
            req.session.userinfo = null
        } else if (req.query["role"] == "admin") {
            req.session.admin = null
        }
        res.cookie(role, '', {expires: new Date(0)});
        res.send('ok');
    });

    //删除用户请求处理
    app.get("/delete_user", function (req, res) {
        query.queryDelete(req, res)
    });
    app.get("/retrieve", function (req, res) {  //找回密码
        var data = {
            username: req.query.username,
            password: req.query.newpwd,
            phone: req.query.phone,
            pwd: req.query.pwd,
            vc: req.query.vc
        };
        controller.retrieve(data, function (msg) {
            if (msg.code == 400) {
                res.status(400).send([msg]);
            } else {
                res.status(200).send([msg]);
            }
        })
    });


    app.get('/deleteblog', function (req, res) {  //删除博客请求处理
        if (!req.session.userinfo) {
            res.status(400).send({code: 400, data: [], msg: '你没得权限'});
            return;
        }
        var data = {
            username: req.session.userinfo.username,
            blogid: req.query['blogid'],
            time: req.query['time']
        };
        controller.deleteblog(data, function (reslut) {
            res.status(reslut.code).send(reslut);
        });
    })


    app.get('/setuserimg', function (req, res, next) { //接收上传图片请求的接口
        if (!req.session.userinfo) {
            res.status(400).send({
                code: 400,
                data: [],
                msg: "你没得法执行这个完美的操作"
            });
        }
        query.queryuserimg(req.session.userinfo.username, function (data) {
            if (data) {
                deleteQcloudfile.deleteimgone('blog/img/' + data, function (reslut) {
                    if (reslut == 'error') {
                        console.log("删除老照片" + data + "出错")
                    } else {
                        console.log("删除老照片" + data + "成功");
                    }
                })
            }
        });
        var data = {
            username: req.session.userinfo.username,
            imgname: req.query['imgname']
        };
        controller.userimg(data, function (reslut) {
            res.status(reslut.code).send(reslut);
        });

    });


    app.post('/upblogimg', uploadBlogimg.uploadfile);   //博客图片上传到服务器


    app.get('/userList', function (req, res) { //用户列表请求处理
        if (!req.session.admininfo) {
            res.status(400).send({code: 400, data: [], msg: "获取用户列表失败"})
            return;
        }
        controller.adGetUserli(function (data) {
            if (!data) {
                res.status(400).send({code: 400, data: [], msg: "获取用户列表失败"});
            } else {

                res.status(200).send(data);
            }
        })
    });

    app.post("/oneuserinfo", urlencodedParser, function (req, res) {
        if (!req.session.admininfo) {
            res.status(400).send({code: 400, data: [], msg: 'error'});
            return;
        }
        var username = req.body['username'];
        controller.homepage(username, function (data) {
            controller.selectUserPer(username, function (oper) {
                data.oper = oper;
                res.status(200).send(data);
            })

        })
    });

    app.post("/getBlogList", urlencodedParser, function (req, res) {
        if (req.headers.origin != 'http://127.0.0.1:3000' && req.headers.origin != 'http://www.wupopo.club') {
            res.status(403).send({code: 403, data: [], msg: "Your origin does not conform to the rules"});
            return
        }
        let obj = {
            start: req.body['start'],
            end: req.body['end']
        };
        let username;
        if (req.session.userinfo) {
            username = req.session.userinfo.username;
        } else {
            username = "nologin"
        }
        controller.bloglist(obj, function (data) {
            if (!data) {
                res.status(403).send({code: 403, data: data, msg: "error"});
            } else {
                res.status(200).send({code: 200, data: data, msg: username});
            }
        })
    });

    app.post("/search", urlencodedParser, function (req, res) {

        if (req.headers.origin != 'http://127.0.0.1:3000' && req.headers.origin != 'http://www.wupopo.club') {
            res.status(403).send({code: 403, data: [], msg: "Your origin does not conform to the rules"});
            return
        }

        let seaCon = req.body['content'];
        controller.search(seaCon, function (reslut) {
            if (reslut) {
                res.status(200).send({code: 200, data: reslut, msg: ""});
            } else {
                res.status(400).send({code: 400, data: [], msg: "error"});
            }
        })
    });
    app.get("/sendcomm", function (req, res) {   //发送评论
        if (!req.session.userinfo) {
            res.status(403).send({code: 403, data: [], msg: "请登录后发送评论"});
            return;
        }

        var content = req.query['content'];
        var sendername = req.session.userinfo.username;
        var time = req.query["time"];
        var parent_id = req.query["parent_id"];
        var ancestors_id = req.query["ancestors_id"];
        var data = {
            ancestors_id: ancestors_id,
            parent_id: parent_id,
            content: content,
            owner_username: sendername,
            time: time,
            parent_type: req.query["parent_type"]
        };

        controller.sendcomms(data, function (data) {
            if (data) {
                res.status(data.code).send(data)
            }
        });
    });

    app.post("/getComments", urlencodedParser, function (req, res) {
        controller.blogcomm(req.body, function (data) {
            if (data) {
                res.status(200).send(data);
            } else {
                res.status(400).send({code: 400, data: [], msg: "error"});
            }
        })

    });

    app.get('/isLogin', function (req, res) {
        if (req.session.userinfo) {
            res.send({islogin: true, username: req.session.userinfo.username})
        } else {
            res.send({islogin: false, username: []})
        }
    })

    app.post("/getmsg", urlencodedParser, function (req, res) {
        if (req.session.userinfo) {
            if (req.session.userinfo.username != req.body['msg_tofrom_username']) {
                res.status(403).send({code: 403, data: [], msg: "你没有权限获取此数"});
                return;
            }
        } else {
            res.status(403).send({code: 403, data: [], msg: "你没有权限获取此数据"});
            return;
        }
        controller.getmsg(req.body.msg_tofrom_username, (data) => {
            if (data) {
                res.status(200).send(data);
            } else {
                res.status(400).send({code: 400, data: [], msg: '获取数据出错'});
            }
        })
    });

    app.get('/readIt', (req, res) => {
        if (req.session.userinfo) {
            if (req.session.userinfo.username != req.query['username']) {
                res.status(403).send({code: 403, data: [], msg: "你没有权限进行此操作"});
                return;
            }
        } else {
            res.status(403).send({code: 403, data: [], msg: "你没有权限进行此操作"});
            return;
        }

        controller.readit(req.query, function (data) {
            res.status(data.code).send(data);
        })
    })

    app.post("/getSidebar", urlencodedParser, (req, res) => {
        if (req.headers.origin != 'http://127.0.0.1:3000' && req.headers.origin != 'http://www.wupopo.club') {
            res.status(403).send({code: 403, data: [], msg: "Your origin does not conform to the rules"});
            return
        }
        controller.getSidebar((data) => {
            res.status(data.code).send(data);
        })
    })

};
