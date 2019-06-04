$(function () {
    function video(url,id) {   //视频组件设置
     var player = new Aliplayer({
            id: id,
            autoplay: false,
            width: '50%',
            //支持播放地址播放,此播放优先级最高
            source : url,
            },function(player){
                console.log('播放器创建好了。')
           });
}

    function getVloglist(start) {
        $.ajax({
            type:"post",
            url:"getVlog",
            data:{
                start:start
            },
            error:function (err) {
                console.log(err);
            },
            success:function (data) {
               let vlogArr=data.data;
               console.log(vlogArr);
             for(let i=0;i<vlogArr.length;i++){
                    $("#vlogs").append( `
                      <div class="vlogPanel">
                       <a href="../Vlog/`+vlogArr[i].id+`">
                           <div class="vlogTime">`+vlogArr[i].time+`</div>
                            <div class="vlogtitle">`+vlogArr[i].title+`</div>
                           <div class="vlogContent">
                               <img class="vlogImg" src='`+vlogArr[i].img+`'>
                               `+vlogArr[i].content+`
                           </div>
                       </a>
                   </div>
                    `)
               }
            }
        });
    }

    getVloglist(0);
});