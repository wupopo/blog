/**
 * Created by asus on 2019/4/21.
 */
const query=require("../db/query.js");
const unreadmsgSql=require("../db/unreadmsgsql.js");

/****存入未读消息****/
exports.InUnReadeMsg=(obj)=>{
    let msg_from_username=obj.msg_from_username;
    let msg_tofrom_username=obj.msg_tofrom_username;
    let msg_type=obj.msg_type;
    let msg_content=obj.msg_content;
    let parent_id=null;
    let ancestors_id=obj.ancestors_id;
    if(obj.parent_id){
        parent_id=obj.parent_id
    }

    let time=obj.time;

    query(unreadmsgSql.insertmsg,[msg_from_username,msg_tofrom_username,msg_type,msg_content,parent_id,time,ancestors_id],function(err,callback){
        if(err){
            console.log("unreadMsg.js>>>InUnReadeMsg\n"+err);
        }
    })
};

/******读取未读消息*******/
exports.OutUnReadeMsg=function(username,callback){

    query(unreadmsgSql.selectmsg,[username],function(err,msglist){
        if(err){
            console.log(err);
            callback(false);
            return;
        }
        callback(msglist)
    })
};



/*****全部标为已读******/

exports.readAll=(username,callback)=>{
    query(unreadmsgSql.readAll,[username],(err,data)=>{
        if(err){
            console.log(err);
            callback({code:401,data:[],msg:'操作出错！'});
        }else {
            callback({code:200,data:[],msg:'操作成功'});
        }
    });
}

