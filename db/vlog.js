let vlogSql={
    addVlog:"INSERT INTO vlog(address,title,content,time) VALUES(?,?,?,?)",
    getvlog:'SELECT * FROM vlog ORDER BY id DESC limit ?,10'
}
module.exports=vlogSql;