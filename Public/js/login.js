/**
 * Created by asus on 2018/11/7.
 */
$(function () {

    $("#backpwd").click(function () {
        $('.back').show();
        $('.login').hide();
    });
    $(".backL").click(function () {
        $('.login').show();
        $('.back').hide();
    });
    $("#btn").click(function () {
        let winHeight = $(window).height();
        $("#excessive").show().css({
            height: winHeight + "px",
            lineHeight: winHeight + "px"
        });
        var ousername = document.getElementById("username");

        var username = $("input[name=username]").val();
        var password = $("input[name=password]").val();
        var data = {
            username: username,
            password: password
        };
        $.ajax({
            url: "/logins",
            type: "POST",
            data: data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-Test-Header', 'test-value');
            },
            error: function (err) {
                $("#excessive").hide();
                tip(err.responseJSON.msg)
            },
            success: function (data) {
                let token = data.token;
                window.localStorage.setItem('token', token);
                window.location.href = "/";
            }
        });
    });
    $(".vcbtn").click(function () {
        var phone = $("input[name=phone]").val();
        if (phone == '') {
            tip("手机号不能为空！");
            return;
        }

        $.ajax({
            type: "GET",
            url: "/vc",
            data: {phone: phone},
            error: function (err) {
                tip(err.responseJSON.msg);
            },
            success: function (data) {
                var count = 120;
                $(".vcbtn").attr({
                    disabled: 'disabled'
                });
                var timer = setInterval(function time() {
                    count--;
                    if (count == 0) {
                        $(".vcbtn").attr({disabled: false}).val("获取验证码");
                        clearInterval(timer);
                    } else {
                        $(".vcbtn").val(count + "s");
                    }
                }, 1000);
            }
        });

    });

    $("#btn1").click(function () {
        var username = $("input[name=username1]").val();
        var phone = $("input[name=phone]").val();
        var password = $("input[name=newped]").val();
        var pwd = $.md5(password);
        var vc = $("input[name=vc]").val();
        if (username == null || phone == null || password == null || vc == null) {
            tip('以上信息为必填！');
            return;
        }

        var data = {
            username: username,
            phone: phone,
            newpwd: password,
            vc: vc,
            pwd: pwd
        };
        $.ajax({
            type: 'GET',
            url: "/retrieve",
            data: data,
            error: function (err) {
                tip(err.responseJSON[0].msg);
            },
            success: function (data) {
                tip(data[0].msg);
                setTimeout(function () {
                    window.location.href = '/login';
                }, 2000);
            }
        });
    });
});

function tip(str) {
    $(".tips").show().text(str);
    setTimeout(function () {
        $(".tips").hide();
    }, 2000);

};
/*
$.post('/logins',{
    username:username,
    password:password
},function(data){
    if(data=="no"){
        alert("用户名不存在或密码错误");
    }
    if (data=="yes"){
        alert("登录成功");
        window.location.href="/";
    }
});*/
