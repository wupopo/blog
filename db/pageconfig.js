/**
 * Created by asus on 2019/4/16.
 */

module.exports={
    queryPageConfig:"SELECT * FROM page_config ORDER BY id DESC LIMIT 1",
    queryBlogInfo:"SELECT title,id FROM blog WHERE id  in (?,?,?,?)",
    addConfig:"INSERT INTO page_config(notice,vlog,hotblog_id,recomm,time) VALUES(?,?,?,?,?)"
}
