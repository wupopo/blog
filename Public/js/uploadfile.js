/**
 * Created by asus on 2019/4/9.
 */
(function () {
    // 请求用到的参数
    var Bucket = 'wupopo-1256296697';
    var Region = 'ap-chengdu';
    var protocol = location.protocol === 'https:' ? 'https:' : 'http:';
    var prefix = protocol + '//' + Bucket + '.cos.' + Region + '.myqcloud.com/';
    // 对更多字符编码的 url encode 格式
    var camSafeUrlEncode = function (str) {
        return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A');
    };

    // 计算签名
    var getAuthorization = function (options, callback) {
        // var url = 'http://127.0.0.1:3000/sts-auth' +
        var url = '/sts';
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function (e) {
            var credentials;
            try {
                credentials = (new Function('return ' + xhr.responseText))().credentials;
            } catch (e) {}
            if (credentials) {
                callback(null, {
                    XCosSecurityToken: credentials.sessionToken,
                    Authorization: CosAuth({
                        SecretId: credentials.tmpSecretId,
                        SecretKey: credentials.tmpSecretKey,
                        Method: options.Method,
                        Pathname: options.Pathname,
                    })
                });
            } else {
                console.error(xhr.responseText);
                callback('获取签名出错');
            }
        };
        xhr.onerror = function (e) {
            callback('获取签名出错');
        };
        xhr.send();
    };

    // 上传文件
    var uploadFile = function (file, callback) {
        var Key = 'blog/img/' + file.name; // 这里指定上传目录和文件名
        getAuthorization({Method: 'PUT', Pathname: '/' + Key}, function (err, info) {

            if (err) {
                console.log(err);
                return;
            }

            var auth = info.Authorization;
            var XCosSecurityToken = info.XCosSecurityToken;
            var url = prefix + camSafeUrlEncode(Key).replace(/%2F/, '/');
            var xhr = new XMLHttpRequest();
            xhr.open('PUT', url, true);
            xhr.setRequestHeader('Authorization', auth);
            XCosSecurityToken && xhr.setRequestHeader('x-cos-security-token', XCosSecurityToken);
            xhr.upload.onprogress = function (e) {
                   $('.scjd').text((Math.round(e.loaded / e.total * 10000) / 100)+"%");
            };
            xhr.onload = function () {
                if (xhr.status === 200 || xhr.status === 206) {
                    var ETag = xhr.getResponseHeader('etag');
                    callback(null, {url: url, ETag: ETag});
                } else {
                    callback('文件 ' + Key + ' 上传失败，状态码：' + xhr.status);
                }
            };
            xhr.onerror = function () {
                callback('文件 ' + Key + ' 上传失败，请检查是否没配置 CORS 跨域规则');
            };
            xhr.send(file);
        });
    };

    // 监听表单提交
    document.getElementById('imgbtn').onclick = function (e) {
        $('.sctip').show();
        var file = document.getElementById('file').files[0];
        var filename=file.name;
       var filetype= filename.substring(filename.indexOf(".")+1);
        var types={
            jpg:"image/jpeg",
            png:"image/png"
        };
        var newfile = new File([file], new Date().getTime()+"userimg"+"."+filetype,{type:types[filetype]});
        if (!file) {
            tip( '未选择上传文件');
            return;
        }
        newfile && uploadFile(newfile, function (err, data) {
            console.log(err || data);
            $.ajax({
                type:'GET',
                url:"/setuserimg",
                data:{
                    imgname:newfile.name
                },
                error:function(err){
                    tip('头像设置失败！')
                },
                success:function(data){
                    tip('头像设置成功');
                 window.location.href= window.location.href;
                }
            });
        });
    };
})();
function tip(str){   //tips
    $(".tips").show().text(str);
    setTimeout(function(){
        $(".tips").hide();
    },2000);

}