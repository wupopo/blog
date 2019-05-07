const request=require('request');

exports.baiduMap = (ip, callback) => {
    request.get('http://api.map.baidu.com/location/ip?ip='+ip+'&ak=gcIj8W18GVW7HMPqGoIo7adaRQR7izde&coor=bd09ll',function (err,response,body) {
        if(err){
            console.log(err);
        }else {
            callback(body);
        }
    });

};