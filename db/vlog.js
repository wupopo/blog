let vlogSql={
    addVlog:"INSERT INTO vlog(address,title,content,time) VALUES(?,?,?,?)",
    getvlog:'SELECT * FROM vlog ORDER BY id DESC limit ?,10',
    getvlogone:'SELECT * FROM vlog WHERE id=?'
}
module.exports=vlogSql;