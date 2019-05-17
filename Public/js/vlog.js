$(function () {
    function video(url,id) {   //视频组件设置
     var player = new Aliplayer({
            id: id,
            autoplay: false,
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
               for(let i=0;i<vlogArr.length;i++){
                    $("#vlogPanel").append( `
                         <div class="row">
                        <div class="col-md-2">
                            45
                        </div>
                        <div class="col-md-6" >
                            <div class="videop" id="vlogmain`+vlogArr[i].title+`"></div>
                        </div>
                        <div class="col-md-4">
                            78
                        </div>
                    </div>
                    `)
                   video(vlogArr[i].address,"vlogmain"+vlogArr[i].title);
               }
            }
        });
    }

    getVloglist(0);
});