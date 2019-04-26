/**
 * Created by asus on 2018/12/8.
 */
$(function () {
	var pos=0;
            var app = new Vue({
                el: "#mainpage",
                data: {
                    uname:"",
                    users: [],
                    blog: [],
					webdata:{}
                },
                mounted: function () {
                    document.getElementById("uList").addEventListener('mousewheel',this.handleScroll,false);
                        //// firefox
                    document.getElementById("uList").addEventListener("DOMMouseScroll",this.handleScroll,false);
                    this.uBtn();

                },

                methods: {
                    handleScroll:function(e){   //判断滚轮方向
                        var direction = e.deltaY>0?'down':'up';
                        var pro;
                        if(direction=="down"){
                            pos=pos+2;
                            this.winup(pos);
                        }else {
                            pos=pos+2;
                            this.windown(pos);
                        }
                    },
                    clickusernav:function(){   //导航栏用户管理
                        let _this=this;
                        $.ajax({
                            type:"GET",
                            url:'/userList',
                            data:{},
                            error:function(err){
                                console.log(err)
                            },
                            success:function(data){
                                $(".user_jiazai1").hide();
                                $(".list").show();
                                _this.users=data;
                            }
                        })
                    },
                    windown:function(par){   //用户列表向下移动
                        var areaH= $(".area").height();
                        var viewH=$(".viewUli").height();
                        var maxDis=viewH-areaH;
                        var wCurDis=$(".area").position().top;
                        var wMovedDis=wCurDis+par;
                        var pro=-wMovedDis/-maxDis;
                        if(wMovedDis>0){
                            pos=0;
                            return;
                        }
                        $(".area").css({
                            top:wMovedDis
                        });
                        $(".block").css({
                            top:380*pro
                        });
                    },
                    winup:function(par){   //用户列表向上移动
                        var areaH= $(".area").height();
                        var viewH=$(".viewUli").height();
                        var maxDis=viewH-areaH;
                        var wCurDis=$(".area").position().top;
                        var bCurDis=$(".block").position().top;
                        var wMovedDis=wCurDis-par;
                        var pro=-wMovedDis/-maxDis;
                        if(pro>1){
                            pro=1
                        }
                        if(wMovedDis<maxDis){
                            pos=0;
                            return;
                        }
                        $(".area").css({
                            top:wMovedDis
                        });
                        $(".block").css({
                            top:380*pro
                        });
                    },
                    ondelete: function () { /* 删除用户请求*/
                        let _this=this;
                        var name = $("#name").val();
                        var username = $("#username").val();
                        var istrue = confirm("确认删除" + name + "吗？");
                        if (istrue == true) {
                            this.gross--;
                            var datas = {
                                time: nowtime,
                                opedUname: username
                            };
                            $.ajax({
                                type: "GET",
                                url: "/delete_user",
                                dataType: "json",
                                data: datas,
                                error: function (err) {
                                    showprompt(err.responseJSON.msg);
                                    window.setTimeout(function () {
                                        window.location.href = "/adlogin"
                                    }, 4000);
                                },
                                success: function (data) {
                                    showprompt(data.msg);
                                    $(".starpanle").show();
                                    $(".ubg").hide();
                                    _this.clickusernav();
                                }
                            });
                        } else {
                            return
                        }
                    }
                    ,
                    clickuser:function(username){   //点击用户
                        $.ajax({
                            type:"POST",
                            url:'/oneuserinfo',
                            data:{
                                username:username
                            },
                            error:function(err){
                                showprompt(err.responseJSON.msg);
                            },
                            success:function(data){
                                //根据请求到数据改变视图
                                $(".starpanle").hide();
                                $(".ubg").show();
                                $("#userblog").html("");
                                $("#oper").html("");
                                $("#username").val(data.user.username);
                                $("#name").val(data.user.name);
                                $("#age").val(data.user.age);
                                $("#sex").val(data.user.sex);
                                $("#mail").val(data.user.mail);
                                $("#phone").val(data.user.phone);
                                if(data.user.img==null){
                                    $(".userimg").attr("src","../img/demoimg.png");
                                }else {
                                    $(".userimg").attr("src","http://wupopo-1256296697.cos.ap-chengdu.myqcloud.com/blog/img/"+data.user.img);
                                }

                                if(data.blog.length==0){
                                    var ele1=document.getElementById("userblog");  //增加必须找到要增加标签的父级标签
                                    var add_son1=document.createElement("li");   // 这是一个创建P标签的方法
                                    ele1.appendChild(add_son1);                  // 这是给父级标签添加一个孩子
                                    add_son1.innerHTML="<h5 style='color: #df7106'>此用户未发布任何文章</h5>"
                                }else {
                                    for(var i=0;i<data.blog.length;i++){
                                        var ele=document.getElementById("userblog");  //增加必须找到要增加标签的父级标签
                                        var add_son=document.createElement("li");   // 这是一个创建P标签的方法
                                        ele.appendChild(add_son);                  // 这是给父级标签添加一个孩子
                                        add_son.innerHTML="<a href='/blog/"+data.blog[i].id+"'>"+data.blog[i].title+"</a>"
                                    }
                                }

                                if(!data.oper){
                                    $("#oper").html("<h5 style='color: red'>获取操作记录出错！</h5>");
                                }else if(data.oper.length==0){
                                    $("#oper").html("<h5 style='color:#df7106'>没有关于此用户的日志记录</h5>");
                                }else {
                                    var role={
                                        user:"用户",
                                        admin:"管理员"
                                    }
                                    var type={
                                        delete_blog:"删除",
                                        change_info:"修改",
                                        delete_user:'删除',
                                        send_blog:"发送",
                                        reg:'注册',
                                        login:'登录'
                                    }
                                    var obj={
                                        delete_blog:"文章",
                                        change_info:"信息"
                                    }
                                    for(var x=0;x<data.oper.length;x++){

                                        var ele2=document.getElementById("oper");  //增加必须找到要增加标签的父级标签
                                        var add_son2=document.createElement("li");   // 这是一个创建P标签的方法
                                        ele2.appendChild(add_son2);                  // 这是给父级标签添加一个孩子
                                        add_son2.innerHTML=data.oper[x].oper_time+"&nbsp;"+"用户名为:"+data.oper[x].operator+"的"+role[data.oper[x].role]+"&nbsp;"+
                                                            type[data.oper[x].type]+"id/用户名为"+data.oper[x].oper_object+"的"+obj[data.oper[x].type]
                                    }
                                }

                            }
                        });
                    },
                    scrollBar:function(){
                        $(".viewUli").bind("mousemove",function(e){
                            var ay = e.originalEvent.y || e.originalEvent.layerY || 0;
                            var viewH= $(".area").height();
                            var blockT=$(".block").position().top;
                            var viewT=$(".viewUli").offset().top;
                            var Amouse=Math.round(ay-viewT);
                            var pro=Amouse/400;
                            $(".block").css({
                                top:pro*380
                            });
                            $(".area").css({
                                top:-pro*(viewH-400)
                            });
                        });
                        $(document).mouseup(function(){
                            $(".viewUli").unbind("mousemove");
                        });
                    },
                    uBtn:function(){
                        $(".uBtn").addClass("currV").removeClass("hideV").css({
                            left:0
                        });
                        $(".aBtn").addClass("hideV").removeClass("currV").css({
                            right:0
                        });
                    },
                    aBtn:function(){
                        $(".aBtn").addClass("currV").removeClass("hideV").css({
                            right:0
                        });
                        $(".uBtn").addClass("hideV").removeClass("currV").css({
                            left:0
                        });
                    },
                    change_sure: function () {       /* 修改信息请求*/
                        var _this=this;
                        var age = $('#age').val();
                        if (!$('#age').val()) {
                            age = 0
                        }
                        var dataed = {
                            username: $('#username').val(),
                            name: $('#name').val(),
                            sex: $('#sex').val(),
                            phone: $('#phone').val(),
                            mail: $('#mail').val(),
                            age: age,
                            time: nowtime
                        }
                        $.ajax({
                            type: "GET",
                            url: "/changeinfo",
                            data: dataed,
                            dataType: "json",
                            error: function (err) {
                                showprompt(err.responseJSON.msg);
                            },
                            success: function (info) {
                                showprompt(info.msg);
                                console.log(info);

                            }
                        });
                      setTimeout(function(){
                          console.log("数据更新成功");
                      _this.clickuser(dataed.username);
						_this.clickusernav()
                       },2000)
                    },
                    addUser: function () {        /* 添加用户请求*/
                        var key = $.md5($('#password').val());
                        var dataed = {
                            username: $('#username').val(),
                            name: $('#name').val(),
                            phone: $('#phone').val(),
                            password: $('#password').val(),
                            key: key
                        };
                        $.ajax({
                            type: "GET",
                            url: "/registereds",
                            data: dataed,

                            error: function (err) {
                                showprompt(err.responseJSON.msg);
                            },
                            success: function (data) {
                                console.log(data.code);
                                window.location.href = "/admin";
                            }
                        });
                    },
                    setSeaPan: function () {
                        $("#SeaPanel").fadeIn(200);
                    },
					webdatanav:function(){
						let _this=this;
						$.ajax({
							type:"GET",
							url:"/webdata",
							data:{},
							error:function(err){
								alert(err);
							},
							success:function(userbili){
								var dom = document.getElementById("container");
								var myChart = echarts.init(dom);
								var app = {};
								option = null;
								app.title = '环形图';
								
								option = {
								    tooltip: {
								        trigger: 'item',
								        formatter: "{a} <br/>{b}: {c} ({d}%)"
								    },
								    legend: {
								        orient: 'vertical',
								        x: 'left',
								        data: ['男', '女', '未知']
								    },
								    series: [
								        {
								            name: '男女比例',
								            type: 'pie',
								            radius: ['50%', '70%'],
								            avoidLabelOverlap: false,
								            label: {
								                normal: {
								                    show: false,
								                    position: 'center'
								                },
								                emphasis: {
								                    show: true,
								                    textStyle: {
								                        fontSize: '15',
								                        fontWeight: 'bold'
								                    }
								                }
								            },
								            labelLine: {
								                normal: {
								                    show: false
								                }
								            },
								            data: userbili
								        }
								    ]
								};
								;
								if (option && typeof option === "object") {
								    myChart.setOption(option, true);
								}
							}
						});
					}
                }
            });

            

    /* function blogli() {
        $.get('/bl', {}, function (data) {
            var arrs = data;
            var app1 = new Vue({
                el: '#blogM',
                data: {
                    titles: arrs
                }
            });
            $(".blog_title").click(function () {
                var num = $(this).next().children().find(".artid").text();
                $("#blogpanel").show(200);
                for(var i=0;i<data.length;i++){
                    if(data[i].id==num){
                        $(".article").text(data[i].article.blog);
                    }
                };
                $(".num").text(num );
            });
            $(".close_blog_panel").click(function () {
                $(".article").text('');
                $("#blogpanel").hide(200);
            });
            $(".delete_all").click(function () {
                $(".article").text("");
            });
            $(".dos").click(function () {
                var num = $(".num").text();
                num = Number(num);
                $.get("/delete_blog", {
                    id: num
                }, function (data) {
                    if (data == "no") {
                        showprompt("删除失败")
                    }
                    if (data[0].msg == "删除成功") {
                        //$("#content_blog").children('li').eq(num - 1).hide(200);
                        var lis=$("#content_blog").children('li');

                        for(var i=0;i<lis.length;i++){
                            var ids=lis.eq(i).children('div').children().find(".artid").text();
                            console.log(ids);
                            if(ids==num){
                                $("#content_blog").children('li').eq(i).hide(200);
                            }
                        };
                        $("#blogpanel").hide(200);
                        showprompt(data[0].msg);
                    }
                });
            });
            $(".sure_chginfo").click(function () {
                var num = $(".num").text();
                var blogs = $(".article").text();
                console.log(blogs);
                $.get("/chgblogs", {
                    id: num,
                    blog: blogs
                }, function (data) {
                    if (data == "no") {
                        showprompt("修改失败！")
                    }
                    if (data == "ok") {
                        arrs[num - 1]['article']['blog'] = blogs;
                        showprompt("修改成功！");
                    }
                });
            });
        });
    }

    blogli(); */


    var winheight = $(window).height();
    $("#nav").css({
        width: '14%',
        height: winheight
    });
    $('#content').css({
        width: '86%',
        height: winheight
    });
    $('#main_con').css({
        height: winheight - 40
    });
    $("#main_footer").css({
        height: $("#main_con").height() - 550
    });

    $("#header_btn").click(function () {
        var nav = $("#nav");
        var content = $("#content");
        if (nav.is(':hidden')) {
            nav.show();
            nav.animate({
                width: '14%'
            }, {queue: false, duration: 300});
            content.animate({
                width: '86%'
            }, 300);
        } else {
            nav.animate({
                width: '0%',
                backgroundColor: "#00a0df"
            }, 300, function () {
                nav.hide();
            });
            content.animate({
                width: '100%'
            }, {queue: false, duration: 300});
        }
    });


    $(".nav_btn").click(function () {
        var order = $(this).parent().index();
        $("#main_panel").children("div").eq(order + 1).fadeIn(500).siblings().css({
            display: "none"
        });
    });

    $('#loginout').click(function () {
        $.get("/exit", {
            role: "admin"
        }, function (data) {
            if (data == "ok") {
                window.location.href = "/adlogin";
            } else {
                showprompt("退出出错，请手动清空浏览器cookie")
            }
        });
    });

    function showprompt(text) {
        $('#prompt').text(text).stop().fadeIn(500);
        var timer1 = setTimeout(function () {
            $('#prompt').stop().fadeOut(1000);
            clearTimeout(timer1);
        }, 1500);
    }


    function chart() {
        /* $.ajax({
         method:"GET",
         url:"/webData",
         dataType:"json",
         success:function(data){


         }
         });*/
       
    }

    chart();

    function chart1() {
        var dom = document.getElementById("container1");
        var myChart = echarts.init(dom);
        var app = {};
        option = null;
        option = {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line'
            }]
        };
        ;
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
    }

    chart1();

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
});
