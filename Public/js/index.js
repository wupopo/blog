/**
 * Created by asus on 2018/10/29.
 */
$(document).ready(function () {

    $('.hotblog').find('img:not([alt])').css({
        width: "60%"
    });

    $("#share").click(function () {
        if ($('.name').text()) {
            window.location.href = "/share";
        } else {
            alert('请登录后访问！');
        }
    });


    if ($(".name").text()) {
        $(".login-r").hide();
        $(".nav-person").show();
    }
    $("#more").click(function () {
        $("#show").toggle();
    });

    $(".person_list").hide();
    $(".nav-person").click(function () {
        $(".person_list").toggle();
    });

    $(".nav_list").hide();
    $(".share_nav_btn").click(function () {
        $(this).siblings().toggle();   //选择同级元素操作  //知识点啊朋友，siblings()好好了解哈
        /* $("html , body").animate({ scrollTop : 1000 } , 1000);*/  //页面显示到某一位置
    });

    $(".M_btn").click(function () {
        var oMusicP = $("#music").offset().left;
        if (oMusicP < 0) {
            $("#music").animate({
                left: 0
            }, 500, function () {
                $(".M_btn span").removeClass("glyphicon-forward");
                $(".M_btn span").addClass("glyphicon-backward");
            });
        }
        if (oMusicP == 0) {
            $("#music").animate({
                left: -470
            }, 500, function () {
                $(".M_btn span").removeClass("glyphicon-backward");
                $(".M_btn span").addClass("glyphicon-forward");
            });
        }
    });


    /***   banner   ***/

    let toLeft = ()=> {
        let imgArr = $('.img img');
        let index;
        for (let i = 0; i < imgArr.length; i++) {
            if (imgArr.eq(i).css('display') == 'block') {
                index = i
            }
        }
        if (index == 0) {
            imgArr.eq(index).fadeOut(1000);
            imgArr.eq(2).fadeIn(800);
        } else {
            imgArr.eq(index).fadeOut(1000);
            imgArr.eq(index - 1).fadeIn(800);
        }

    };
    let toRight = ()=> {
        let imgArr = $('.img img');
        let index;
        for (let i = 0; i < imgArr.length; i++) {
            if (imgArr.eq(i).css('display') == 'block') {
                index = i
            }
        }
        if (index == 2) {
            imgArr.eq(index).fadeOut(1000);
            imgArr.eq(0).fadeIn(800);
        } else {
            imgArr.eq(index).fadeOut(1000);
            imgArr.eq(index +1).fadeIn(800);
        }

    };
    let timer=setInterval(toRight,3000);
    $(".btn_left").click(()=> {
        toLeft();
    });
    $(".btn_right").click(()=> {
        toRight();
    });

    $("#banner").mouseover(()=>{
        clearInterval(timer);
        $(".banner_btn").show();
    });

    $("#banner").mouseout(()=>{
        timer=setInterval(toRight,3000);
        $(".banner_btn").hide();
    });

});


