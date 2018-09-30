/**
 * Created by mavis on 2017/6/4.
 */
var type=decodeURI(getQueryString("type"))!=""?decodeURI(getQueryString("type")):"1";
// var codeUrl="http://wx.gemii.cc/gemii/toPage.html?appid=wxc34006e5a93af3dd&scope=snsapi_base&state=&redirect_uri=http://wyeth.gemii.cc/gemii/card-web/?info=";
var codeUrl="http://social.gemii.cc/wechat/toPage.jsp?appid=wx2f7c5155a1152486&scope=snsapi_base&state=&redirect_uri=http://mt.gemii.cc/gemii/card-web/?info=";
var controller = {
    init: function () {
        document.getElementById("QR-view").style.height = document.documentElement.clientHeight + "px";
        this.handleModel();
        getDataFunction.getCity();         //1、调取城市接口
        input.readonlyIOS();
    },
    //选择城市 
    handleCityChange: function (cityName, province) {
        $(".QR-code").hide();
        $(".QR-header").hide();
        $('#qrcode').empty();
        $("#address").val('').removeAttr("data-city");
        $("input[id = " + "hospital" + "]").val("");
        $("input[id = " + "address" + "]").val(cityName).attr("data-city", province);
        if ($("input[id=hospital]").is(":hidden")) {
            var info = $("input[id=address]").attr("data-city") + "-" + $("input[id=address]").val() + '-医院';
            var QRcodeUrl = encodeURI(codeUrl + info + "-" + type);
            console.log(QRcodeUrl)
            this.urlchangeShort(QRcodeUrl);
        } else {
            getDataFunction.getHosorDrugByCity(cityName.trim());//2.点击确定时调取获取请求医院名称的接口 
        }
    },
    // 根据城市名称选择医院、药店 
    handleHospitalChange: function (hosName) {
        $("#hospital").val('');
        $("input[id = " + "hospital" + "]").val(hosName);
        var info = $("input[id=address]").attr("data-city") + "-"+$("input[id=address]").val()+'-' + $("input[id=hospital]").val();
        var QRcodeUrl=encodeURI(codeUrl+info+"-"+type);
        console.log(info);
        console.log(QRcodeUrl);
        this.urlchangeShort(QRcodeUrl);
    },
    //长链接生成短链接 
    urlchangeShort:function (url) {
        $.ajax({
            url:'http://s.gemii.cc/long2short',
            type:"post",
            dataType:"json",
            data:{ 'url': url, "type": 's'},
            success:function (data) {
                $('#qrcode').empty();
                console.log(data.short_url)
                this.makeQRCode(data.short_url); //生产二维码 
                $(".QR-code").show();
                $(".QR-header").show();
            }.bind(this)
        })
    },
    makeQRCode: function (QRcodeUrl) {
        var qrcode=$('#qrcode').qrcode({
            width: 313,
            height: 313,
            text: QRcodeUrl
        }).hide();
        var canvas=qrcode.find('canvas').get(0);
        $('#QRCodeImg').attr('src',canvas.toDataURL('image/jpg'))

    },
    handleModel: function () {
        if (type == 1 && type != "") {
            $("#hospital").attr("placeholder", "选择医院"); //type==1
        } else if (type == 3 && type != "") {
            $("#hospital").attr("placeholder", "选择药店");  //type==3
        }else if(type == 9 && type != ""){
            $("#hospital").attr("placeholder", "选择合作机构");  //type==9
        }
        else if(type == 11 && type != ""){   //type =11 只有选择城市
            $(".hosView").hide();
        }
    }
}
var input={
    readonlyIOS:function () {
        $("input[readonly]").focus(function () {
            document.activeElement.blur();
        })
    }
}

