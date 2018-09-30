/**
 * Created by mavis on 2017/6/9.
 */

//生产用卡
var groupIp = "http://jbb.gemii.cc/";
var wxIp = "http://wx.gemii.cc/";
var userInfo="https://mp.weixin.qq.com/bizmall/activatemembercard?action=preshow&&encrypt_card_id=2oJgfdaA2uXwkZio%2B3PSOokjXI20sUsa2z9XN9HqRlAxdlrJ01v3mRH%2BBNclhB3E&outer_str=123&biz=MjM5NTUzNDk0MA%3D%3D#wechat_redirect";//提交之后跳转的会员中心页面
var sassAuthUrl ='https://cloud.gemii.cc'

var dataModel= {
    url: {
        getCodeUrl: groupIp + "HelperManage/enter/lovebaby/match", //获取二维码地址和验证码的接口
        isRobotid: groupIp + "HelperManage/enter/select/robotUrl",//判断是否已经进入过此页面的接口
        getPhoneUrl: wxIp + "wx/getWeChatCardForAiYinIsLand",  //获取手机号和用户名
        getHospital: groupIp + "HelperManage/enter/select/hospitalName",  //通过编码获取医院名称
        inviteCodeIsShow: groupIp + 'HelperManage/cfg/result', //是否显示邀请码输入框
        getCodefCenterUrl:sassAuthUrl+'/lizcloud/api/h5/noauth/h5/joingroup/simple'
    },
}
