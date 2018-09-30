/**
 * Created by jiayi.hu on 10/21/16.
 */
//数据下拉处理
var username = "";
var openid = "";
var robotID_code_uid, robotID, verifyCode, uid, robotID_code_uidArray;
var cityReady, hospitalReady, preDate, codeReady, tel;
var type;//type=1,医院，原有的接口,type=4,小金助手，预产期+200；type=2，3 ，(合作网红) 5：自建 ---机构，新的接口
var flag = false;
//mt测试环境
var groupIp = 'http://mt.gemii.cc/';
var dataModal = {
    url: {
        getCityAndHos: groupIp+"HelperManage/enter/getCityAndHos?robotID=",//获取医院城市
        modifyH5Status: groupIp+"HelperManage/enter/modifyH5Status?robotID="
    },
    GetCityAndHos: function (Data) {
        var url = this.url.getCityAndHos + Data;
        // var data = this.getData(url);
        var arraydata;
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            async: false,
            cache: false,
            success: function (json) {
                arraydata = eval(json)
                flag = true;
            },
            error: function () {
                alert("加载失败,请重新进入");
            }
        });
        return arraydata;
    },
    ModifyH5Status: function (robotID, verifyCode, uid) {
        var url = this.url.modifyH5Status + robotID + "&code=" + verifyCode + "&uid=" + uid;
        var arraydata;
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            async: false,
            cache: false,
            success: function (json) {
                arraydata = eval(json)
            },
            error: function () {
                alert("网络出错,请重新进入");
            }
        });
        return arraydata;
    }

}
//URL解析
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return (r[2]);
    return null;
}

robotID_code_uid = GetQueryString('state'); // robotID_code_uid = "467439024_0000_all";
robotID_code_uidArray = robotID_code_uid.split("_");
robotID = robotID_code_uidArray[0];
verifyCode = robotID_code_uidArray[1];
uid = robotID_code_uidArray[2];
var CityAndHos = dataModal.GetCityAndHos(robotID).data;
console.log(CityAndHos);
function load() {
    if (flag = true) {
        // //初始化页面
        var clientWidth = document.documentElement.clientWidth;
        var clientHeight = document.documentElement.clientHeight;
        //根据robotID获取type值
        $.ajax({
            type: "post",
            url: groupIp+"HelperManage/wyeth/selectRobotOwner",
            data:{"robotID":robotID},
            success: function (res) {
                if (res.status == 200) {
                    type = res.data.robotOwner;
                    console.log(type)
                    if($.cookie("test") == undefined){
                        if (type == 1 || type ==4) {
                            $("#hospitalSelect span").text("选择医院");
                        } else if (type == 2 || type == 3 || type == 5) {
                            $("#hospitalSelect span").text("选择合作机构");
                        }
                    }
                }
                if(res.status == -1){
                    $("#hospitalSelect span").text("选择医院");
                }
            },
            error: function () {
                alert("页面加载失败,请稍后重试!");
            }
        });
        //用户名请求：根据code值获取openid
        var code = GetQueryString('code');
        $.ajax({
            type: "GET",
            url: "http://wx.gemii.cc/wx/base/getUserInfo?code=" + code,
            success: function (response) {
                if (response.status == 200) {
                    openid = response.data.openid;
                }
            },
            error: function () {
                alert("页面加载失败,请稍后重试!");
            }
        });
        if (!(uid == "all")) {
            dataModal.ModifyH5Status(robotID, verifyCode, uid);
        }

        $("body").css({"height": clientHeight , "width": clientWidth});
        $(".pageview_bg").css({"height":clientHeight });
        $(".privacyAgreement_modal").css({"height":clientHeight });
        $(".footer").css({"height": clientHeight - 780 + "px"});

        if (!($.cookie("test") == undefined)) {
            var current = JSON.parse($.cookie("test"));
            $("#citySelect span").text(current[0].cityReady);
            $("#hospitalSelect span").text(current[0].hospitalReady);
            $("#predateSelect span").text(current[0].preDate);
            $("#tel").text(current[0].tel);
            $("#SRCode").text(current[0].codeReady);
            // var CityAndHos = dataModal.GetCityAndHos(robotID).data;
            $("#city").empty();
            $("#province").empty();
            $("#city").append("<option value='-1'>请选择</option>");
            $("#province").append("<option value='-1'>请选择</option>");
            $.each(CityAndHos, function (k, v) {
                $.each(v, function (i, j) {
                    $("#city").append("<option value='" + k + "'>" + i + "</option>");
                    if (i == current[0].cityReady) {
                        $.each(j, function (p, q) {
                            $("#province").append("<option value='" + p + "'>" + q + "</option>");
                        })
                    }
                })
            })
            $("#city").append("<option value='" + CityAndHos.length + "'>其他</option>");
            $("#province").append("<option value=''>其他</option>");
        } else {
            $("#city").empty();
            $("#city").append("<option value='-1'>请选择</option>");
            // var CityAndHos = dataModal.GetCityAndHos(robotID).data;
            $.each(CityAndHos, function (k, v) {
                $.each(v, function (i, j) {
                    console.log(i, j);
                    $("#city").append("<option value='" + k + "'>" + i + "</option>");
                })
            })
            $("#city").append("<option value='" + CityAndHos.length + "'>其他</option>");
        }
    } else {
        alert("加载错误,请重试");
    }
    $("#checkboxId").prop('checked', false);
}
function get_city(obj) {
    var val = obj.value;
    if (val == -1) {
        $("#citySelect span").text("选择市");
    } else {
        cityReady = $("#city option[value='" + val + "']").text();
        $("#citySelect span").text(cityReady);
        $("#city").empty();
        $("#province").empty();
        $("#city").append("<option value='-1'>请选择</option>");
        $("#province").append("<option value='-1'>请选择</option>");
        $.each(CityAndHos, function (k, v) {
            $.each(v, function (i, j) {
                $("#city").append("<option value='" + k + "'>" + i + "</option>");
                if (i == cityReady) {
                    $.each(j, function (p, q) {
                        $("#province").append("<option value='" + p + "'>" + q + "</option>");
                    })
                }
            })
        })
        $("#city").append("<option value='" + CityAndHos.length + "'>其他</option>");
        $("#province").append("<option value=''>其他</option>");
        if(type==1 || type ==4){
            $("#hospitalSelect span").text("选择医院");
        }else if(type == 2 || type == 3 || type == 5){
            $("#hospitalSelect span").text("选择合作机构");
        }
    }
}
function get_hospital(obj) {
    var value = obj.value;
    if (value == -1) {
        if(type==1 || type ==4){
            $("#hospitalSelect span").text("选择医院");
        }else if(type == 2 || type == 3 || type == 5){
            $("#hospitalSelect span").text("选择合作机构");
        }
    } else {
        hospitalReady = $("#province option[value='" + value + "']").text();
        $("#hospitalSelect span").text(hospitalReady);
    }
}
function get_predate(obj) {
    if (obj.value == "" && $("#predateSelect span").text() == "") {
        $("#predateSelect span").text("选择预产期");
    }else{
        $("#predateSelect span").text(obj.value);
    }
}
$(document).ready(function () {
    var checkboxId = $("#checkboxId");
    var nextButton = $("#nextButton");
    if(checkboxId.get(0)){
        $(checkboxId).on("click",function () {
            if (checkboxId.is(':checked')) {
                nextButton.prop('disabled', false);
                $(".buttonBox").css({"background":"#fee900"});
            }else{
                nextButton.prop('disabled', true);
                $(".buttonBox").css({"background":"#afafaf"});
            }
        })
    }
    $(".privacyAgreement_submit").get(0).addEventListener("touchstart",function (e) {
        e.preventDefault();
        e.stopPropagation();
        checkboxId.prop('checked',true);
        nextButton.prop('disabled', false);
        $(".buttonBox").css({"background":"#fee900"});
        $(".privacyAgreement_modal").css({"display":"none"});
    })
    $(".privacyAgreement").get(0).addEventListener("touchstart",function () {
        $(".privacyAgreement_modal").css({"display":"block"});
    })
    $(".privacyAgreement_close").get(0).addEventListener("touchstart",function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(".privacyAgreement_modal").css({"display":"none"});
    })
    $("#province").get(0).addEventListener("touchstart", function () {
        if ($("#citySelect span").text() == "选择市") {
            alert("请先选择市");
        }
    })
    $(".nextButton").get(0).addEventListener("click", function () {
        var current = new Array();
        var user = new Object();
        cityReady = $("#citySelect span").text();
        hospitalReady = $("#hospitalSelect span").text();
        preDate = $("#predateSelect span").text();
        tel = $("#tel").val();
        codeReady = $("#SRCode").val();

        user.cityReady = cityReady;
        user.hospitalReady = hospitalReady;
        if (preDate != "") {//预产期
            if(type == 4){
                var preDateTime = new Date(preDate).getTime();
                var nowTime = new Date().getTime();
                var maxTime = new Date(afterDate()[0]).getTime();
                if(preDateTime>=nowTime && preDateTime<=maxTime){
                    user.preDate = preDate;
                }else{
                    alert("您选择的预产期有误，请检查后重新选择");
                    $("#date").val("");
                    $("#predateSelect span").text("选择预产期");
                    return;
                }
            }else{
                var nowTime = new Date(preDate).getTime();
                var maxTime = new Date(toDate()[0]).getTime();
                var minTime = new Date(toDate()[1]).getTime();
                if (minTime <= nowTime && nowTime <= maxTime) {
                    user.preDate = preDate;
                } else {
                    alert("您选择的预产期有误，请检查后重新选择");
                    $("#date").val("");
                    $("#predateSelect span").text("选择预产期");
                    return;
                }
            }

        }
        user.tel = tel;
        user.codeReady = codeReady;
        current.push(user);
        $.cookie("test", JSON.stringify(current), {"expires": 1});//存储cookie值：市、医院、预产期、手机号、
        var data,url;
        if(type == 2 || type ==3 || type ==5){
            data = {
                "city": current[0].cityReady,
                "hospitalkeyword": current[0].hospitalReady, "edc": current[0].preDate,
                "phonenumber": current[0].tel, "srcode": current[0].codeReady,
                "username": username, "openid": openid, "robotID": robotID, "code": verifyCode, "uid": uid,
                "type":type
            };
            url=groupIp+'HelperManage/wyeth/commitUserInfo';  //新接口
        }else{
            data = {
                "city": current[0].cityReady,
                "hospitalkeyword": current[0].hospitalReady, "edc": current[0].preDate,
                "phonenumber": current[0].tel, "srcode": current[0].codeReady,
                "username": username, "openid": openid, "robotID": robotID, "code": verifyCode, "uid": uid
            };
            url=groupIp+"HelperManage/enter/submitUserInfo";
        }
        if ($("#hospitalSelect span").text() == "选择医院"
            ||$("#hospitalSelect span").text() == "选择合作机构"
            || $("#citySelect span").text() == "选择市"
            || $("#predateSelect span").text() == "选择预产期"
            || $("#tel").val() == "") {
            alert("请完成信息填写。。");
        } else {
            if (!(/^1[34578]\d{9}$/.test($("#tel").val()))) {
                alert("手机号格式不正确");
            }
            else {
                $(".nextButton").attr("disabled", true);
                $.ajax({
                    type: "POST",
                    data: data,
                    url: url,
                    success: function (response) {
                        if (response.status == 200) {
                            $.cookie("code", response.data);
                            window.location.href = "success.html";
                            $(".nextButton").attr("disabled", false);
                        }
                        if (response.status == -1) {
                            window.location.href = "repeat.html";
                            $(".nextButton").attr("disabled", false);
                        }
                    },
                    error: function () {
                        alert("提交表单失败,请稍后重试!");
                    }
                });
            }
        }
    });
});

