/**
 * Created by asus on 2018/11/29.
 */
$(document).ready(function () {
    $("#file").change(function(){
        var reads= new FileReader();
        f=document.getElementById('file').files[0];
        reads.readAsDataURL(f);
        reads.onload=function (e) {
            document.getElementById('show').src=this.result;
            $(".yulan").show();
        };
    });

    //改变布局
    let windowWid=$(window).width();
    if(windowWid<990){
        $(".bodyleft").hide();
        $(".headernav").show();
    }
    if(windowWid>990){
        $(".bodyleft").show();
        $(".headernav").hide();
    }
$(window).resize(function(){
    let windowWid=$(window).width();
    if(windowWid<990){
        $(".bodyleft").hide();
        $(".headernav").show();
    }
    if(windowWid>990){
        $(".bodyleft").show();
        $(".headernav").hide();
    }
});

    //个人信息面板召唤
    $(".info").click(function(){
        $(".infopanel").show(1000).siblings('div').hide();
    });
    //修改信息面板召唤
    $(".changeinfo").click(function(){
        $(".changepanel").show(1000).siblings('div').hide();
    });
    //未读消息面板召唤
    $(".unread").click(function(){
        $(".unreadpanel").show(1000).siblings('div').hide();
    });
    //文章面板召唤
    $(".art").click(function(){
        $(".artpanel").show(1000).siblings('div').hide();
    });


    //信息修改
    $("#chgbtn").click(function(){
        var name=$("#name").val();
        var age=$("#age").val();
        var mail=$("#mail").val();
        var phone=$(".phone").text();
        var sex=$('input[name=sex]:checked').val();
        var data = {
            name: name,
            mail: mail,
            sex: sex,
            age: age,
            phone:phone,
            time:nowtime
        };
        $.ajax({
            type: "GET",
            url: "/changeinfo",
            data: data,
            dataType: "json",
            error: function (err) {
                tip(err.responseJSON.msg);
            },
            success: function (data) {
                tip(data.msg);
            }
        });
    });

    $(".allRead").click(function(){
        let username=$(".userid").text();
        $.ajax({
            type:"GET",
            url:"../readIt",
            data:{
                type:"all",
                username:username
            },
            error:function(err){
                tip(err._responseJson.msg);
            },
            success:function(data){
                tip(data.msg);
                setTimeout(function(){
                    window.location.href=window.location.href
                },2000);
            }
        });
    });
  /*  $("#upload_btn").click(function () {
        $("#uploadHPS").show();
        $("#uploadHPS").siblings().hide();
        $("#describe").text('上传头像');
    });
    $("#cek_In").click(function () {
        $("#cek_information").show();
        $("#cek_information").siblings().hide();
        $("#describe").text('个人资料');
    });
    $("#change_In").click(function () {
        $("#PerInform").show();
        $("#PerInform").siblings().hide();
        $("#describe").text('修改资料');
    });

    $("#sure_change").click(function () {
        var name = $("input[name=name]").val();
        if (ischina(name) == false) {
            $("input[name=name]").next().text("*由2-4位文字组成")
            return;
        }
        var phone = $("input[name=phone]").val();
        if (isPhone(phone) == false) {
            $("input[name=phone]").next().text("*手机格式不正确")
            return;
        }
        var mail = $("input[name=mail]").val();
        if (isEmail(mail) == false) {
            $("input[name=mail]").next().text("*邮箱格式不正确")
            return;
        }
        var sex = $('input[name=sex]:checked').val();
        if (sex == null) {
            $(".sexinf").text("*未选择性别");
            return;
        }
        var age = $("input[name=age]").val();
        if (isAge(age) == false) {
            $("input[name=age]").next().text("*年龄为3位数字")
            return;
        }
        var data = {
            name: name,
            phone: phone,
            mail: mail,
            sex: sex,
            age: age,
            time:nowtime
        }
        $.ajax({
            type: "GET",
            url: "/changeinfo",
            data: data,
            dataType: "json",
            error: function (err) {
                alert(err.responseJSON.msg);
            },
            success: function (data) {
                window.location.href="/personCenter";
            }
        });
        $.get("/changeinfo",{
         name:name,
         phone:phone,
         mail:mail,
         sex:sex,
         age:age
         },function(data){
         if(data=="no"){
         alert('修改失败，稍后再试');
         }
         if (data=="ok"){
         alert('修改成功!');
         window.location.href="/personCenter";
         }
         })
    });*/
    function ischina(str) {
        var reg = /^[\u4E00-\u9FA5]{2,4}$/;
        /*定义验证表达式*/
        return reg.test(str);
        /*进行验证*/
    }

    function isStudentNo(str) {
        var reg = /^[0-9]{8}$/;
        /*定义验证表达式*/
        return reg.test(str);
        /*进行验证*/
    }

    function isAge(str) {
        var reg = /^[0-9]{1,3}$/;
        /*定义验证表达式*/
        return reg.test(str);
        /*进行验证*/
    }

    function isPassword(str) {
        var reg = /^[^\u4e00-\u9fa5]{6,16}$/;
        /*定义验证表达式*/
        return reg.test(str);
        /*进行验证*/
    }

    function isPhone(str) {
        var reg = /^[0-9]{11}$/;
        /*定义验证表达式*/
        return reg.test(str);
        /*进行验证*/
    }

    function isEmail(str) {
        var reg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
        return reg.test(str);
    }

    function nowtime(){    //获取当前系统时间
        var now = new Date();
        var oyear=now.getFullYear(); // 2015, 年份
        var omonth=now.getMonth(); // 5, 月份，注意月份范围是0~11，5表示六月
        var odate=now.getDate(); // 24, 表示24号
        var oday=now.getDay(); // 3, 表示星期三
        var ohour=now.getHours(); // 19, 24小时制
        var ominutes=now.getMinutes(); // 49, 分钟
        now.getSeconds(); // 22, 秒
        now.getMilliseconds(); // 875, 毫秒数
        now.getTime(); // 1435146562875, 以number形式表示的时间戳
        var mo=omonth=Number(omonth)+1;
        return oyear + "-" + mo + "-" + odate + "&nbsp;&nbsp;" + ohour + ":" + ominutes;
    }
    function tip(str){   //tips
        $(".tips").show().text(str);
        setTimeout(function(){
            $(".tips").hide();
        },2000);

    }
});
