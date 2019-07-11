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



exports.getvlogOneC=function(id,callback){
    querysql.getvlogOneQ(id,function(data){
        callback(data);
    })
}










exports.getmsg=(username,callback)=>{  //获取未读消息
    unreadMsg.OutUnReadeMsg(username,(data)=>{
        callback(data);
    })
}



exports.pageconfigC=function(name,callback){
    querysql.querypageconfig(name,function(data){
        callback(data);
    })
}













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

;

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

exports.blogdata = function (blogid, callback) {   //博客数据控制函数
    querysql.blogone(blogid,function(reslut){
        if(reslut){
            callback(reslut);
        }else {
            callback(false);
        }
    })
};




