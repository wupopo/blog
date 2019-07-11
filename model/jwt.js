const jwt=require('jsonwebtoken');
let SECRET='Ejhdsfbghkshfjbsfjsndckshuhg';
let JWT= class{
    constructor(data){
        this.data=data;
    }

    createJWT() {
        let obj;
        if(this.data.oldobj){
            let oldobj=this.data.oldobj;
            obj=Object.assign(oldobj,this.data.needobj);
        }else{
            obj=this.data.needobj;
        }
        let token=jwt.sign(obj,SECRET,{expiresIn:this.data.timelong});
        return token;
    }

    getJWT(){
        let token=this.data.token;
        let obj;
        try{
            obj=jwt.verify(token,SECRET);
            delete obj.iat;
            delete obj.exp;
        }catch(err){
            obj={};
        }
        return obj;
    }
}
module.exports=JWT;