/**
 * Created by asus on 2019/4/9.
 */
var bodyParser = require('body-parser');
var STS = require('qcloud-cos-sts');
module.exports= (app)=>{
    var config = {
        secretId: 'AKIDhAPO8ZAS2NTKwIqRDm9H9m9JH0Ui7TzG',
        secretKey: 'EH5dvymKdjnbAUYMuCKI1YqysXxBD0Xp',
        proxy: '',
        durationSeconds: 1800,
        bucket: 'wupopo-1256296697',
        region: 'ap-chengdu',
        allowPrefix: 'blog/img/',
        // 密钥的权限列表
        allowActions: [
            // 所有 action 请看文档 https://cloud.tencent.com/document/product/436/31923
            // 简单上传
            'name/cos:PutObject',
            'name/cos:PostObject',
            // 分片上传
            'name/cos:InitiateMultipartUpload',
            'name/cos:ListMultipartUploads',
            'name/cos:ListParts',
            'name/cos:UploadPart',
            'name/cos:CompleteMultipartUpload'
        ]
    };

    app.use(bodyParser.json());

    // 支持跨域访问
  /*  app.all('*', function (req, res, next) {
        res.header('Content-Type', 'application/json');
        res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:88');
        res.header('Access-Control-Allow-Headers', 'origin,accept,content-type');
        if (req.method.toUpperCase() === 'OPTIONS') {
            res.end();
        } else {
            next();
        }
    });*/

    app.all('/sts', function (req, res, next) {

        // TODO 这里根据自己业务需要做好放行判断
        if (config.allowPrefix === '_ALLOW_DIR_/*') {
            res.send({error: '请修改 allowPrefix 配置项，指定允许上传的路径前缀'});
            return;
        }

        // 获取临时密钥
        var LongBucketName = config.bucket;
        var ShortBucketName = LongBucketName.substr(0, LongBucketName.indexOf('-'));
        var AppId = LongBucketName.substr(LongBucketName.indexOf('-') + 1);
        var policy = {
            'version': '2.0',
            'statement': [{
                'action': config.allowActions,
                'effect': 'allow',
                'resource': [
                    'qcs::cos:ap-chengdu:uid/1256296697:wupopo-1256296697/*'
                   /* 'qcs::cos:ap-guangzhou:uid/' + AppId + ':prefix//' + AppId + '/' + ShortBucketName + '/' + config.allowPrefix,*/
                ],
            }],
        };
        var startTime = Math.round(Date.now() / 1000);
        STS.getCredential({
            secretId: config.secretId,
            secretKey: config.secretKey,
            proxy: config.proxy,
            durationSeconds: config.durationSeconds,
            policy: policy,
        }, function (err, tempKeys) {
            var result = JSON.stringify(err || tempKeys) || '';
            res.send(result);
        });
    });

};
