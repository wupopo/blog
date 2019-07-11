/**
 * Created by asus on 2018/11/29.
 */
$(document).ready(function () {

    setTimeout(function removeReadonly(){
        var username=document.getElementById("username");
        var password=document.getElementById("password");
        username.removeAttribute("readonly");
        password.removeAttribute("readonly");
    },1000);
    var phone;
    $(".vcbtn").click(function () {
        phone = $("#phone").val();
        if (phone == '') {
            $(".phone").show().text('手机号不能为空！').show();
            return;
        }
        if (isPhone(phone) == false) {
            return;
        }
        $.ajax({
            type: "GET",
            url: "/vc",
            data: {phone: phone},
            error: function (err) {
                    $(".tips").text(err.responseJSON.msg);
            },
            success: function (data) {
                var count = 120;
                $(".vcbtn").attr({
                    disabled: 'disabled'
                });
                console.log(data);
                window.localStorage.removeItem('token');
                window.localStorage.setItem("token",data.data);
                console.log(window.localStorage.getItem("token"))
                var timer = setInterval(function time() {
                    count--;
                    if (count == 0) {
                        $(".vcbtn").attr({disabled: false}).val("获取");
                        clearInterval(timer);
                        return;
                    } else {
                        $(".vcbtn").val(count + "s");
                    }
                }, 1000);
            }
        });

    });

    $("#name").bind("input propertychange",function () {
        var name = $(this).val();
        if (ischina(name) == false) {
            $(".name").show().text('昵称必须是由2-4位中文组成，不能为空');
        } else {
            $(".name").hide();
        }
    });

    $("#username").bind("input propertychange",function () {
        var username = $(this).val();
        if (isStudentNo(username) == false) {
            $(".username").show().text('开头为字母可包含数字组成，8-10位');

        } else {
            $(".username").hide()
        }
    });
    $("#password").bind("input propertychange",function () {
        var password = $(this).val();
        if (isPassword(password) == false) {
            $(".password").text('密码不能为中文，6-16位字符组成，不能为空').show();
        } else {
            $(".password").hide();
        }
    });
    $("#phone").bind("input propertychange",function () {
        var phone = $(this).val();
        if (isPhone(phone) == false) {
            $(".phone").text('手机号格式不正确!').show();
        } else {
            $(".phone").hide();
        }
    });
    $("#vc").bind("input propertychange",function () {
        var vc = $(this).val();
        if (isVc(vc) == false) {
            $(".vc").text('验证码格式不正确!').show();
        } else {
            $(".vc").hide();
        }
    });
    $("#btn1").click(function () {
        var name = $("#name").val();
        if (ischina(name) == false) {
            return;
        }
        var username = $("#username").val();
        if (isStudentNo(username) == false) {
            return;
        }
        var password = $("#password").val();
        if (isPassword(password) == false) {
            return;
        }
        var Ivc = $("#vc").val();
        if (!Ivc) {
            $(".vc").show().text('请填入验证码！');
            return;
        }
        var key= $.md5(password);
        console.log(key);
        var data={
            vc:Ivc,
            name: name,
            username: username,
            password: password,
            key:key,
            phone: phone
        };
        let token=window.localStorage.getItem('token');
        console.log(token);
        $.ajax({
            type:"GET",
            url:"/registereds",
            data:data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' +token );
            },
            error:function(err){
                  alert(err.responseJSON.msg);
            },
            success:function(data){
                alert(data.msg);
                window.location.href = "/login";
            }
        });
    });

    function ischina(str) {
        var reg = /^[\u4E00-\u9FA5]{2,4}$/;
        /*定义验证表达式*/
        return reg.test(str);
        /*进行验证*/
    }

    function isStudentNo(str) {
        var reg = /^[a-zA-Z][a-zA-Z0-9]{7,9}$/;
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
    function isVc(str) {
        var reg = /^[0-9]{4}$/;
        /*定义验证表达式*/
        return reg.test(str);
        /*进行验证*/
    }

    function isEmail(str) {
        var reg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
        return reg.test(str);
    }


    var a = 0;
    $("#eye").click(function () {
        a++;
        if (a > 2) {
            a = 1;
        }
        if (a == 1) {
            $(this).addClass("glyphicon-eye-open");
            $(this).removeClass("glyphicon-eye-close");
            $("#password").attr({
                type: "text"
            });
        } else {
            $(this).addClass(" glyphicon-eye-close");
            $(this).removeClass("glyphicon-eye-open");
            $("#password").attr({
                type: "password"
            });
        }
    });


});
