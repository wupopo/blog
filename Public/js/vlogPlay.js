$(function(){
    function video(url,id) {   //视频组件设置
        $("#vlogpaly").css({
            width:"99%",
            height:$('#vlogpaly').width()*0.58,
        })
        var player = new Aliplayer({
               id: id,
               autoplay: false,
               width: '100%',
               //支持播放地址播放,此播放优先级最高
               source : url,
               },function(player){
                   console.log('播放器创建好了。')
              });
   }

   let url=$('.url').text();
   console.log(url)
   video(url,'vlogpaly')
})