const querysql = require('../model/querysql.js');
const permissions = require('../model/permissions.js');


/**********前端页面**********/
exports.indexPage = (req, res) => {   //主页请求
    var ud;
    if (req.session.userinfo == null) {
        ud = {
            info: "登录",
            style1: "display:block;",
            url: "/login",
            style: "display: none;",
        };
    } else {
        ud = {
            info: req.session.userinfo.name,
            style1: "display:none;",
            url: "/home/" + req.session.userinfo.username,
            style: "display: block;",
        }
    }
    res.render('index', ud);
};

exports.blogPage = (req, res) => {  //博客页面请求
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
};

exports.blogDetailsPage = (req, res) => {  //博客文章详情页
    var blogID = req.params.bid;
    var username = null;
    if (req.session.userinfo) {
        username = req.session.userinfo.username;
    }
    querysql.blogone(blogID, function (data) {
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
                    htmlT: str.title,
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
                    htmlT: str.title,
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
    })
};

exports.loginPage = (req, res) => {   //登录页面请求
    res.render('login', {});
};

exports.registeredPage = (req, res) => {  //注册页面
    res.render('registered', {});
};

exports.vlogPage = (req, res) => {
    permissions.userPer.needLoginTrue(req, function (bool) {
        if (bool) {
            /* res.send('此页面暂未开放！<a href="/">点击回到主页</a>');*/
            res.render('Vlog', {
                info: req.session.userinfo.name,
                url: "/home/" + req.session.userinfo.username,
                style: "display: block;"
            })
        } else {
            res.send('此页面暂未对游客开放！<a href="/login">登录后访问</a>');
        }
    })
};
exports.vlogDetailsPage = (req, res) => {  //vlog详情页面
    let id = req.params.id;
    permissions.userPer.needLoginTrue(req, function (bool) {
        if (bool) {
            controller.getvlogOneC(id, function (data) {
                if (!data) {
                    res.status(404).send("<h1>此页面不存在</h1>")
                } else {
                    res.render('vlogPlay', {
                        info: req.session.userinfo.name,
                        url: "/home/" + req.session.userinfo.username,
                        style: "display: block;",
                        vlog: data
                    });
                }
            })
        } else {
            res.send('此页面暂未对游客开放！<a href="../login">登录后访问</a>');
        }
    })
};

exports.homePage = (req, res) => {   //个人中心
    var username = req.params.username;
    querysql.home(username, function (data) {
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
};


/**********后台页面**********/
exports.adminLoginPage = () => {    //后台登录页面
    permissions.adminPer.needOriginTrue(req, function (bool) {
        if (bool) {
            res.render('adlogin');
        } else {
            res.send("你没权限查看此页面！");
        }
    })
};

exports.adminPage = (req, res) => {   //后台页面
    permissions.adminPer.needLoginTrue(req, function (bool) {
        if (bool) {
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
        } else {
            res.send("你没权限查看此页面！");
        }
    })

}