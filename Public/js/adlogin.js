/**
 * Created by asus on 2018/12/11.
 */

$(function(){

    var winheight=$(window).height();
    $("#ad_login").css({
        width:'100%',
        height:winheight
    });
    $('#mainpage').css({
        width:'100%',
        height:winheight
    });

    $("#login").click(function(){
        var username=$("input[name=username]").val();
        var password=$("input[name=password]").val();
        var newPwd= $.md5(password);
        if(!username){
            showprompt("请输入用户名！");
            return;
        }
        if(!password){
            showprompt("请输入密码！");
            return;
        }
        var data={
            username:username,
            password:newPwd
        }
        $.ajax({
            url:"/loginad",
            type:"POST",
            data:data,
            beforeSend: function(xhr){xhr.setRequestHeader('X-Test-Header', 'test-value');},
            error:function(err){
                if(err.readyState==4){
                    showprompt("用户名不存在或密码错误")
                }
            },
            success:function(data){
                window.location.href="/admin";
            }
        });
       /* $.post('/loginad',{
            username:username,
            password:password
        },function(data){
            if(data=="no"){
                showprompt("用户不存在！");
            }
            if (data=="yes"){
                window.location.href="/admin"
            }
        });*/
    });

    function showprompt(text){
        $('#prompt').stop().fadeIn(1000);
        $('#prompt').text(text);
        var timer1=setTimeout(function(){
            $('#prompt').stop().fadeOut(1000);
            clearTimeout(timer1);
        },1500);
    }
});
