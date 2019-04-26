/**
 * Created by asus on 2018/11/8.
 */
$(function(){
	$("#send").hide();
	$('#send_show').click(function(){
		$("#send").fadeIn(200);
	});
	$('#send_hide').click(function(){
		$("#send").fadeOut(200);
	});

    
	
	
    //请求文章数据
    $.get('/bl',{},function(data){
        console.log(data.length);
        var oul=document.getElementById("model_1");
        var oli=oul.getElementsByTagName('li');
        var app=new Vue({
			el: '#content_blog',
			data: {
					titles: data
				}
		});
        $(".blog_title").click(function(){
            if($(this).siblings(".article").is(':hidden')){
                $(this).siblings(".article").slideDown(200);
            }else {
                $(this).siblings(".article").slideUp(200);
            }
        });
		
		$(".comment").click(function(){
				
		    });

    });



    //发送博客请求
    $("#sendblog").click(function(){
        if($('.name').text()){
            var blogtitle= $("#blogtitle").val();
            var blog=$("#blog").val();
            $.get('/sendblog',{
                title:blogtitle,
                blog:blog,
                time:nowtime
            },function(data){
                if(data=="ok"){
                    alert('发表成功')
                    window.location.href="/blog";
                }
                if(data=="no"){
                    alert("发表失败，请稍后再试");
                }
                if(data=="nologin"){
                    alert("登录失效，请重新登录");
                    window.location.href="/blog";
                }
            });
        }else {
            alert('请先登录！');
        }
    });

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
        return oyear+"-"+mo+"-"+odate;
    }

    $("#send_big").click(function(){
       var WinH=window.innerHeight;
        $("#send").removeClass("panel_small").addClass("panel_big");
        $(".send_body").css({
            height:WinH-35+"px"
        });
        $("#blog").css({
            height:WinH-85+"px",
            maxHeight:WinH-160+"px"
        });
    });
    $("#send_small").click(function(){
        $("#send").removeClass("panel_big").addClass("panel_small");
        $("#blog").css({
            height:130+"px",
            maxHeight:130+"px"
        });
        $(".send_body").css({
            height:265+"px"
        });
    });
});
