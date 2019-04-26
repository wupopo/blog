/**
 * Created by asus on 2018/12/8.
 */
var AdminSQL = {
    drop: 'DROP TABLE user', // 删除表中所有的数据
    queryAll: 'SELECT * FROM admin', // 查找表中所有数据
    getUserById: 'SELECT * FROM user WHERE uid =?', // 查找符合条件的数据
    changeInfoA:"UPDATE user SET name=?,phone=?,age=?,mail=?,sex=? WHERE username=?",
    queryOneuUserPer:"SELECT DISTINCT type,role,operator,oper_content,oper_object,oper_time FROM oper_record WHERE operator=? OR oper_object=? order by id desc"
};
module.exports = AdminSQL;

