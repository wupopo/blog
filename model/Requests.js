const request = require('request');

exports.baiduMap = (ip, callback) => {
    request({
        timeout: 5000,    // 设置超时
        method: 'GET',    //请求方式
        url: 'http://api.map.baidu.com/location/ip', //url
        json: true,
        qs: {                                                  //参数，注意get和post的参数设置不一样
            ip: ip,
            ak: "gcIj8W18GVW7HMPqGoIo7adaRQR7izde",
            coor: "bd09ll"
        }

    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
            callback(JSON.stringify(body));
        } else {
            console.log("error");
        }
    });
};