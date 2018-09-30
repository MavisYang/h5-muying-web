/**
 * Created by jiayi.hu on 10/24/16.
 */
//数据下拉处理
function dataload(filename) {
    var arraydata;
    $.ajax({
        type: "GET",
        url: filename,
        dataType: "json",
        async: false,
        success: function (json) {
            arraydata = eval(json)
        },
        error: function () {
        }
    });
    return arraydata;
}
var userVerifyCode;
var tel;
function load() {
    var clientHeight = document.documentElement.clientHeight;
    console.log(clientHeight);
    $("body").css({"height":clientHeight + "px"});
    $(".footer").css({"height": clientHeight - 870 + "px"});
    if (!($.cookie("test") == undefined)) {
        var current = new Array();
        current = JSON.parse($.cookie("test"));
        tel = current[0].tel;
    }
    if (!($.cookie("code") == undefined)) {
        userVerifyCode = $.cookie("code");
    }
    var times = 60;
    var timer = null;
    timer = setInterval(function () {
        times--;
        if (times <= 0) {
            $("#validateCode").val("重新获取验证码");
            clearInterval(timer);
            $("#validateCode").attr("disabled", false);
            $("#validateCode").css({"background": "#FFEE50"});
        }
        else {
            $("#validateCode").val("剩余" + times + "s");
            $("#validateCode").attr("disabled", true);
            $("#validateCode").css({"background": "#D5D5D5"});
        }
    }, 1000);
}

$(document).ready(function () {

    // $("#validateCode").get(0).addEventListener("touchstart", function () {
    //     $("#validateCode").css({"background": "#E1D35A"});
    // });
    $("#validateCode").get(0).addEventListener("click", function () {
        // $("#validateCode").css({"background": "#FFEE50"});
        var times = 60;
        var timer = null;
        timer = setInterval(function () {
            times--;
            if (times <= 0) {
                $("#validateCode").val("重新获取验证码");
                clearInterval(timer);
                $("#validateCode").attr("disabled", false);
                $("#validateCode").css({"background": "#FFEE50"});
            }
            else {
                $("#validateCode").val("剩余" + times + "s");
                $("#validateCode").attr("disabled", true);
                $("#validateCode").css({"background": "#D5D5D5"});
            }
        }, 1000);
        //验证码发送请求
        var validate = dataload("http://mt.gemii.cc/HelperManage/enter/getCode?phone=" + tel + "&code=" + userVerifyCode);
    });
});