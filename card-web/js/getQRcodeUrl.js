/**
 * Created by mavis on 2017/5/26.
 */
var getQRcodeFunction={
    init:function () {    //页面在初始化时获取数据，获取img图片的地址
        document.getElementById("QR-view").style.height=document.documentElement.clientHeight+"px";
        this.ISrobotid();
    },
    ISrobotid:function(){
        var codeUrl=dataModel.url.qrCodeUrl;
        var robotId,Phone;
        if(getQueryString('robotId') != undefined) {
            robotId = getQueryString("robotId");
            Phone = getQueryString("phone");
            if (robotId != undefined && robotId != "" && robotId != null && Phone != undefined && Phone != "" && Phone != null) {
                var imgUrl = codeUrl + robotId + ".jpg";
                var img = new Image();
                img.src = imgUrl;
                img.onload = function () {
                    $(".QR-box").html(img)
                    $("#validateCode").text(Phone.slice(7));
                    $(".main").css("display", 'block');
                    $(".loadingView").fadeOut();
                }
            } else {
                this.getQRcodeUrl();//获取activate_ticket--通过activate_ticket调取接口获取phone--成功之后获取cookie值--然后获取robotid
            }
        }else{
            robotId = getQueryString("qr_url");
            Phone = getQueryString("verify_code");
            if (robotId != undefined && robotId != "" && robotId != null && Phone != undefined && Phone != "" && Phone != null) {
                var imgUrl = robotId;
                var img = new Image();
                img.src = imgUrl;
                img.onload = function () {
                    $(".QR-box").html(img)
                    $("#validateCode").text(Phone);
                    $(".main").css("display", 'block');
                    $(".loadingView").fadeOut();
                }
            } else {
                this.getQRcodeUrl();//获取activate_ticket--通过activate_ticket调取接口获取phone--成功之后获取cookie值--然后获取robotid
            }
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
        var url=dataModel.url.getPhoneUrl; // 获取phone的接口地址
        $.ajax({
            url:url,
            type:"post",
            dataType: 'json',
            data:{"activate_ticket":ticket},//此处传给后台的数据格式"字符串"
            timeout:10000,
            success:function (res) {
                // alert("通过activate_ticket调取接口获取phone："+JSON.stringify(res))
                if(res.status==200){
                    var phone=res.data.phone;
                    if(!/^1[0-9]{10}$/.test(phone)){
                        window.location.href="sorry.html";
                    }else{
                        //3、获取各个值存入到sendData中（json格式）
                        var sendData = new Object();
                        sendData.phone = phone;//(1)成功之后获取电话
                        // 获取cookie值/*(2) cookie值：type,p,city，host,edc*/
                        var cookie=this.getCookie();
                        // alert(JSON.stringify(cookie))
                        for(var i in cookie){ sendData[i] = cookie[i];}
                        var openid=getQueryString('openid');//(3)获取地址拦中的openId
                        if(openid!=""||openid!=null||openid!=undefined){ sendData.openid = openid; } else { window.location.href = "sorry.html"; }
                        //4、传参给接口，通过获取robotid值，拼接二维码图片地址
                        this.postRobotId(sendData); //获取robotid值
                    }
                }
            }.bind(this),
            error:function(){
                window.location.href='loadSorry.html';
                $(".loadingView").fadeOut();
            }
        })
    },
    postRobotId:function (sendData) {
        // alert(JSON.stringify(sendData))
        var url=dataModel.url.getRobotIdUrl;
        var codeUrl=dataModel.url.qrCodeUrl;
        $.ajax({
            url:url,
            type:"post",
            dataType: 'json',
            async:true,      // 异步请求
            timeout:10000,
            data:{
                "openid":sendData.openid,
                "type":sendData.type,
                "edc":sendData.edc,
                "phone":sendData.phone,
                "province":sendData.province,
                "city":sendData.city,
                "hospital":sendData.hospital,
                "name":sendData.name
            },
            success:function (res) {
                // alert(JSON.stringify(res));
                if(res.status==200){
                    var imgUrl = codeUrl+eval(res.data)+".jpg";
                    var img = new Image();
                    img.src = imgUrl;
                    img.onload = function () {
                        $(".QR-box").html(img)
                        $("#validateCode").text(sendData.phone.slice(7));
                        $(".main").css("display",'block');
                        $(".loadingView").fadeOut();
                    }
                }else if(res.status==201){
                    var imgUrl = res.data.robotQr;
                    var img = new Image();
                    img.src = imgUrl;
                    img.onload = function () {
                        $(".QR-box").html(img)
                        $("#validateCode").text(res.data.code);
                        $(".main").css("display",'block');
                        $(".loadingView").fadeOut();
                    }
                    $('#codeMsg').text('发送下方验证码');
                }else if(res.status == -1 || res.status == -2 ){ //-1:未匹配到群 -2：未匹配到机器人(小助手)
                    window.location.href="sorry2.html";
                }else if(res.status ==2){
                    window.location.href="againRepeat.html";
                }else{
                    window.location.href="sorry.html";
                }
            },
            error:function(){
                window.location.href='loadSorry.html';
                $(".loadingView").fadeOut();
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
