/**
 * Created by asus on 2018/11/8.
 */
/*博客模态框*/
function omodel(){
    window.alert=function(title,content){
        var omodel=document.getElementById("model");
       /* var omodel_title=document.getElementById("model_title").innerHTML;
        omodel_title=title;
        var omodel_wen=document.getElementById("model_wen").innerHTML;s
        omodel_wen=content;*/
        if(omodel){
            omodel.style.display="block";
        }else {
            var div=document.createElement("div");
            div.id="model";
            div.style.display="block";
        }
    };
    alert("公告","'");
}
function model_hidden(){
    var omodel=document.getElementById("model");
    omodel.style.display="none";
}