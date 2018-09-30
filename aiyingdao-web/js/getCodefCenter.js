/**
 * Created by mavis on 2017/5/26.
 */
var openid,province,city,hospital,edc,phone,username,store;
var getCodeFunction={
    init:function () {    //页面在初始化时获取数据，获取img图片的地址
        document.getElementById("QR-view").style.height=document.documentElement.clientHeight+"px";
        this.getDataInfo();

        //测试
        // var data = {
        //     "hashMap": {
        //         "_tenantId": "139e1c0d-aff6-11e7-9628-064eb4931d9a",
        //         "_openId": "oXPbIjh7mFmT1g4sBhksRROM5cGM",
        //         "_pageNo": "85a42241-1b1f-4a74-8d3e-899dc25ed68c",
        //         "_phoneNum": "15921290623"
        //     },
        //     "items": [{
        //         "optionCode": "EXPECTED_DATE",
        //         "optionDisplayValue": "2018-01-01",
        //         "optionName": "预产期",
        //         "optionValue": "2018-01-01"
        //     }, {
        //         "optionCode": "CITY",
        //         "optionDisplayValue": "",
        //         "optionName": "城市",
        //         "optionValue": "ta"
        //     }, {"optionCode": "STORE", "optionDisplayValue": "", "optionName": "门店", "optionValue": "2716"}]
        // }
        // this.getCodeInfo(data)
    },
    getDataInfo:function () {
        openid=getQueryString("openid");
        phone = getQueryString("phone");
        province = decodeURI(getQueryString("province"));
        city = decodeURI(getQueryString("city"));
        edc = getQueryString("edc").replace(/\//g,"-");
        username = decodeURI(getQueryString("username"));
        store = decodeURI(getQueryString("hospital"));
        var hashMap= {
            "_tenantId": "139e1c0d-aff6-11e7-9628-064eb4931d9a",
            "_openId": openid,
            "_pageNo": "85a42241-1b1f-4a74-8d3e-899dc25ed68c",
            "_phoneNum": phone
        }
        var items=[
            {
                "optionCode": "EXPECTED_DATE",
                "optionDisplayValue": edc,
                "optionName": "预产期",
                "optionValue": edc
            },
            {
                "optionCode": "CITY",
                "optionDisplayValue": "",
                "optionName": "城市",
                "optionValue": city
            },
            {
                "optionCode": "STORE",
                "optionDisplayValue": "",
                "optionName": "门店",
                "optionValue": store
            }
        ]

        var data={
            hashMap:hashMap,
            items:items
        }
        this.getCodeInfo(data)
    },
    //直接获取qrCode和verCode数据
    getCodeInfo:function (data) {
        var url = dataModel.url.getCodefCenterUrl;
        $.ajax({
            url: url,
            type: "POST",
            dataType: 'json',
            async: true,      // 异步请求
            timeout: 20000,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            success: function (res) {
                // console.log(JSON.stringify(res))
                if (res.resultCode == 100) {
                    $(".QR-codeIMG").attr("src", res.resultContent.qrCode); //成功之后获取robotid,拼接图片地址，赋值
                    $("#validateCode").get(0).innerHTML = res.resultContent.verCode;//验证码
                    $(".loadingView").fadeOut();
                } else {
                    window.location.href = "sorry2.html?code="+res.resultCode;
                }
            },
            error: function () {
                window.location.href = 'loadSorry.html';
            }
        })
    }
}