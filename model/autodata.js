/**
 * Created by asus on 2019/3/30.
 */
var fs = require('fs');
var query = require('../db/query.js');
function autodata(){
        var now= new Date();
        var year=now.getYear();
        var month=now.getMonth()+1;
        var day=now.getDate();
        var hour=now.getHours();
        var minute=now.getMinutes();
        var second=now.getSeconds();
        query("UPDATE blog,user SET blog.sname=user.name WHERE blog.sendername=user.username",[],function(err,data){
            if(err){
                console.log(err);
                console.log(month+"-"+day+" "+hour+":"+minute+"博客列表数据更新异常")
            }
        });
        query("UPDATE comments,user SET comments.sname=user.name,comments.senderimg=user.img WHERE comments.sendername=user.username",[],function(err,data){
            if(err){
                console.log(err);
                console.log(month+"-"+day+" "+hour+":"+minute+"评论列表数据更新异常")
            }
        });
}
module.exports=autodata;