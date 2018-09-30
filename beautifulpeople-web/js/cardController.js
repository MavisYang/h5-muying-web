/**
 * Created by mavis on 2017/5/26.
 */
var info=decodeURI(getQueryString("info"));
var type = info.split('-')[3];
var channelIsShow = false;
var controller={
    // 页面初始化，使最外层的div的高度=window的高度
    init:function () {
        type==53 ? this.inviteCodeIsShow() : null;
        type==54 ? this.channelIsShow() : null;
        this.pushHistory();
        document.getElementById("cardView").style.height=document.documentElement.clientHeight+"px";
        this.getOpenid();
        document.getElementById("privacyBtn").onclick=modelBox.modelShow;
        document.getElementById("closeIcon").onclick=modelBox.modelFade;
        document.getElementById("modelBtn").onclick=modelBox.modelAgree;
        document.getElementById("submitBtn").onclick=this.submit;
        this.isChecked();
        this.stopFocus();
        input.readonlyIOS();
    },
    url: {
        userInfo: wxIp + "wechat/ms/userinfo/getUserInfo", //获取openid
        isRobotid: groupIp + 'HelperManage/enter/select/robotUrl' ,  //判断是否已经进入过此页面的接口
        // isRobotid: 'http://192.168.0.235:8080/helpermanagebackend/enter/select/robotUrl' //本地
        inviteCodeIsShow:groupIp+'HelperManage/frisoConfig/inviteNum',
        // getChannel: groupIp + 'HelperManage/enter/getChannel',
        getChannelInfo: groupIp + 'HelperManage/enter/getChannelInfo',
        checkCode: groupIp + 'HelperManage/enter/selectDelegateCode?delegateCode=',
        channelIsShow: groupIp + 'HelperManage/frisoConfig/channel'
    },
    data: {
        cities: ['选择市', '北京', '成都', '重庆', '广州', '杭州', '南京', '厦门', '上海', '苏州', '太原']
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
                "type":type
            },
            success:function (res) {
                if(res.status==200){  //status:200表示已经有该用户的信息，直接跳转到QRcode页面
                    if(res.data != null){
                        window.location.href="QRCode.html?robotQr="+res.data.qr_url+"&code="+res.data.verify_code;
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
        var province=info.split('-')[0];
        var city=info.split('-')[1];
        var hospital=info.split('-')[2];
        $("#province").val(info=='null'?'':province);
        $("#hospital").val(info=='null'?'':hospital);
        if(city === '其他'){
            var select;
            var options = [];
            var cities = this.data.cities;
            $.each(cities, function (i, v) {
                options.push('<option value='+ i +'>'+ v +'</option>');
            });
            select = '<span class="content_info" id="selectCity">选择市</span><div class="dot"></div><select onchange=controller.citySelect() id="select">' + options + '</select>';
            $('#cityWrap').append(select);
        }else{
            var input = '<input type="text" class="content_info" id="city" name="city" readonly />';
            $('#cityWrap').append(input);
            $("#city").val(info=='null'?'':city);
        }
    },
    citySelect: function () {
        $('#channel').val('渠道');
        var selectedCity = $('#select').find('option:selected').text();
        $('#selectCity').text(selectedCity);
        this.getChannels();
    },
    submit:function () {
        cookieFunction.setCookie();
    },
    isChecked:function () {
        $("label[for=privacyChecked]").click(function () {
            if($("input[id=date]").val()==""){
                if($("#privacyChecked").is(":checked")){
                    $("#submitBtn").attr("disabled",'disabled').removeClass("bgColor_checked").addClass("bgColor_grey");
                }else{
                    $("#submitBtn").removeAttr("disabled").removeClass("bgColor_grey").addClass("bgColor_checked");
                };
            }else{
                if($("#privacyChecked").is(":checked")){
                    $("#submitBtn").attr("disabled",'disabled').removeClass("bgColor_checked").addClass("bgColor_inital");
                }else{
                    $("#submitBtn").removeAttr("disabled").removeClass("bgColor_inital").addClass("bgColor_checked");
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
        $("input[name='edc']").focus(function () {
            document.documentElement.blur();
        })
    },
    inviteCodeIsShow: function () {
        $.ajax({
            type: 'GET',
            url: this.url.inviteCodeIsShow,
            success: function (res) {
                if(res.resultCode == 100){
                    var inviteCode = '<div class="adSelect"><input type="text" id="inviteCode" class="content_info" name="inviteCode" placeholder="邀请人手机号后6位"></div>';
                    $('.bpForm').append(inviteCode);
                }
            },
            error: function () {
                console.log('请求失败');
            }
        })
    },
    channelIsShow: function () {
        $.ajax({
            type: 'GET',
            url: this.url.channelIsShow,
            async: false,
            success: function (res) {
                if (res.resultCode == 100) {
                    channelIsShow = true;
                    var str = '<div class="channelSelect">' +
                        '<input type="button" id="channel" value="渠道" readonly/>' +
                        '<div id="channels"></div>' +
                        '</div>';
                    $('.bpForm').append(str);
                    this.getChannels();
                }
            }.bind(this),
            error: function () {
                console.log('请求失败')
            }
        });
    },
    getChannels: function () {
        var requestCity = this.getRequestCity();
        var url = this.url.getChannelInfo;
        $.ajax({
            type: 'GET',
            url: url + '?city=' + requestCity,
            success: function (data) {
                var cityArr = [];
                cityArr.splice(0, cityArr.length);
                if (!(eval(data).length == 0)) {
                    for (var i in eval(data)) {
                        cityArr.push({"value": eval(data)[i].value,"child":eval(data)[i].child})
                    }
                }
                new MultiPicker({
                    input: 'channel',//点击触发插件的input框的id
                    container: 'channels',//插件插入的容器id
                    jsonData: cityArr,
                    success: function (arr) {
                        var channelId = arr[1].id;
                        var channelName = arr[1].value;
                        this.handleChannelChange(channelId, channelName);
                    }.bind(this)//回调：确定
                });
            }.bind(this),
            error: function (err) {
                err;
            }
        })
    },
    getRequestCity: function () {
        var city=info.split('-')[1];
        var requestCity;
        if(city === '其他'){
            requestCity = $('#selectCity').text();
        }else{
            requestCity = city;
        }
        if(requestCity == '选择市') return null;
        return requestCity;
    },
    handleChannelChange: function (channelId, channelName) {
        $('#channel').val(channelName);
        $('#channel')[0].dataset.id = channelId;
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
        var city=info.split('-')[1];
        var cookieData = new Object();        // 类似于var cookieDate={}创建对象
        var allInput = document.querySelectorAll("input[class='content_info']");
        // 2016-07-01至2018-06-30
        var edc = $("#predateSelect span").text();
        if(!/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}/.test(edc)){ alert("请选择预产期"); return false; }
        if (edc != "") {
            var nowTime = new Date(edc).getTime();
            var maxTime = new Date(2018, 12, 31).getTime();
            var minTime = new Date(2016, 6, 1).getTime();
            if (minTime <= nowTime && nowTime <= maxTime) {
                cookieData.edc = edc;
            } else {
                var branchs='<div class="confirmBox_area">' +
                    '<div class="confirmBox">' +
                    '<div class="confirmBox_title">' +
                    "您选择的预产期有误,请检查后重新选择" +
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
                return false;
            }
        }
        if( city == '其他' ){
            if($('#selectCity').text() === '选择市'){
                alert('请选择城市');
                return;
            }else{
                cookieData['city'] = $('#selectCity').text();
            }
        }

        $.each(allInput, function (k, v) {
            if (v.value == '') {
                judgeFlag = false;
                return false;
            } else {
                cookieData[v.name] = v.value;
            }
        });

        if(type == 54 && channelIsShow){
            var channel = $('#channel');
            if(channel.val() == '渠道'){
                alert('请选择渠道');
                return;
            }
            cookieData.channelId = channel.data('id');

            // var code = $('#code').val();
            // var flag = this.checkCode(code);
            // if(flag == -1){
            //     alert('代表编码不正确');
            //     return;
            // }else if(flag == 0){
            //     alert('请求失败');
            //     return;
            // }
            // cookieData.delegateCode = code ? code : '';
        }

        cookieData.type = type;
        try {
            // 判断日期是否有选择（非空判断）
            if (judgeFlag) {    //判断成功之后点击按钮进入到页面
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
    },
    checkCode: function (code) {
        var flag = -1;
        var url = controller.url.checkCode;
        if(code.length == 0) return 1;
        $.ajax({
            type: 'GET',
            url: url + code,
            async: false,
            success: function (res) {
                if(res.status == 200 && res.data){
                    flag = 1;
                }
            },
            error: function (err) {
                flag = 0;
            }
        });
        return flag;
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

function get_predate(obj){
    if (!obj.value) {
        $("#predateSelect span").text("选择预产期／生日");
        $('#data').remove();
        var date = '<input type="date" class="selectChild" name="edc" id="date" onchange="get_predate(this)" />';
        $('#predateSelect').append(date);
    }else{
        $("#predateSelect span").text(obj.value.replace(/\-/g,"/"));
    }
    if(!$("#privacyChecked").is(":checked"))
        $(".submitBtn").removeClass("bgColor_grey").addClass("bgColor_inital");
}

var input={
    readonlyIOS:function () {
        $("input[readonly]").focus(function () {
            document.activeElement.blur();
        })
    }
}
