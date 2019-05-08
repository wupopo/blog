const nodemailer = require('nodemailer');
let serveremail = {
    user:"wupopoclub@163.com",
    password:"wubo971010",
    service:'smtp.163.com'
};

exports.mail=function(obj,callback){
    nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: serveremail.service, // 邮件服务地址 可在126后台查看
        port: 465, // port
        secure: true, // true for 465, false for other ports
        auth: {
            user: serveremail.user, // generated ethereal user
            pass: serveremail.password // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: serveremail.user, // sender address
        to: obj.tofrom, // list of receivers 接收者地址
        subject:obj.title, // Subject line                      // 邮件标题
        text: 'this is nodemailer test', // plain text body
        html: obj.content // html body   //邮件内容
    };

    transporter.sendMail(mailOptions, (error, info) => { //发送邮件
        if (error) {
            callback(error);
            return;
        }
        console.log(info);//成功回调
        callback({
            info:info,
            reviewURL:nodemailer.getTestMessageUrl(info)
        });
    });
});
};
