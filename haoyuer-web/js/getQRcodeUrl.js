/**
 * Created by mavis on 2017/5/26.
 */
var getQRcodeFunction={
    init:function () {    //页面在初始化时获取数据，获取img图片的地址
        document.getElementById("QR-view").style.height=document.documentElement.clientHeight+"px";
        this.ISrobotid();
    },
    url: {
        getPhoneUrl: wxIp + "wx/getWeChatCard",
        getRobotIdUrl: groupIp + "HelperManage/enter/goodparent/match",
        qrCodeUrl: qrCodeUrl
    },
    ISrobotid:function(){
        var codeUrl=this.url.qrCodeUrl;
        var robotId=getQueryString("robotId");
        if(robotId!=undefined && robotId!="" && robotId!=null){
            $(".QR-codeIMG").attr("src",codeUrl+robotId+".jpg");
        }else{
            this.getQRcodeUrl();//获取activate_ticket--通过activate_ticket调取接口获取phone--成功之后获取cookie值--然后获取robotid
        }
    },
    //1、获取activate_ticket值
    getQRcodeUrl:function () {
        var activate_ticket=getQueryString('activate_ticket'); //获取地址拦中的activate_ticket值
        if(activate_ticket!=""||activate_ticket!=null||activate_ticket!=undefined){
            this.postPhone(activate_ticket);  //通过activate_ticket调取接口获取phone
        }else{
            window.location.href="sorry.html";
        }
    },
    //2、通过activate_ticket调取接口获取phone
    postPhone:function (ticket) {
        var url=this.url.getPhoneUrl; // 获取phone的接口地址
        $.ajax({
            url:url,
            type:"post",
            dataType: 'json',
            data:{"activate_ticket":ticket},//此处传给后台的数据格式"字符串"
            success:function (res) {
                // console.log(JSON.stringify(res));
                var phone=res.data.phone;
                var username=res.data.username; //用户昵称
                if(!/^1[0-9]{10}$/.test(phone)||username==""){
                    window.location.href="sorry.html";
                }else{
                    //3、获取各个值存入到sendData中（json格式）
                    var sendData = new Object();
                    sendData.phone = phone;//(1)成功之后获取电话
                    // 获取cookie值
                    var cookie=this.getCookie();
                    for(var i in cookie){
                        sendData[i]=cookie[i];  //(2) cookie值：p,city，host,edc
                    }
                    sendData.openid=getQueryString('openid');//(3)获取地址拦中的openId
                    sendData.username=username;  //用户昵称
                    //4、传参给接口，通过获取robotid值，拼接二维码图片地址
                    this.postRobotId(sendData); //获取robotid值
                }
            }.bind(this)
        })
    },
    postRobotId:function (sendData) {
        var url=this.url.getRobotIdUrl;
        var codeUrl=this.url.qrCodeUrl;;
        $.ajax({
            url:url,
            type:"post",
            dataType: 'json',
            async:true,      // 异步请求
            data:{
                "openid":sendData.openid,
                "edc":sendData.edc,
                "phone":sendData.phone,
                "province":sendData.province,
                "city":sendData.city,
                "hospital":sendData.hospital,
                "username":sendData.username
            },
            success:function (res) {
                if(res.status==200){
                    //成功之后获取robotid,拼接图片地址，赋值
                    $(".QR-codeIMG").attr("src",codeUrl+res.data+".jpg");
                }else if(res.status == -3){
                    window.location.href="sorry.html";
                }
            }
        })
    },
    getCookie:function () {
        var current;
        if(($.cookie("data"))!=undefined){
            current=JSON.parse($.cookie("data"));
        }
        return current;  //return返回current的值
    }
}