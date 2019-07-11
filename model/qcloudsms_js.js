var QcloudSms = require("qcloudsms_js");

var appid = 1400171683;  // SDK AppID是1400开头

// 短信应用SDK AppKey
var appkey = "4b9ef1bae2113da5afc349370578d787";
var templateId =248338;
var smsSign = "吴博技术记录";
var qcloudsms = QcloudSms(appid, appkey);
exports.sendVC=function(phone,callback){
	//随机数生成
	function randomNum(minNum,maxNum){ 
	    switch(arguments.length){ 
	        case 1: 
	            return parseInt(Math.random()*minNum+1,10); 
	        break; 
	        case 2: 
	            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
	        break; 
	            default: 
	                return 0; 
	            break; 
	    } 
	} 
	var VC=randomNum(1000,9999); //随机验证码
	VCode=VC;
	var ssender = qcloudsms.SmsSingleSender();
	var params = [VC,"2"];
	callback({code:200,data:[1234],msg:"success"});
	return;
	ssender.sendWithParam(86, phone,templateId,params,smsSign,"","", function(err, ress, resData){
		if(err){
			callback(false)
			console.log({code:500,data:[],msg:"error"});
			return;
		}
		callback({code:200,data:[VC],msg:"success"});
	});
};