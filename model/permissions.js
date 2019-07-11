exports.userPer = {
    needUsernameTrue: function (req, username,callback) {
        if (!req.userinfo.username) {
            callback(false)
        } else if (req.userinfo.username !== username) {
            callback(false);
        } else if (req.userinfo.username == username) {
            callback(true);
        }
    },
    needLoginTrue: function (req,callback) {
        if (!req.userinfo.username) {
            callback(false)
        } else {
            callback(true)
        }
    },
    needOriginTrue: function (req,callback) {
        if (req.headers.host !== '127.0.0.1:3000' && req.headers.host !== 'wupopo.club') {
            callback(false)
        } else {
            callback(true);
        }
    }
};

exports.adminPer = {
    needLoginTrue: function (req,callback) {
        if (!req.admininfo.username) {
            callback(false)
        } else {
            callback(true)
        }
    },
    needOriginTrue: function (req,callback) {
        if (req.headers.host !== '127.0.0.1:3000' && req.headers.host !== 'wupopo.club') {
            callback(false)
        } else {
            callback(true);
        }
    }
};