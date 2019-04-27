/**
 * Created by asus on 2019/3/22.
 */
$(function () {
    /**********监听窗口大小变化进行布局调整***********/
    windowSize();
    function windowSize(){
        let windowWid=$(window).width();
        if(windowWid<990){
            $("#rightBarBlock").hide();
        }
        if(windowWid>990){
            $("#rightBarBlock").show();
        }
        var imgWidth= $('.blogImg').width()*0.8;
        $(".blogCon").css({
            height:imgWidth
        });
        $(".blogImg").css({
            height:imgWidth
        });
        $(".blogImg>img").css({
            height:imgWidth
        })
        $(".blogArt").css({
            height:imgWidth
        })

    }
    $(window).resize(function () {          //当浏览器大小变化时
        windowSize()
    });



    /**********监听滚动条***********/

    $(window).scroll(function(event){
        let windowHei=$(window).height();
        var morebtn=$("#morebtn").offset().top- document.documentElement.scrollTop-windowHei;
        if(morebtn<100&&morebtn>0){
            moreBtn();
        }
        if(document.documentElement.scrollTop>=600){
            $(".Up").show();
        }else {
            $(".Up").hide();
        }
    });



        /*********回到顶部****/
    $(".Up").click(function(){
        $('.navbar').css({
            backgroundColor: "#222",
            borderColor: " #080808",
            position: "relative",
            minHeight: "50px",
            marginBottom: " 20px",
            border: "1px solid transparent",
        })
        $('#content').css({
            position:"absolute",
            top:'70px',
            width:'100%',
            zIndex:1
        });
        var morebtn=$("body").offset().top- document.documentElement.scrollTop;
       let sudu= document.documentElement.scrollTop*0.05;
        var timer=setInterval(function(){
            document.documentElement.scrollTop=document.documentElement.scrollTop-sudu;
            if(document.documentElement.scrollTop<=0){
                document.documentElement.scrollTop=0;
                clearInterval(timer);
            }
        },10);
    });


     /**********获取文章***********/
    getBloglist(0,true);
    function getBloglist(Num,news) {
        let start = Num;
        let firstTime = {
            start: start,
            end: 10
        };
        if(news){
            $('.blogBarBlock').html("");
        }
        $.ajax({
            type: "POST",
            url: "/getBlogList",
            data: firstTime,
            error: function (err) {
                tip(err.responseJSON.msg);
            },
            success: function (reslut) {
                let data = reslut.data;
                if (data.length == 10) {
                    $("#morebtn").show();
                } else {
                    $("#morebtn").hide();
                }
                let username = reslut.msg;

                for (let i = 0; i < data.length; i++) {
                    var imgReg = /<img src="https:\/\/wupopo-1256296697.cos.ap-chengdu.myqcloud.com.*?(?:>|\/>)/gi;
                    var imgarr=data[i].content.match(imgReg); //查出所有图片地址
                    var str=data[i].content.replace(imgReg,'[图片]');
                    var imgsrc;
                  if(imgarr==null){
                    imgsrc='blog/img/demoimg.jpg'
                  }else {
                      imgsrc=imgarr[0].match(/myqcloud.com\/(\S*)"/)[1];
                  }


                    let likearr = []
                    if (data[i].likes) {
                        likearr = data[i].likes.split('|');
                    }

                    var likebtn;
                    if (username == 'nologin') {
                        likebtn = 'unlike'
                    } else if (likearr.indexOf(username) > -1) {
                        likebtn = 'like'
                    } else {
                        likebtn = 'unlike'
                    }

                    $('#blogBarBlock').append(`
                        <div class="blogBar">
                            <div class="Bar">
                                <div class="senderInfo">
                                <img src="http://wupopo-1256296697.cos.ap-chengdu.myqcloud.com/blog/img/` + data[i].img + `" alt="">
                                <a class="sendername" href="../home/` + data[i].sendername + `">` + data[i].name + `</a>
                                <p class="title">《 <a href="../blog/` + data[i].id + `" title="` + data[i].title + `" name="` + data[i].id + `">` + data[i].title + `</a> 》</p>
                             <i class="sendTime">` + data[i].time + `</i>
                            </div>
                            <div class="blogCon">
                            <div class="blogImg">
                                <img src="https://wupopo-1256296697.cos.ap-chengdu.myqcloud.com/`+imgsrc+`" alt="">
                            </div>
                            <div class="blogArt">
                                 ` + str + `
                            </div>

                            </div>
                            <div class="blogBarFooter">
                                <a class="readAll" href="../blog/` + data[i].id + `">查看全文</a>
                                <p class="likeBtn glyphicon glyphicon-heart ` + likebtn + `" ><i class="Lnum">` + likearr.length + `</i></p>
                            </div>
                            </div>
                        </div>
                    `);
                }
            }
        });
    }

    var scd = 10;
    function moreBtn(){
        getBloglist(scd,false);
        scd = scd + 10;
    }
    $("#more").click(morebtn);


    $('body').on("click",".like",function(){
        let href = this.previousSibling.previousSibling.getAttribute("href");
        let blogid = href.match(/blog\/(.*)/)[1];
        let _this=this;
        $.ajax({
            type: 'GET',
            url: "/like",
            data: {
                type: 'unlike',
                blogid: blogid
            },
            error: function (err) {
                tip(err.responseJSON.msg);
            },
            success: function (data) {
                let num=Number(_this.firstChild.innerHTML);
                _this.firstChild.innerHTML=num -1
               _this.classList.remove('like');
                _this.classList.add('unlike');
            }
        });
    });
    $('body').on("click",".unlike",function(){
        let href = this.previousSibling.previousSibling.getAttribute("href");
        let blogid = href.match(/blog\/(.*)/)[1];
        let _this=this;
        $.ajax({
            type: 'GET',
            url: "/like",
            data: {
                type: 'liked',
                blogid: blogid
            },
            error: function (err) {
                tip(err.responseJSON.msg);
            },
            success: function (data) {
                let num=Number(_this.firstChild.innerHTML);
                _this.firstChild.innerHTML=num+1;
                _this.classList.remove('unlike');
                _this.classList.add('like');
            }
        });

    });


    /*****文章搜索*****/
            //搜索主函数

            //点击事件绑定
        $(".seabtn").click(function(){

            var seaCon=$(".seainp").val();
            $.ajax({
                type:'POST',
                url:'/search',
                data:{
                    content:seaCon
                },
                error:function(err){
                    alert(err.responseJSON.msg)
                },
                success:function(reslut){
                    $("#more").hide();
                    $('#blogBarBlock').html("");
                   if(reslut.data.length==0){
                       $('#blogBarBlock').append(`
                        <p class="tipsinfo">没有你要的信息，建议你输入存在且连续的部分信息</p>
                        <a href="/blog" class="glyphicon glyphicon-menu-left tipsback">返回</a>
                       `);
                   }else {
                       $('#blogBarBlock').append(`
                        <p class="tipsinfo">你可能要找以下信息</p>
                        <a href="/blog" class="glyphicon glyphicon-menu-left tipsback">返回</a>
                       `);
                       let data = reslut.data;
                       if (data.length == 10) {
                           $("#morebtn").show();
                       } else {
                           $("#morebtn").hide();
                       }
                       let username = reslut.msg;

                       for (let i = 0; i < data.length; i++) {
                           var imgReg = /<img src="https:\/\/wupopo-1256296697.cos.ap-chengdu.myqcloud.com.*?(?:>|\/>)/gi;
                           var imgarr=data[i].content.match(imgReg); //查出所有图片地址
                           var str=data[i].content.replace(imgReg,'[图片]');
                           var imgsrc;
                           if(imgarr==null){
                               imgsrc='blog/img/demoimg.jpg'
                           }else {
                               imgsrc=imgarr[0].match(/myqcloud.com\/(\S*)"/)[1];
                           }


                           let likearr = []
                           if (data[i].likes) {
                               likearr = data[i].likes.split('|');
                           }

                           var likebtn;
                           if (username == 'nologin') {
                               likebtn = 'unlike'
                           } else if (likearr.indexOf(username) > -1) {
                               likebtn = 'like'
                           } else {
                               likebtn = 'unlike'
                           }

                           $('#blogBarBlock').append(`
                        <div class="blogBar">
                            <div class="Bar">
                                <div class="senderInfo">
                                <img src="http://wupopo-1256296697.cos.ap-chengdu.myqcloud.com/blog/img/` + data[i].img + `" alt="">
                                <a class="sendername" href="../home/` + data[i].sendername + `">` + data[i].name + `</a>
                                <p class="title">《 <a href="../blog/` + data[i].id + `">` + data[i].title + `</a> 》</p>
                             <i class="sendTime">` + data[i].time + `</i>
                            </div>
                            <div class="blogCon">
                            <div class="blogImg">
                                <img src="https://wupopo-1256296697.cos.ap-chengdu.myqcloud.com/`+imgsrc+`" alt="">
                            </div>
                            <div class="blogArt">
                                 ` + str + `
                            </div>

                            </div>
                            <div class="blogBarFooter">
                                <a class="readAll" href="../blog/` + data[i].id + `">查看全文</a>
                            </div>
                            </div>
                        </div>
                    `);
                       }
                   }
                }
            })
        });



    //文本编辑器配置
    var E = window.wangEditor;
    var editor = new E('#editor');
    // 或者 var editor = new E( document.getElementById('editor') )
    editor.customConfig.menus = [
        'head',
        'bold',
        'italic',
        'underline',
        'code',
        'image',
        'justify',  // 对齐方式
        'foreColor' // 文字颜色
    ];
    editor.customConfig.showLinkImg = false;
    editor.customConfig.uploadImgShowBase64 = true;
    editor.customConfig.uploadImgServer = '/upblogimg'
    editor.create();

    //文本编辑器召唤
    $(".Bbtn").click(function () {
        $('#ide').show();
        $('nav').hide();
        $("#content").hide();
    });
    $("#closeIde").click(function () {
        $('#ide').hide();
        $('nav').show();
        $("#content").show();
    });


    //发送博客
    $("#sendB").click(function () {
        var blog = editor.txt.html();
        var blogtitle = $("#Btitle").val();
        $.ajax({
            type: 'GET',
            url: '/sendblog',
            data: {
                title: blogtitle,
                blog: blog,
                time: nowtime
            },
            error: function (err) {
                tip(err.responseJSON.msg);
            },
            success: function (data) {
                $('#ide').hide();
                $('nav').show();
                $("#content").show();
                $(".blogBar").remove();
                getBloglist(0,true)
            }
        });

    });

    function nowtime() {    //获取当前系统时间
        var now = new Date();
        var oyear = now.getFullYear(); // 2015, 年份
        var omonth = now.getMonth(); // 5, 月份，注意月份范围是0~11，5表示六月
        var odate = now.getDate(); // 24, 表示24号
        var oday = now.getDay(); // 3, 表示星期三
        var ohour = now.getHours(); // 19, 24小时制
        var ominutes = now.getMinutes(); // 49, 分钟
        now.getSeconds(); // 22, 秒
        now.getMilliseconds(); // 875, 毫秒数
        now.getTime(); // 1435146562875, 以number形式表示的时间戳
        var mo = omonth = Number(omonth) + 1;
        return oyear + "-" + mo + "-" + odate;
    }


    function tip(str){   //tips
        $(".tips").show().text(str);
        setTimeout(function(){
            $(".tips").hide();
        },2000);

    }
});
