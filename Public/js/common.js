/**
 * Created by asus on 2019/3/24.
 */
$(function () {

    (function ajaxSet() {
        let token = window.localStorage.getItem('token');
            console.log(token);
        if (window.localStorage.getItem('token')) {
            
            $.ajaxSetup({
                async: false,
                global: true,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                }
            });
        }
    })();
    //监听页面滚动


    var scrollFunc = function (e) {
        e = e || window.event;
        if (e.wheelDelta) {  //第一步：先判断浏览器IE，谷歌滑轮事件
            if (e.wheelDelta > 0) { //当滑轮向上滚动时

                /*	htmlUp()*/
            }
            if (e.wheelDelta < 0) { //当滑轮向下滚动时
                /*htmlDown()*/
            }
        } else if (e.detail) {  //Firefox滑轮事件
            if (e.detail > 0) { //当滑轮向上滚动时
                /*	htmlUp()*/
            }
            if (e.detail < 0) { //当滑轮向下滚动时
                /*htmlDown()*/
            }
        }
    }
    //给页面绑定滑轮滚动事件
    if (document.addEventListener) {//firefox
        document.addEventListener('DOMMouseScroll', scrollFunc, false);
    }
    //滚动滑轮触发scrollFunc方法  //ie 谷歌
    window.onmousewheel = document.onmousewheel = scrollFunc;


    $('#exit').click(function () {
        localStorage.removeItem('token');
        window.location.href = window.location.href;
    });


   

    /*****判断用户状态*****/
    islogin();

    function islogin() {

        $.ajax({
            type: 'GET',
            url: "../isLogin",
            success: (data) => {
                if (data.islogin) {
                    getmsg(data.user.username);
                    $('.unlogin').hide();
                    $('.logined').show();
                    $('.msg').attr('href','../home/'+data.user.username);
                    $('.nav-username').text(data.user.name);
                } else {
                    $('.unlogin').show();
                    $('.logined').hide();
                    localStorage.removeItem('token');
                }
            }

        })
    }

    const timer = setInterval(islogin, 5000);
   function getmsg (username)  {
        $.ajax({
            type: "POST",
            url: "../getmsg",
            data: {
                msg_tofrom_username: username
            },
            error: (err) => {
                console.log(err);
            },
            success: (data) => {
                $(".badge").hide();
                $(".lists").html("");
                let msgcount = data.length;
                if (data.length == 0) {
                    $(".badge").hide();
                    $(".AllreadD").hide();
                } else {
                    $(".badge").show().text(msgcount);
                    $(".AllreadD").show();
                }
                $(".unread").text("未读消息（" + msgcount + "）");
                for (let i = 0; i < data.length; i++) {
                    let dos;
                    let typex;
                    let content;
                    if (data[i].parent_type == "blog") {
                        dos = "评论了你的文章:";
                        typex = '去往原文章';
                        content = "“" + data[i].content + "”";
                    } else if (data[i].parent_type == "comm") {
                        dos = "回复了你的的评论：";
                        typex = '去往原文章';
                        content = "“" + data[i].content + "”";
                    }


                    let index = i + 1;
                    $(".lists").append(`
								<i class="msgli">
                                    <span class="indexs">` + index + `</span>
                                    <img src="https://wupopo-1256296697.cos.ap-chengdu.myqcloud.com/blog/img/` + data[i].img + `" class="whoimg" alt="">
                                    <a href="../home/` + data[i].target_username + `" class="who">` + data[i].name + `</a>
                                    <p class="do">` + dos + `</p>
                                    <p class="ctitle">` + content + `</p>
                                    <a  href="../blog/` + data[i].ancestors_id + `" class="typex">` + typex + `</a>
                                </i>
					`);
                }
            }

        })
    }

    $.ajax({
        type: "POST",
        url: "../getSidebar",
        error: function (err) {
            alert(err.responeJSON.msg);
        },
        success: function (data) {
            let blog = data.hotblog;
            var imgReg = /<img src="https:\/\/wupopo-1256296697.cos.ap-chengdu.myqcloud.com.*?(?:>|\/>)/gi;
            var imgarr = blog.content.match(imgReg); //查出所有图片地址
            var str = blog.content.replace(imgReg, '[图片]');
            var imgsrc;
            if (imgarr == null) {
                imgsrc = 'https://wupopo-1256296697.cos.ap-chengdu.myqcloud.com/' + 'blog/img/demoimg.jpg'
            } else {
                imgsrc = 'https://wupopo-1256296697.cos.ap-chengdu.myqcloud.com/' + imgarr[0].match(/myqcloud.com\/(\S*)"/)[1];
            }
            $("#hotHeader").css("backgroundImage", "url(" + imgsrc + ")");
            $(".index_title").attr('href', 'blog/' + blog.id);
            $(".index_title b").text(blog.title)
            $(".index_stime b").text(blog.time)
            $(".index_sendername").attr('href', 'home/' + blog.sendername).text(blog.name);
            $(".readmore").attr('href', 'blog/' + blog.id);
            $('.commbtn').attr('href', 'blog/' + blog.id + "#sendinp");
            $('.blogcontent').html(str);


            $(".noticeBody").text(data.notice);
            $(".vlogBody").attr("src", data.vlog);
            let obj = data.recomm;
            for (let i = 0; i < obj.length; i++) {
                $(".recBody").append(`
					<li><a href="blog/` + obj[i].id + `">` + obj[i].title + `</a></li>
			    `);
            }
        }
    });


});