/**
 * Created by mavis on 5/8/17.
 */
/*===========test mt测试环境（新的公众号）============*/
var wxIp = 'http://social.gemii.cc/wechat/'
var groupIp = "http://mt.gemii.cc/";
var userInfo = 'https://mp.weixin.qq.com/bizmall/activatemembercard?action=preshow&&encrypt_card_id=2pCEg2%2Flc5suLc8MbTFWa9sTHP0BQl8DmcxpQ67Q6RW5r2orPC9FpXpPTQOxXrP5&outer_str=123&biz=MzU1ODEzOTIzMg%3D%3D#wechat_redirect'
var qrCodeUrl="http://nfs.gemii.cc/accounts/qrcode/";

var dataModel ={
    url:{
        //card
        userInfo: wxIp+"wx/userinfo/getUserInfo",                   //通过code获取opendid
        isRobotid:groupIp+"HelperManage/enter/select/robotid",      //判断是否已经进入过此页面的接口
        savepoint:groupIp+'HelperManage/savepoint',
        
        //QRcode
        getPhoneUrl:wxIp+"wx/getWeChatCardForHuishi",               //获取phone的接口地址
        getRobotIdUrl:groupIp+"HelperManage/enter/receive/match",   //获取二维码图片地址的接口
        qrCodeUrl:qrCodeUrl,                                        //生成二维码的最开始的拼接内容
    },
}

/*===========fengmii2 c11环境：新的公众号===========*/
/*
 var wxIp = 'http://social.gemii.cc/wechat/' ;
 var groupIp = "http://www.fengmii.cc/c11/";
 var userInfo = 'https://mp.weixin.qq.com/bizmall/activatemembercard?action=preshow&&encrypt_card_id=2pCEg2%2Flc5suLc8MbTFWa8JiGe%2BN3LRCfSIzJZDv1Ye%2FUIc3KYooCfsEZyXF5Q1s&outer_str=123&biz=MzU1ODEzOTIzMg%3D%3D#wechat_redirect';
  var qrCodeUrl="http://nfs.gemii.cc/accounts/qrcode/";

 var dataModel ={
     url:{
         //card
         userInfo: wxIp+"wx/userinfo/getUserInfo",                   //通过code获取opendid
         isRobotid:groupIp+"HelperManage/enter/select/robotid",      //判断是否已经进入过此页面的接口 

         //QRcode
         getPhoneUrl:wxIp+"wx/getWeChatCardForHuishi",                //获取phone的接口地址
         getRobotIdUrl:groupIp+"HelperManage/enter/receive/match",    //获取二维码图片地址的接口
         qrCodeUrl:qrCodeUrl,                                        //生成二维码的最开始的拼接内容
     }
 }
 */

/*===========fengmii1 c1环境：老的公众号===========*/
/*
var wxIp = "http://wx.gemii.cc/";
 var groupIp = "http://www.fengmii.cc/c1/"; 
var userInfo = 'https://mp.weixin.qq.com/bizmall/activatemembercard?action=preshow&&encrypt_card_id=zdx9C0H2tZ0Hld8sctHOcU8TC3Akzo50%2Fp6%2BLcU4hqKdkM2Zl8ahYloXguGXxTTm&outer_str=123&biz=MzIwNzUyNjE5Ng%3D%3D#wechat_redirect'; 
var qrCodeUrl="http://nfs.gemii.cc/accounts/qrcode/";


var dataModel ={
    url:{
        //card
        userInfo: wxIp+"wx/base/getUserInfo",                       //通过code获取opendid
        isRobotid:groupIp+"HelperManage/enter/select/robotid",      //判断是否已经进入过此页面的接口 

        //QRcode
        getPhoneUrl:wxIp+"wx/getWeChatCard",                         //获取phone的接口地址
        getRobotIdUrl:groupIp+"HelperManage/enter/receive/match",    //获取二维码图片地址的接口
        qrCodeUrl:qrCodeUrl,                                        //生成二维码的最开始的拼接内容
    }
}
 */

