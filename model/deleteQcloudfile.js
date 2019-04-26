/**
 * Created by asus on 2019/4/12.
 */
var COS = require('cos-nodejs-sdk-v5');

var SecretId = 'AKIDhAPO8ZAS2NTKwIqRDm9H9m9JH0Ui7TzG'; // 替换为用户的 SecretId
var SecretKey = 'EH5dvymKdjnbAUYMuCKI1YqysXxBD0Xp';    // 替换为用户的 SecretKey
var Bucket = 'wupopo-1256296697';                        // 替换为用户操作的 Bucket
var Region = 'ap-chengdu';                           // 替换为用户操作的 Region

exports.deleteimgone=function(key,callback){
    var cos = new COS({SecretId: SecretId, SecretKey: SecretKey});
    cos.deleteObject({
        Bucket: Bucket,
        Region: Region,
        Key: key
    }, function (err, data) {
        if(err){
            callback('error');
        }else {
            callback("success");
        }
    });
};

exports.deleteimgs=function(arr,callback){
    var cos = new COS({SecretId: SecretId, SecretKey: SecretKey});
    cos.deleteMultipleObject({
        Bucket: Bucket,
        Region: Region,
        Objects: arr
    }, function (err, data) {
        if(err){
            callback('error');
        }else {
            callback("success");
        }
    });
};