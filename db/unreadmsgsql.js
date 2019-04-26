/**
 * Created by asus on 2019/4/21.
 */
module.exports={
   /* insertmsg:"INSERT INTO unread_msg(msg_from_username,msg_tofrom_username,msg_type,msg_content,parent_id,time,ancestors_id) VALUES (?,?,?,?,?,?,?)",*/
    selectmsg:"SELECT name,img,comment.owner_username,comment.id,comment.target_username,comment.parent_type,comment.content,comment.parent_id,comment.time,comment.ancestors_id FROM user RIGHT JOIN comment ON user.username=comment.target_username WHERE comment.target_username=? AND comment.isread=false  ORDER BY comment.id DESC",
    readAll:'UPDATE comment SET isread=true WHERE target_username=? ',
    readOne:'UPDATE comment SET isread=true WHERE id=?'
};
