/**
 * Created by asus on 2018/12/2.
 */
const bodyParser = require('body-parser');
const file = require('../model/file.js');
const querysql = require('../model/querysql.js');
const qcloudsms = require('../model/qcloudsms_js.js');
const crypto = require('crypto');
const operRecord=require('../model/operRecord.js');
const deleteQcloudfile=require('../model/deleteQcloudfile.js');
const fs = require("fs");
const unreadMsg = require('../model/unreadMsg.js');
const permissions = require('../model/permissions.js');
// 创建 application/x-www-form-urlencoded 编码解析
const urlencodedParser = bodyParser.urlencoded({extended: false});


exports.deleteComC=function(req,res){

}

exports.addSubliC=function(name,callback){
    querysql.addSubLiQ(name,function(data){
        callback(data);
    })
}

exports.getSublistC=function(callback){
    querysql.getSublistQ(function(data){
        callback(data);
    });
}

exports.getvlogOneC=function(id,callback){
    querysql.getvlogOneQ(id,function(data){
        callback(data);
    })
}

exports.getvlogC=function(start,callback){
    querysql.getVlogQ(start,function (data) {
        callback(data);
    })
}
exports.addVlogC=function(obj,callback){
    querysql.addVlogQ(obj,function (data) {
        callback(data);
    })
};

exports.changeConfig=function(obj,callback){ //改变页面展示内容
    querysql.addconfig(obj,function (data) {
        callback(data);
    })
}

exports.getSidebar=(callback)=>{
    querysql.querypageconfig(function (data) {
        callback(data);
    });
};

exports.readit=(obj,callback)=>{   //标记为已阅读
    if(obj.type=='all'){
        unreadMsg.readAll(obj.username,function(data){
            callback(data)
        })
    }else if (obj.type=='one'){

    }else {
        callback({code:403,data:[],msg:'参数错误'})
    }
}

exports.getmsg=(username,callback)=>{  //获取未读消息
    unreadMsg.OutUnReadeMsg(username,(data)=>{
        callback(data);
    })
}

exports.search=function(str,callback){   //文章搜索
    querysql.querysea(str,function(data){
        callback(data);
    })
}

exports.pageconfigC=function(name,callback){
    querysql.querypageconfig(name,function(data){
        callback(data);
    })
}

exports.webdataC=function(callback){   //网站数据控制器
	querysql.webdata(function(data){
		callback(data);
	})
}



exports.selectUserPer=function(username,callback){  //查询用户日志
    querysql.queryUserPer(username,function(data){
        callback(data);
    })
}

exports.adGetUserli=function(callback){ //管理员获取用户列表
    querysql.queryUList(function(data){
        if(!data){
            callback(false);
        }else {
            callback(data);
        }
    })
};

exports.userimg=function(data,callback){   //重置用户头像
    querysql.setUserImg(data.imgname,data.username,function(data){
        if(data){
            callback({code:200,data:[],msg:"success"});
        }else {
            callback({code:400,data:[],msg:"error"});
        }
    })
};

exports.loginC=function(obj,callback){   //登录控制器
    querysql.queryLogin(obj,function(data){
       callback(data);
    })
};

exports.deleteblog=function(info,callback){   //删除博客控制器
    querysql.blogone(info.blogid,function(data){
       if(data){
           var str = data[0].content;
           var imgReg = /<img src="https:\/\/wupopo-1256296697.cos.ap-chengdu.myqcloud.com.*?(?:>|\/>)/gi;
           var arr = str.match(imgReg);
           if(arr==null){
               querysql.deleblogbyid(info,function(data){
                   callback(data);
               })
           }else {
               var dataarr=[];
               for(var i=0;i<arr.length;i++){
                   var obj={};
                   var key=arr[i].match(/myqcloud.com\/(\S*)"/)[1];
                       obj.Key=key;
                       dataarr.push(obj);
               }
               console.log(dataarr);
                deleteQcloudfile.deleteimgs(dataarr,function(data){
                    if(data=="error"){
                        console.log("云端照片删除失败");
                    }else {
                        console.log("云端照片删除成功");
                    }
                    querysql.deleblogbyid(info,function(data){
                        callback(data);
                    })
                })
           }
       }
    })

};

exports.sendblog=function(data,callback){   //发送博客控制器
    querysql.querydblog(data,function(reslut){
        if(reslut){
            callback({code:200,data:[],msg:"发送成功！"});
        }else {
            callback({code:400,data:[],msg:"发送失败！"});
        }
    })
};

/*exports.deleteImg=function(filename,callback){   //删除用户头像控制器
    fs.unlink('./Public/userimg/'+filename,function(err){
        if(err){
            callback({code:401,data:[],msg:"服务器错误"});
            return;
        }
        callback({code:400,data:[],msg:"不支持此图片类型"});
    });
};*/

/*exports.userimg=function(username,callback){   //从新设置用户头像
    file.readdata('./Public/userimg/'+username,function(data){
        if(data==-1){
            callback({code:200,data:[],msg:"YOYO！"});

            return;
        }
        if(data!==-1){
            console.log("马上要上删除老照片咯");
            fs.unlink('./Public/userimg/'+username,function(err){
                if(err){
                    console.log(err);
                    callback({code:400,data:[],msg:"出错了啊！"});
                    return;
                }
                callback({code:200,data:[],msg:"YOYO！"});
            });
        }
    })
};*/



exports.homepage = function (username, callback) {   //主页
    querysql.home(username, function (data) {
        if(data){
            callback(data);
        }else {
            callback(false);
        }
    })
};


exports.bloglist = function (obj,callback) {   //博客列表
    querysql.queryblogli(obj,function(data){
       callback(data)
    })
};

exports.retrieve = function (obj, callback) {   //找回密码控制器
    var svc;
    qcloudsms.VC(function (data) {
        svc = data;
    });
    var Cvc = Number(obj.vc);
    console.log(svc + "," + Cvc);
    if (Cvc != svc) {
        callback({code: 400, data: [], msg: "验证码错误"});
    } else {
        querysql.querykey(obj.username, obj.phone, function (isUser) {
            console.log(isUser);
            if (isUser == false) {
                callback({code: 400, data: [], msg: "用户不存在或手机号和用户名不匹配"});
            } else if (isUser == true) {
                querysql.changekey(obj.password, obj.pwd, obj.username, function (change) {
                    if (change == false) {
                        callback({code: 400, data: [], msg: "修改失败"});
                    } else {
                        callback({code: 200, data: [], msg: "修改成功"});
                    }
                });
            }
        })
    }


};

/*exports.tips = function (callback) {  //主页的提示
        querysql.hotblog(function(data){
           if(data){
               var datas={
                   hotblog:data
               };
               callback(datas);
           }else {
               callback({code:400,data:[],msg:'服务器错误'})
           }
        })
};*/

exports.sendcomms = function (datas, callback) {   //评论控制器
    querysql.sendcom(datas,function(data){
       callback(data);
    });

};
exports.blogcomm = function (obj, callback) {  //文章评论控制函数
    querysql.blogcomms(obj,function(data){
        callback(data);
    })
};
exports.blogdata = function (blogid, callback) {   //博客数据控制函数
    querysql.blogone(blogid,function(reslut){
        if(reslut){
            callback(reslut);
        }else {
            callback(false);
        }
    })
};




