var userSql = require('../db/Usersql');
var adminSql = require('../db/AdminSql');
var blogSql = require("../db/Blog.js");
var vlogSql = require("../db/vlog.js");
let jsonwebtoken = require('jsonwebtoken');
let bceypt = require('bcrypt');
var mysql = require('mysql');
var file = require("./file.js");
var qcloudsms = require('../model/qcloudsms_js.js');
var query = require('../db/query.js');
var operRecord = require('../model/operRecord.js');
var pageconfig = require("../db/pageconfig.js");
const unreadMsg = require("./unreadMsg.js");

function time() {
    var now = new Date();
    var oyear = now.getFullYear(); // 2015, 年份
    var omonth = now.getMonth(); // 5, 月份，注意月份范围是0~11，5表示六月
    var odate = now.getDate(); // 24, 表示24号
    var oday = now.getDay(); // 3, 表示星期三
    var ohour = now.getHours(); // 19, 24小时制
    var ominutes = now.getMinutes(); // 49, 分钟
    now.getSeconds(); // 22, 秒
    now.getMilliseconds(); // 875, 毫秒数
    now.getTime(); // 1435146562875, 以number形式表示的时间戳
    var mo = omonth = Number(omonth) + 1;
    return oyear + "-" + mo + "-" + odate + "&nbsp;&nbsp;" + ohour + ":" + ominutes;
}

exports.addSubLiQ = function (name, callback) {
    query(blogSql.insertSub, [name, time()], function (err, data) {
        if (err) {
            callback({
                code: 500,
                data: [],
                msg: "error"
            });
            console.log(err);
            return;
        }
        callback({
            code: 200,
            data: [],
            msg: 'success'
        });
    })
}

exports.getSublistQ = function (callback) {
    query(blogSql.querySubject, [], function (err, data) {
        if (err) {
            callback({
                code: 500,
                data: [],
                msg: "error"
            });
            console.log(err);
            return;
        }

        callback({
            code: 200,
            data: data,
            msg: "success"
        });
    })
}

exports.getvlogOneQ = function (id, callback) {
    query(vlogSql.getvlogone, [id], function (err, data) {
        if (err) {
            callback(false);
            console.log(err);
            return;
        }
        callback(data[0]);
    })
}

exports.getVlogQ = function (num, callback) {
    let start = Number(num);
    query(vlogSql.getvlog, [start], function (err, data) {
        if (err) {
            console.log(err);
            callback({ code: 500, data: [], msg: "服务器错误" });
        } else {
            callback({ code: 200, data: data });
        }
    })
};
exports.addVlogQ = function (obj, callback) {
    query(vlogSql.addVlog, [obj.url, obj.title, obj.content, time()], function (err, data) {
        if (err) {
            console.log(err);
            callback({ code: 403, data: [], msg: "插入数据出错！" });
        } else {
            callback({ code: 200, data: [], msg: "success" });
        }
    })
};

exports.addconfig = function (obj, callback) {
    query(pageconfig.addConfig, [obj.notice, obj.vlog, obj.hotblog, obj.recomm, time()], function (err, data) {
        if (err) {
            console.log(err);
            callback({ code: 400, data: [], msg: "配置数据插入出错" });
        } else {
            callback({ code: 200, data: [], msg: "success" });
        }
    })
}

exports.querysea = function (str, callback) {
    query(blogSql.searchBlog, ['%' + str + '%', '%' + str + '%', '%' + str + '%'], function (err, data) {
        if (err) {
            console.log(err);
            callback({
                code:500,
                data:[],
                msg:"服务器出错！"
            });
        } else {
            callback({
                code:200,
                data:data,
                msg:"success"
            });
        }
    })
}

exports.querypageconfig = function (callback) {   //页面配置数据库查询
    query(pageconfig.queryPageConfig, [], function (err, config) {
        if (err) {
            callback(false)
            console.log(err);
        } else {
            let blogid = config[0].hotblog_id;
            blogid = Number(blogid);

            let recblogarr = config[0].recomm;
            let oldarr = config[0].recomm.split("|");
            let rec1 = 45;
            if (oldarr[0]) {
                rec1 = oldarr[0];
                rec1 = rec1.toString();
            }
            let rec2 = 45;
            if (oldarr[1]) {
                rec2 = oldarr[1]
                rec2 = rec2.toString();
            }
            let rec3 = 45;
            if (oldarr[2]) {
                rec3 = oldarr[2]
                rec3 = rec3.toString();
            }
            let rec4 = 45;
            if (oldarr[3]) {
                rec4 = oldarr[3]
                rec4 = rec4.toString();
            }

            query(pageconfig.queryBlogInfo, [rec1, rec2, rec3, rec4], function (err, recomm) {
                if (err) {
                    callback({
                        notice: config[0].notice,
                        vlog: config[0].vlog,
                        recomm: [],
                        hotblog: {},
                        time: config[0].time
                    });
                } else {
                    query(blogSql.selectBlogById, [blogid], function (err, blog) {
                        if (err) {
                            console.log(err);
                            callback({
                                notice: config[0].notice,
                                vlog: config[0].vlog,
                                recomm: recomm,
                                hotblog: {},
                                time: config[0].time
                            });
                            return;
                        }
                        callback({
                            notice: config[0].notice,
                            vlog: config[0].vlog,
                            recomm: recomm,
                            hotblog: blog[0],
                            time: config[0].time
                        });
                    })
                }
            })
        }
    });
}


exports.webdata = function (callback) {   //网站数据数据库查询
    query(userSql.selectSexUser, ['男'], function (err, man) {
        if (err) {
            callback({
                code: 500,
                data: [],
                msg: "服务器出错！"
            });
            return;
        }
        let man_length = man.length;
        query(userSql.selectSexUser, ['女'], function (err, woman) {
            if (err) {
                callback({
                    code: 500,
                    data: [],
                    msg: "服务器出错！"
                });
                return;
            }
            let woman_length = woman.length;
            query(userSql.queryAll, [], function (err, user) {
                if (err) {
                    callback({
                        code: 500,
                        data: [],
                        msg: "服务器出错！"
                    });
                    return;
                }
                let user_length = user.length;
                callback(
                    {
                        code: 200,
                        data: [
                            { value: man_length, name: "男" },
                            { value: woman_length, name: "女" },
                            { value: user_length - man_length - woman_length, name: "未知" }
                        ],
                        msg: "success"
                    }
                );
            })
        })
    })

}

exports.queryUserPer = function (username, callback) {  //查询用户记录
    query(adminSql.queryOneuUserPer, [username, username], function (err, data) {
        if (err) {
            console.log();
            callback(false);
        } else {
            callback(data)
        }

    });
}

exports.queryuserimg = function (username, callback) {
    query(userSql.getUserByUname, [username], function (err, data) {
        if (err) {
            callback(false)
        } else {
            callback(data[0].img);
        }
    })
};


exports.deleblogbyid = function (data, callback) {    //删除博客
    query(blogSql.selectBlogById, [data.blogid], function (err, blog) {
        if (err) {
            callback({ code: 400, data: [], msg: '操作失败' });
        } else {
            if (blog[0].sendername != data.username) {
                callback({ coed: 400, data: [], msg: "你莫得权限操作这个东西" });
            } else {
                query(blogSql.deleteBlogById, [data.blogid], function (err, reslut) {
                    if (err) {
                        console.log(err);
                        callback({ code: 400, data: [], msg: '操作失败' });
                    } else {
                        query(blogSql.deleteComments, [data.blogid], function (err, comm) {
                            if (err) {
                                console.log(err);
                                callback({ code: 400, data: [], msg: '操作失败' });
                            } else {
                                operRecord({
                                    type: "delete_blog",
                                    role: 'user',
                                    operator: data.username,
                                    content: null,
                                    object: data.blogid,
                                    time: time()
                                });
                                callback({ code: 200, data: [], msg: "操作成功" });
                            }
                        })
                    }
                })
            }
        }
    })
};

exports.likes = function (obj, callback) {   //点赞模块
    if (obj.type == "liked") {
        query(blogSql.selectBlogById, [obj.blogid], function (err, data) {
            if (err) {
                callback(false);
            } else {
                var newresult;
                var blogid = Number(obj.blogid);
                if (data[0].likes) {
                    var oldarr = data[0].likes.split("|");
                    if (oldarr.includes(obj.username)) {
                        callback({
                            code: 403,
                            data: [],
                            msg: "请勿重复点赞！"
                        })
                        return;
                    }
                    oldarr.push(obj.username);
                    newresult = oldarr.join("|");
                } else {
                    newresult = obj.username;
                }
                query(blogSql.likeChange, [newresult, blogid], function (err, das) {
                    if (err) {
                        callback({
                            code: 500,
                            data: [],
                            msg: '服务器错误！'
                        });
                        console.log(err);
                    } else {
                        callback({
                            code: 200,
                            data: [],
                            msg: "suceess"
                        });
                    }
                });
                /* unreadMsg.InUnReadeMsg({
                     msg_from_username:obj.username,
                     msg_tofrom_username:data[0].sendername,
                     msg_type:"good",
                     msg_content:data[0].title,
                     parent_id:blogid,
                     time:time()
                 });*/
            }
        })
    } else {
        query(blogSql.selectBlogById, [obj.blogid], function (err, data) {
            if (err) {
                callback({
                    code: 500,
                    data: [],
                    msg: '服务器错误！'
                });
                console.log(err)
            } else {
                var oldarr = data[0].likes.split("|");
                var newarr = [];
                for (var i = 0; i < oldarr.length; i++) {
                    if (oldarr[i] != obj.username) {
                        newarr.push(oldarr[i])
                    }
                }
                var last = newarr.join("|");
                query(blogSql.likeChange, [last, obj.blogid], function (err, da) {
                    if (err) {
                        callback({
                            code: 500,
                            data: [],
                            msg: '服务器错误！'
                        });
                        console.log(err)
                    } else {
                        callback({
                            code: 200,
                            data: []
                        });
                    }
                })
            }
        })
    }
};


exports.sendcom = function (data, callback) {   //发送评论

    if (data.parent_type == 'blog') {

        query(blogSql.selectBlogById, [data.parent_id], function (err, blog) {
            if (err) {
                console.log('querysql.jsquery.js>>>>>>sendcom,1 \n' + err);
                callback({ code: 400, data: [], msg: '数据插入失败！' });
                return;
            }
            let target_username = blog[0].sendername;
            query(blogSql.insertComm, [data.owner_username, target_username, data.content, data.time, data.parent_id, data.parent_type, data.ancestors_id, "false"], function (err, reslut) {
                if (err) {
                    console.log('querysql.js query.js>>>>>>sendcom,2 \n' + err);
                    callback({ code: 400, data: [], msg: '数据插入失败！' });
                    return;
                }
                callback({ code: 200, data: [], msg: '发送成功' });
            });

        })
    } else if (data.parent_type == 'comm') {
        query(blogSql.selectCommById, [data.parent_id], function (err, comm) {
            if (err) {
                console.log('querysql.jsquery.js>>>>>>sendcom,3 \n' + err);
                callback({ code: 400, data: [], msg: '数据插入失败！' });
                return;
            }
            let target_username = comm[0].owner_username;
            console.log(target_username);
            query(blogSql.insertComm, [data.owner_username, target_username, data.content, data.time, data.parent_id, data.parent_type, data.ancestors_id, "false"], function (err, reslut) {
                if (err) {
                    console.log('querysql.js query.js>>>>>>sendcom,4 \n' + err);
                    callback({ code: 400, data: [], msg: '数据插入失败！' });
                    return;
                }
                callback({ code: 200, data: [], msg: '发送成功' });
            })
        })
    } else {
        callback(false);
    }
};
exports.blogcomms = function (obj, callback) {   //查询文章评论
    let start = Number(obj.start);
    query(blogSql.readPartComm, [obj.parent_id, obj.parent_type, start], function (err, data) {
        if (err) {
            console.log(err);
            callback(false);
        } else {
            callback(data);
        }
    })
};

exports.blogone = function (data, callback) {   //获取一篇文章
    query(blogSql.selectBlogById, [data], function (err, blog) {
        if (err) {
            callback(false);
        } else {
            callback(blog);
        }
    })
};

exports.sendblog = function (data, callback) {   //发送文章
    query(blogSql.insertBlog, [data.title, data.sendername, data.time, data.content, null, data.sub_id], function (err) {
        if (err) {
            console.log(err);
            callback({
                code:500,
                data:[],
                msg:'服务器错误！'
            });
            return;
        }
        callback({
            code:200,
            data:[],
            msg:'success'
        });
        operRecord({
            type: 'send_blog',
            role: 'user',
            operator: data.sendername,
            content: null,
            object: data.title,
            time: time()
        });
    })
}

exports.queryblogli = function (obj, callback) { //查询所有文章
    let start = Number(obj.start);
    let end = Number(obj.end);
    query(blogSql.queryBlogLi, [start, end], function (err, data) {
        if (err) {
            console.log(err);
            callback({
                code: 500,
                data: [],
                msg: "服务器错误！"
            });
            return;
        }
        callback({
            code: 200,
            data: data
        });
    })
}

exports.setUserImg = function (filename, username, callback) {   //设置用户头像
    query(userSql.setUserImg, [filename, username], function (err, data) {
        if (err) {
            console.log(err);
            callback(false);
            return;
        }
        callback(true);
    })
};

exports.selectName = function (username, callback) {   //查询用户昵称
    query(userSql.getUserByUname, [username], function (err, data, fields) {
        if (err) {
            console.log(err);
            callback(-1);
            return;
        }
        callback(data);
    })
};
exports.objUserName = function (callback) {   //查询所有用户
    query(userSql.queryAll, [], function (err, data) {
        if (err) {
            console.log(err);
            callback(-1);
            return;
        }
        callback(data);
    })
};

exports.queryLogin = function (data, callback) {  //用户登录
    var table;
    if (data.role == "user") {            //判断登录身份，选择后面要查询数据库的表；
        table = userSql;
    } else if (data.role == "admin") {
        table = adminSql;
    }
    var username = data.user['username'];
    var password = data.user['password'];
    query(table.getUserByUname, [username], function (err, data) {
        if (err) {
            callback({ code: 500, data: [], msg: "error" });
            console.log(err);
        } else if (!data[0]) {
            callback({ code: 403, data: [], msg: '用户名不存在！' })
        } else {
            let isPasswordValid = bceypt.compareSync(password, data[0].password);
            if (isPasswordValid) {
                callback({ code: 200, data: [{ username: data[0].username }], msg: "success" })
            } else {
                callback({ code: 422, data: [], msg: "密码错误" });
            }
        }
    })
};
exports.home = function (username, callback) {  //获取指定用户信息
    query(userSql.getuserInfo, [username], function (err, user) {
        if (err) {
            console.log(err);
            callback(false)
        } else {
            if (user[0]) {
                query(blogSql.getBlogInfoBySender, [username], function (err, blog) {
                    if (err) {
                        console.log(err);
                        callback(false)
                    } else {
                        var data = {
                            user: user[0],
                            blog: blog
                        }
                        callback(data);
                    }
                })
            } else {
                callback(false);
            }
        }
    })
};

exports.querykey = function (username, phone, callback) {
    query("SELECT * FROM user WHERE username=? AND phone= ?", [username, phone], function (err, data) {
        if (err) {
            console.log(err);
            callback(false);
            return;
        }
        if (data[0]) {
            callback(true);
        } else {
            callback(false);
        }
    })
};

exports.changekey = function (newpwd, username, callback) {
    let hashedPwd=bceypt.hash(newpwd,10);
    query("UPDATE user SET password=?, WHERE username=?", [hashedPwd, username], function (err, data) {
        if (err) {
           callback({
               code:500,
               data:[],
               msg:"服务器错误！"
           })
        } else {
            callback({
                code:200,
                data:[],
                msg:"修改成功！"
            });
        }
    });
};

exports.queryReg = function (obj, callback) {
    let name = obj.name;
    let username = obj.username;
    let password = obj.password;
    let phone = obj.phone;
    query(userSql.getUserByUname, [username], function (err, data) {
        if (err) {
            callback({
                code: 500,
                data: [],
                msg: "error"
            });
            return;
        }

        if (data[0]) {
            if (data[0].username == username) {
                callback({ code: 400, data: [], msg: "该用户名已被注册" });
                return;
            }
        }
        let hashedPwd = bceypt.hashSync(password, 10);  //加密处理
        console.log(hashedPwd);
        query(userSql.insert, [name, username, hashedPwd, phone, null, null, null, time()], function (err, data) {
            if (err) {
                console.log(err);
                callback({ code: 400, data: [], msg: "数据库出错" });
            } else {
                callback({ code: 200, data: [], msg: "注册成功！" });
                operRecord({
                    type: "reg",
                    role: 'user',
                    operator: username,
                    content: null,
                    object: username,
                    time: time()
                });
            }
        });
    });
};


//暂未 修改
exports.changInfoM = function (obj, callback) {
    query(userSql.changeInfoU, [obj.name, obj.phone, obj.age, obj.mail, obj.sex, obj.username], function (err, data) {
        if (err) {
            callback({
                code: 500,
                data: [],
                msg: "信息修改失败！"
            });
            return;
        }
        operRecord({
            type: "change_info",
            role: obj.role,
            operator: obj.operator,
            content: null,
            object: obj.username,
            time: time()
        });
        callback({
            code: 200,
            data: [],
            msg: "修改成功"
        });
    })
};

exports.queryUList = function (callback) {   //管理员需要的用户列表  包含用户名，和昵称
    query(userSql.queryAll, [], function (err, data) {
        if (err) {
            console.log('管理员获取用户列表失败');
            callback({
                code:500,
                data:[],
                msg:"服务器出错！"
            });
            return;
        }
        var dataArr = [];
        for (var i = 0; i < data.length; i++) {
            var obj = {};
            obj.username = data[i].username;
            obj.name = data[i].name;
            dataArr.push(obj);
        }
        callback({
            code:200,
            data:dataArr,
            msg:"success"
        });
    })
};

exports.deleteuser = function (username,callback) {

    var username = req.query['opedUname'];
    query(userSql.deleteUserByUname, [username], function (err, data) {
        if (err) {
            console.log(err);
            callback({
                code:500,
                data:[],
                msg:"服务器出错！"
            });
            return;
        }
       callback({ code: 200, data: [], msg: "删除成功！" });
        operRecord({
            type: "delete_user",
            role: "admin",
            operator: req.session.admininfo.username,
            content: null,
            object: username,
            time: time()
        });
    })
};

exports.getUserOne = function (username, callback) {
    query(userSql.getUserByUname, [username], function (err, data) {
        if (err) {
            callback(false);
            console.log(err);
            return;
        }
        callback(data[0]);
    })
}