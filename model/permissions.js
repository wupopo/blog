exports.userPer = {
    needUsernameTrue: function (req, username,callback) {
        if (!req.session.userinfo) {
            callback(false)
        } else if (req.session.userinfo.username !== username) {
            callback(false);
        } else if (req.session.userinfo.username == username) {
            callback(true);
        }
    },
    needLoginTrue: function (req,callback) {
        if (!req.session.userinfo) {
            callback(false)
        } else {
            callback(true)
        }
    },
    needOriginTrue: function (req,callback) {
        if (req.headers.host !== '127.0.0.1:3000' && req.headers.host !== 'www.wupopo.club') {
            callback(false)
        } else {
            callback(true);
        }
    }
};

exports.adminPer = {
    needLoginTrue: function (req,callback) {
        if (!req.session.admininfo) {
            callback(false)
        } else {
            callback(true)
        }
    },
    needOriginTrue: function (req,callback) {
        if (req.headers.host !== '127.0.0.1:3000' && req.headers.host !== 'www.wupopo.club') {
            callback(false)
        } else {
            callback(true);
        }
    }
};