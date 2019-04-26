/**
 * Created by asus on 2019/3/17.
 */
$(function(){
    $('.blog').find('img:not([alt])').css({
        width:"60%"
    });
    var artId=window.location.href;  //获取文章id
    var index = artId .lastIndexOf("\/");
    artId  = artId .substring(index + 1, artId .length);

    /*拉取评论*/
    getComment(0, true);
    function getComment(num, isTrue) {
        let firstTime = {
            parent_id: artId,
            start: num,
            parent_type: "blog"
        };
        if (isTrue) {
            $('#appcom').html("");
        }
        $.ajax({
            type: "POST",
            url: "/getComments",
            data: firstTime,
            error: function (err) {
                tip(err.responseJSON.msg)
            },
            success: function (data) {
               if(data.length==0&&num==0){
                   $(".noComm").show();
                   return;
               }else {
                   $(".noComm").hide();
               }
                if(data.length<10){
                    $("#commMore").hide()
                }else if(data.length==10){
                    $("#commMore").show()
                }
                for(let i=0;i<data.length;i++){
                    $("#appcom").append(`
                        <li class="maincomm">
                           <div class="comheader">
                               <img src="http://wupopo-1256296697.cos.ap-chengdu.myqcloud.com/blog/img/` + data[i].img + `" alt="" class="userimg">
                               <a href="../home/`+data[i].owner_username+`" class="userinfo">`+data[i].name+`:</a>
                               <i class="time">`+data[i].time+`</i>
                               <i class="comid" style="display: none">`+data[i].id+`</i>
                           </div>
                            <div class="commbody">
                               `+data[i].content+`
                            </div>
                            <div class="commfooter">
                               <div class="readReply">查看回复</div>
                                <div class="Reply">回复</div>
                            </div>
                            <div id="reply_panel">
                                 <textarea class="replyInp" placeholder="输入你回复的内容"></textarea>
                                 <p>
                                    <input type="button" class="replyBtn" value="回复">
                                 </p>
                            </div>
                        </li>
                    `);
                }
            }
        });
    }

    let scd = 10;
    function moreBtn(){
        getComment(scd,false);
        scd = scd + 10;
    }
    $("#commMore").click(moreBtn);

        $(".likeBtn").click(function() {   //blog like per
            var cName = this.id;
            var blogid=artId;
            var btntype;
            var oldnum=$(".Lnum").text();
            oldnum=Number(oldnum);
            var num;
            if (cName == "liked") {
                btntype="unlike";
                num=-1;
            }else {
                btntype="liked";
                num=1;
            }
            $.ajax({
                type:'GET',
                url:"../like",
                data:{
                    type:btntype,
                    blogid:blogid
                },
                error:function(err){
                    tip(err.responseJSON.msg)
                },
                success:function(data){
                    $('.likeBtn').attr("id",btntype);
                    $(".Lnum").text(oldnum+num);
                }
            })
        });
    $(".commBtn").click(function(){   //send comment
        var comm=$(".commInp").val();

        if(!comm){
            tip("你没有输入任何内容！！！");
            return;
        }
        var data={
            parent_id:artId,
            ancestors_id:artId,
            content:comm,
            time:nowtime,
            parent_type:"blog"
        };
        $.ajax({
            type:'GET',
            url:'/sendcomm',
            data:data,
            timeout : 10000,
            error:function(err){
                tip(err.responseJSON.msg)
            },
            success:function(data){
                $(".commInp").val("");
                getComment(0, true);
            }
        });
    });

    $("#deletebtn").click(function(){   //delete blog
        $.ajax({
            type:"GET",
            url:'/deleteblog',
            data:{
                blogid:artId,
                time:nowtime
            },
            error:function(err){
                tip(err.responseJSON.msg);
            },
            success:function(data){
                tip(data["msg"]);
                setTimeout(function(){
                    window.location.href='/blog'
                },2000);
            }
        });
    });



  /*查看回复面板召唤*/
    $('body').on("click",".readReply",function(){
        $(".replytip").hide();
        $(".replylist").html('');
        $("#myModal").show();
       let a= this.previousSibling;
        let target_url=$(this).parent(".commfooter").siblings('.comheader').children('a').attr("href");
        let index= target_url .lastIndexOf("\/");
        let  target_username = target_url .substring(index+1, target_url .length);
        let parent_id=$(this).parent(".commfooter").siblings('.comheader').children('.comid').text();
       let target_content=$(this).parent(".commfooter").siblings('.commbody').text();

        $("#replypanel>.maincomm>.comheader").html($(this).parent(".commfooter").siblings('.comheader').html());
        $("#replypanel>.maincomm>.commbody").text($(this).parent(".commfooter").siblings('.commbody').text());

        let firstTime = {
            parent_id: parent_id,
            start: 0,
            parent_type: "comm"
        };
        $.ajax({
            type: "POST",
            url: "/getComments",
            data: firstTime,
            error: function (err) {
                tip(err.responseJSON.msg)
            },
            success:function(data){
               if(data.length==0){
                    $(".replytip").show();
                   $(".replylist").html('');
                   return;
               }
                for(let i=0;i<data.length;i++){
                    $(".replylist").append(`
                        <li class="mainreply">
                            <div class="comheader">
                                <img src="http://wupopo-1256296697.cos.ap-chengdu.myqcloud.com/blog/img/`+data[i].img+`" alt="" class="userimg">
                                <a href="../home/`+data[i].owner_username+`" class="userinfo">`+data[i].name+`:</a>
                                <i class="time">`+data[i].time+`</i>
                                 <i class="comid" style="display: none">`+data[i].id+`</i>
                            </div>
                            <div class="commbody">
                                `+data[i].content+`
                            </div>
                            <div class="commfooter">
                                <div class="readReply">查看回复</div>
                                <div class="Reply">回复</div>
                            </div>
                            <div id="reply_panel">
                                 <textarea class="replyInp" placeholder="输入你回复的内容"></textarea>
                                 <p>
                                    <input type="button" class="replyBtn" value="回复">
                                 </p>
                            </div>
                        </li>
                    `);
                }
            }
        });


    });


    $('body').on('click','.Reply',function(){
        $(this).parent('.commfooter').siblings('#reply_panel').stop().fadeToggle(0);
        let thisStyle= $(this).parent('.commfooter').siblings('#reply_panel').css("display");
        if(thisStyle=='none'){
            $(this).text("回复")
        }else {
            $(this).text("收起")
        }

    });

    $('body').on('click','.replyBtn',function(){
        let comm=$(this).parent('p').siblings('textarea').val();
        let parent_id=$(this).parent("p").parent("#reply_panel").siblings('.comheader').children('.comid').text();
        console.log(parent_id)


        var data={
            parent_id:parent_id,
            content:comm,
            ancestors_id:artId,
            time:nowtime,
            parent_type:"comm"
        };
        let _this=this;
        $.ajax({
            type:'GET',
            url:'/sendcomm',
            data:data,
            timeout : 10000,
            error:function(err){
                tip(err.responseJSON.msg)
            },
            success:function(data){
                tip(data.msg)
                $( _this).parent('p').siblings('textarea').val(null);
            }
        });
    });

    $('body').on('mouseover', '.maincomm,.mainreply', function () {

        $(this).children(".commfooter").children().show();
    });
    $('body').on('mouseout', '.maincomm,.mainreply', function () {

        $(this).children(".commfooter").children().hide();
    });

    $(".close").click(function(){
        $("#myModal").hide();
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
        return oyear + "-" + mo + "-" + odate + "&nbsp;&nbsp;" + ohour + ":" + ominutes;
    }

    function tip(str){   //tips
        $(".tips").show().text(str);
        setTimeout(function(){
            $(".tips").hide();
        },2000);

    }


});
