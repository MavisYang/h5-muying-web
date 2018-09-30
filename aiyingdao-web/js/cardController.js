/**
 * Created by mavis on 2017/5/26.
 */
var province,city,hospital,type,sendHospital;
var controller={
    // 页面初始化，使最外层的div的高度=window的高度
    init:function () {
        this.inviteCodeIsShow();
        this.pushHistory();
        document.getElementById("cardView").style.height=document.documentElement.clientHeight+"px";
        this.isChecked();
        this.stopFocus();
        this.whichPage();
        modelBox.model();//模态框
        this.submit();  //提交
        // this.getInfo();
    },
    //根据openId判断进去到哪个页面
    whichPage:function () {
        var url=dataModel.url.isRobotid;
        $.ajax({
            url:url,
            type:"post",
            dataType:"json",
            data:{
                "openid":getQueryString("openid"),
                "type":"4"
            },
            success:function (res) {
                // alert(eval(res));
                if(res.status==200){  //status:200表示已经有该用户的信息，直接跳转到QRcode页面
                    if(res.data != null){
                        window.location.href="QRCode.html?QRcodeurl="+res.data.qr_url+"&Validate="+res.data.verify_code;
                    }else{
                        window.location.href="sorry.html";
                    }
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
        if(info != null && info != ""){
            province=info.split('-')[0],city=info.split('-')[1],hospital=info.split('-')[2],type=info.split('-')[3],sendHospital=info.split('-')[2];
            $("#province").val(province);
            $("#city").val(city);
            $("#hospital").val(hospital.replace("加盟",""));
        }else{
            window.location.href="sorry.html";
        };
    },
    submit:function () {
        $("#submitBtn").get(0).addEventListener("click",function () {
            cookieFunction.setCookie(this);
        })
    },
    isChecked:function () {
        $("label[for=privacyChecked]").click(function () {
            if($("input[id=date]").val()==""){
                if($("#privacyChecked").is(":checked")){
                    $("#submitBtn").attr("disabled",'disabled').addClass("bgColor_grey").removeClass("bgColor_checked");
                }else{
                    $("#submitBtn").removeAttr("disabled").addClass("bgColor_checked").removeClass("bgColor_grey");
                };
            }else{
                if($("#privacyChecked").is(":checked")){
                    $("#submitBtn").attr("disabled",'disabled').addClass("bgColor_inital").removeClass("bgColor_checked");
                }else{
                    $("#submitBtn").removeAttr("disabled").addClass("bgColor_checked").removeClass("bgColor_inital");
                };
            }

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
        $("input").focus(function () {
            document.documentElement.blur();
        });
    },
    inviteCodeIsShow: function () {
        $.ajax({
            type: 'GET',
            url: dataModel.url.inviteCodeIsShow,
            success: function (res) {
                if(res.resultCode == 100){
                    var inviteCode = '<div class="invite-code"><input type="text" class="content_info" name="inviteCode" placeholder="请输入邀请码"></div>';
                    $('.adForm').append(inviteCode);
                }
            },
            error: function () {
                console.log('请求失败');
            }
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
        var edc = $("#predateSelect span").text();
        var allInput = document.querySelectorAll("input[class='content_info']");
        var inviteCode = $('.invite-code input').val();
        if(!/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}/.test(edc)){ alert("请选择预产期"); return false; }
        if (edc != "") {
            var nowTime = new Date(edc).getTime();
            var maxTime = new Date(toDate()[0]).getTime();
            var minTime = new Date(toDate()[1]).getTime();
            if (minTime <= nowTime && nowTime <= maxTime) {
                cookieData.edc = edc;
            } else {
                var branchs='<div class="confirmBox_area">' +
                    '<div class="confirmBox">' +
                    '<div class="confirmBox_title">' +
                    "抱歉(ó﹏ò｡)"+ '<br/>'+
                    "亲爱的妈妈，感谢您对爱婴岛的支持～"+ '<br/>' +
                    "由于您的预产期／宝宝月龄不在本次活动的范围内，暂时无法参加此次活动。"+ '<br/>' +
                    "我们正在组建更多同城同月龄的社群，到时我们不见不散～"+
                    '</div>'+
                    '<div class="confirmBox_submit">确定</div>'+
                    '</div>'+
                    '</div>';
                $("body").append(branchs);
                $(".confirmBox_submit").click(function () {
                    $(".confirmBox_area").remove();
                    $("#date").val("");
                    $("#predateSelect span").text("选择预产期/生日");
                })
                return;
            }
        };
        $.each(allInput, function (k, v) {
            if (v.value == '') {
                judgeFlag = false;
                return false;
            } else {
                if(v.name=='hospital'){
                    v.value = sendHospital;
                }
                cookieData[v.name] = v.value;
            }
        });
        cookieData.type=type;
        cookieData.openid=getQueryString("openid");
        try {
            // 判断省、市是否有值（非空判断）
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
    model:function () {
        $("#privacyBtn").get(0).addEventListener("click",function(){
            $(".model").removeClass("fade");
        });
        $("#closeIcon").get(0).addEventListener("click",function(){
            $(".model").addClass("fade");
        });
        $("#modelBtn").get(0).addEventListener("click",function(){
            $("#privacyChecked").prop("checked", false);
            $("label[for=privacyChecked]").trigger("click");
            $(".model").addClass("fade");
        });
    }
}

function get_predate(obj){
    if (obj.value == "" && $("#predateSelect span").text() == "") {
        $("#predateSelect span").text("选择预产期／生日");
    }else{
        $("#predateSelect span").text(obj.value.replace(/\-/g,"/"));
    }
    if(!$("#privacyChecked").is(":checked"))
        $(".submitBtn").removeClass("bgColor_grey").addClass("bgColor_inital");

}
