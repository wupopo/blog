/**
 * Created by asus on 2019/4/3.
 */
var query = require('../db/query.js');
var recordSql=require("../db/recordSql.js");
function operRecord(obj){
    query(recordSql.operRecord,[obj.type,obj.role,obj.operator,obj.content,obj.object,obj.time],function(err,data){
        if(err){
            console.log(err);
            console.log("oper error");
        }else {
            console.log('oper success');
        }
    })
}
module.exports=operRecord;