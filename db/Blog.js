/**
 * Created by asus on 2019/3/31.
 */
var BlogSql={
    insertBlog:"INSERT into blog(title,sendername,time,content,likes,sub_id) VALUES(?,?,?,?,?,?)",
    insertSub:"INSERT into subject(sub_name,sub_time) VALUES(?,?)",
    deleteBlogById:"DELETE  FROM blog WHERE id=?",
    deleteComments:'DELETE FROM comment WHERE ancestors_id=?',
    updateBlogById:"UPDATE blog SET title=?, content? WHERE id?",
    getBlogInfoBySender:"SELECT title,id FROM blog WHERE sendername=?",
    selectBlogById:'SELECT img,name,blog.sendername,blog.likes,blog.time,blog.id,blog.content,blog.title FROM user RIGHT JOIN blog ON user.username=blog.sendername WHERE blog.id=?',
    selectCommById:'SELECT * FROM comment WHERE id =?',
    queryAll: 'SELECT * FROM blog',
    //queryBlogLi:"SELECT  img,name,blog.sendername,blog.likes,blog.time,blog.id,blog.content,blog.title FROM user RIGHT JOIN blog ON user.username=blog.sendername ORDER BY id DESC limit ?,?",
    queryBlogLi:"SELECT a.sendername,a.likes,a.time,a.id,a.content,a.title,b.name,b.img,c.sub_name FROM blog a,user b,subject c WHERE a.sendername=b.username AND a.sub_id=c.id  ORDER BY a.id DESC limit ?,?",
    likeChange:'UPDATE blog SET likes=? WHERE id=?',
   /* readAllComm:"SELECT * FROM comments WHERE blogid=? AND type=? order by indexs desc",*/
    readPartComm:"SELECT  img,name,comment.owner_username,comment.target_username,comment.content,comment.time,comment.parent_id,comment.parent_type,comment.id,comment.ancestors_id FROM user RIGHT JOIN comment ON user.username=comment.owner_username WHERE parent_id=? AND parent_type=?   ORDER BY id DESC limit ?,10",
  /*  readPartComm:"SELECT o.* FROM (SELECT * FROM comment WHERE parent_id=? AND parent_type=? order by id desc) o limit ?,10",*/
    insertComm:"INSERT into comment(owner_username,target_username,content,time,parent_id,parent_type,ancestors_id,isread) VALUES(?,?,?,?,?,?,?,?)",
    searchBlog:"SELECT  img,name,blog.sendername,blog.likes,blog.time,blog.sendername,blog.id,blog.content,blog.title FROM user RIGHT JOIN blog ON user.username=blog.sendername WHERE blog.title LIKE ? OR blog.content LIKE ? OR blog.sendername LIKE ? OR blog.sname LIKE ? ORDER BY id DESC limit 0,20",
    'querySubject':"SELECT * FROM subject"
};
module.exports=BlogSql;
