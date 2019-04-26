/**
 * Created by asus on 2018/12/3.
 */
var UserSQL = {
    insert: 'INSERT INTO user(name,username,password,phone,age,mail,sex,pwd) VALUES(?,?,?,?,?,?,?,?)', // 插入数据
    drop: 'DROP TABLE user', // 删除表中所有的数据
    queryAll: 'SELECT * FROM user', // 查找表中所有数据
    getUserByUname: 'SELECT * FROM user WHERE username =?', // 查找符合条件的数据
    deleteUserByUname:"DELETE FROM user WHERE username=?",
    changeInfoU:"UPDATE user SET name=?,phone=?,age=?,mail=?,sex=? WHERE username=?",
    setUserImg:"UPDATE user SET img=? WHERE username=?",
    getuserInfo:"SELECT name,username,sex,phone,mail,phone,img,age FROM user WHERE username=?",
	selectSexUser:"SELECT * FROM user WHERE sex =?",
};
module.exports = UserSQL;
