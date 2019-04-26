/**
 * Created by asus on 2018/12/6.
 */
var fs=require('fs');
exports.savedata=function(path_name,results,callback){
    fs.writeFile(path_name,results,function(err){
        if (err){
            console.log(err);
            callback(-1);
            return;
        }
        callback();
    });
};
exports.readdata=function(path_name,callback){
    fs.readFile(path_name,function(err,data){
        if(err){
            callback(-1);
            return;
        }
        callback(data);
    });
};



/*exports.readOp=function(callback){
    fs.readFile('./data/admin/opLog.json',function(err,data){
        if(err){
            callback(err+"操作日志记录失败！读取日志出错");
            return;
        }
        callback(data);
    });
};*/

/*exports.saveOp=function(results,callback){
    fs.writeFile('./data/admin/opLog.json',results,function(err){
        if (err){
            callback(err+"写入日志出错");
            return;
        }
        callback();
    });
};*/
exports.storeOp=function(result){
    fs.readFile('./data/admin/opLog.json',function(err,datalog){
        if(err){
            console.log(err+"操作日志记录失败！读取日志出错");
            return;
        }
        var arr = JSON.parse(datalog.toString());
        arr.splice(0, 0, result);
        var newResult = JSON.stringify(arr);

        fs.writeFile('./data/admin/opLog.json',newResult,function(err){
            if (err){
               console.log(err+"操作日志记录失败！写入日志出错");
                return;
            }
        });
    });
};

/*exports.savecomm=function(results,name,callback){
	fs.writeFile('./data/comments/'+name+'.json',results,function(err){
		if (err){
			callback(-1);
			return;
		}
	callback();
	});
}*/
exports.deletecoms=function(name){
    fs.unlink('./data/comments/'+name+'.json',function(err){
        if(err){
            console.log(err);
        }
    });
};
/*
exports.readcomm=function(name,callback){
    fs.readFile('./data/comments/'+name+'.json',function(err,data){
        if(err){
            callback(-1);
            return;
        }
        callback(data);
    });
};*/
