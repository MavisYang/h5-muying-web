/**
 * Created by mavis on 2017/5/26.
 */
var controller={
    // 页面初始化，使最外层的div的高度=window的高度
    init:function () {
        this.pushHistory();
        document.getElementById("cardView").style.height=document.documentElement.clientHeight+"px";
        this.getOpenid();
        document.getElementById("privacyBtn").onclick=modelBox.modelShow;
        document.getElementById("closeIcon").onclick=modelBox.modelFade;
        document.getElementById("modelBtn").onclick=modelBox.modelAgree;
        document.getElementById("submitBtn").onclick=this.submit;
        this.isChecked();
        this.stopFocus(); 
    },
    url: {
        userInfo: wxIp + "wx/base/getUserInfo",
        isRobotid: groupIp + "HelperManage/enter/select/robotid"//判断是否已经进入过此页面的接口
    },
    getOpenid:function () {     //通过code获取opendid
        var url=this.url.userInfo;
        $.ajax({
            url:url,
            type:"get",
            dataType:"json",
            data:{"code":getQueryString("code")},
            success:function (res) {
                var openid=res.data.openid; //id
                this.whichPage(openid);
            }.bind(this)
        })
    },
    //根据openId判断进去到哪个页面
    whichPage:function (openid) {
        var url=this.url.isRobotid;
        $.ajax({
            url:url,
            type:"post",
            dataType:"json",
            data:{
                "openid":openid,
                "type":"2"
            },
            success:function (res) {
                // alert(eval(res));
                // alert(JSON.stringify(res));
                if(res.status==200){  //status:200表示已经有该用户的信息，直接跳转到QRcode页面
                    var robotId=res.data;
                    window.location.href="QRCode.html?robotId="+robotId;
                }else if(res.status==2){
                    window.location.href="againRepeat.html";
                }else{
                    this.getInfo();
                }
            }.bind(this)
        })
    },
    //获取city和hospital值
    getInfo:function () {
        var info=decodeURI(getQueryString("info"));
        console.log(info);
        var province=info.split('-')[0];
        var city=info.split('-')[1];
        var hospital=info.split('-')[2];
        $("#province").val(info=='null'?'':province);
        $("#city").val(info=='null'?'':city);
        $("#hospital").val(info=='null'?'':hospital);
    },
    // 获取时间，如：2017-05-26
    handleBirChange: function (arr) {
        if (arr.length == 3) {
            $("input[id = " + "birChange" + "]").val(arr[0] + "-" + arr[1] + "-" + arr[2]);
        }
    },
    submit:function () {
        cookieFunction.setCookie(this);
    },
    isChecked:function () {
        $("label[for=privacyChecked]").click(function () {
            if($("#privacyChecked").is(":checked")){
                $("#submitBtn").attr("disabled",'disabled').addClass("bgColor_grey").removeClass("bgColor_blue");
            }else{
                $("#submitBtn").removeAttr("disabled").addClass("bgColor_blue").removeClass("bgColor_grey");
            };
        })
    },
    pushHistory:function(){
        var bool = false;
        setTimeout(function () {
            bool = true;
        }, 1500);
        window.addEventListener("popstate", function () {
            if (bool) {
                window.location.reload();//根据自己的需求实现自己的功能
            }
            this.pushHistory();
        }, false);
        var state = {
            title: "title",
            url: "#"
        };
        window.history.replaceState(state, "title", "#");
    },
    stopFocus:function () {
        $("input[name='edc']").focus(function () {
            document.documentElement.blur();
        })
    }
}
var cookieFunction = {
    getCookie: function () {
        var current;
        var setData = new Object();
        if (($.cookie("data")) != undefined) {
            current = JSON.parse($.cookie("data"));
            if (current == undefined || current == "" || current == null) {
                return;
            }
            // console.log(current);
            //获取cookie值
            for (var k in current) {
                setData[k] = current[k];
                console.log(k, current[k])
            }
        }
    },
    setCookie: function () {
        var judgeFlag = true;
        var cookieData = new Object();        // 类似于var cookieDate={}创建对象
        var allInput = document.querySelectorAll("input[class='content_info']");
        $.each(allInput, function (k, v) {
            if (v.value == '') {
                judgeFlag = false;
                return false;
            } else {
                cookieData[v.name] = v.value;
            }
        });
        try {
            // 判断日期是否有选择（非空判断）
            if (judgeFlag != false) {    //判断成功之后点击按钮进入到页面
                location.href= userInfo;
            } else {
                throw "请完善信息"
            }
        } catch (err) {
            alert(err);
            return false;
        }
        // 存入cookie
        $.cookie("data",JSON.stringify(cookieData),{"expires":1});
    }
}
var modelBox={
    modelShow:function () {
        $(".model").removeClass("fade");
    },
    modelFade:function () {
        $(".model").addClass("fade");
    },
    modelAgree:function () {
        $("#privacyChecked").prop("checked", false);
        $("label[for=privacyChecked]").trigger("click");
        $(".model").addClass("fade");
    }
}