/**
 * Created by asus on 2019/4/12.
 */
const formidable = require('formidable');
let util = require("util");
let fs = require("fs");
let path = require("path");
var COS = require('cos-nodejs-sdk-v5');
exports.uploadfile=function(req,res){
    const form = new formidable.IncomingForm();
    form.uploadDir ='./data/user/img';//上传文件的保存路径
    form.keepExtensions = true;//保存扩展名
    form.maxFieldsSize = 20 * 1024 * 1024;//上传文件的最大大小
    form.on('progress', function(bytesReceived, bytesExpected) {
        console.log("上传到服务器进度："+Math.round((bytesReceived/bytesExpected)*100)+"%")
    });

    form.parse(req, function(err, fields, files) {
       if(err){
           res.status(400).send({
               "errno": 1,
               "data": [
               ]
           });
       }else {

           var keys1 = [];  //文件原名称存放
           for (var p1 in files) {   //获取所有文件名，并存放进keys1
               if (files.hasOwnProperty(p1))
                   keys1.push(p1);
           }
           let newimgpath=[];
           for(var x=0;x<keys1.length;x++){
               var newname=Date.parse(new Date())+"blogimg"+x;
               let extname = path.extname(files[keys1[x]].name);
               let oldpath='./'+files[keys1[x]].path;
               let newpath='./data/user/img/'+newname+extname;
               newimgpath.push(newname+extname);
                fs.rename(oldpath,newpath,function(err){
                    if(err){
                        console.log("图片"+oldpath+"改名失败！")
                    }
                });
               if(x==keys1.length-1){
                    setTimeout(function(){
                        uploadBlogimg(newimgpath,function (data) {
                            res.status(200).send(data);
                        });
                    },2000)
               }
           }
       }
    });
};

function uploadBlogimg(arr,callback){
    let newimgpath=arr;
    let successImgUrl=[];
    for(let i=0;i<newimgpath.length;i++){
        successImgUrl.push("https://wupopo-1256296697.cos.ap-chengdu.myqcloud.com/blog/img/"+newimgpath[i]);
    }

    for(let i=0;i<newimgpath.length;i++){
        var SecretId = 'AKIDhAPO8ZAS2NTKwIqRDm9H9m9JH0Ui7TzG'; // 替换为用户的 SecretId
        var SecretKey = 'EH5dvymKdjnbAUYMuCKI1YqysXxBD0Xp';    // 替换为用户的 SecretKey
        var Bucket = 'wupopo-1256296697';                        // 替换为用户操作的 Bucket
        var Region = 'ap-chengdu';

        var cos = new COS({SecretId: SecretId, SecretKey: SecretKey});

        cos.putObject({
            Bucket: Bucket,
            Region: Region,
            Key: 'blog/img/'+newimgpath[i],
            Body: fs.readFileSync(path.resolve('./data/user/img', newimgpath[i]))
        }, function (err, data) {
            if(err){
                console.log(err);
                successImgUrl.push("https://wupopo-1256296697.cos.ap-chengdu.myqcloud.com/blog/img/demoimg.jpg");
            }else {
                console.log("上传成功");
                fs.unlink('./data/user/img/'+newimgpath[i],function(err,data){
                    if(err){
                        console.log(err);
                    }else {
                        console.log("服务器暂存文件"+newimgpath[i]+"删除成功");
                    }
                    successImgUrl.push();
                })
            }
        });
        if(i==newimgpath.length-1){
            console.log(successImgUrl);
           setTimeout(function(){
               callback({
                   "errno": 0,
                   "data":successImgUrl
               });
           },1000)
        }
    }
}
exports.uploadQCimfile=uploadBlogimg;
/*function upQcloudblogimg(key){
    var SecretId = 'AKIDhAPO8ZAS2NTKwIqRDm9H9m9JH0Ui7TzG'; // 替换为用户的 SecretId
    var SecretKey = 'EH5dvymKdjnbAUYMuCKI1YqysXxBD0Xp';    // 替换为用户的 SecretKey
    var Bucket = 'wupopo-1256296697';                        // 替换为用户操作的 Bucket
    var Region = 'ap-chengdu';

    var cos = new COS({SecretId: SecretId, SecretKey: SecretKey});

    cos.putObject({
        Bucket: Bucket,
        Region: Region,
        Key: 'blog/img/'+key,
        Body: fs.readFileSync(path.resolve('./data/user/img', key))
    }, function (err, data) {
        if(err){
            console.log(err);
        }else {
            console.log("上传成功")
        }
    });

}*/