/**
 * Created by mavis on 2017/5/26.
 */
var info=decodeURI(getQueryString("info"));
var code = getQueryString("code");
var province=info.split('-')[0];
var city=info.split('-')[1];
var hospital=info.split('-')[2];
var type=info.split('-')[3];
console.log(type)
var name;
var content = decodeURI(document.location.search.replace('?',''));
var controller={
    // 页面初始化，使最外层的div的高度=window的高度
    init:function () {
        document.getElementById("cardView").style.height=document.documentElement.clientHeight+"px";
        this.pushHistory();
        this.getOpenid();       //通过code获取opendid
        modelBox.model();//模态框
        this.submit();  //提交
        this.isChecked(); //是否选中隐私协议
        this.readonlyIOS();
        this.link();
    },
    getOpenid:function () {     //通过code获取opendid
        var url=dataModel.url.userInfo;
        $.ajax({
            url:url,
            type:"get",
            dataType:"json",
            data:{"code":code},
            timeout:10000,
            success:function (res) {
                // alert(res.data.openid)
                var openid=res.data.openid;
                this.savepoint(openid)
                this.whichPage(openid);   //通过openid判断进入的页面
            }.bind(this),
            error:function(){
                window.location.href='loadSorry.html';
                $(".loadingView").fadeOut();
            }
        })
    },
    savepoint:function(openid){
        var url = dataModel.url.savepoint;
        $.ajax({
            type:'post',
            url:url,
            data:{
                'pageName':'card-web/index.html',
                'pointName':'用户扫码',
                'userKey':openid,
                'content':content
            }
        })
    },
    //根据openId判断进去到哪个页面
    whichPage:function (openid) {
        var url=dataModel.url.isRobotid;
        $.ajax({
            url:url,
            type:"post",
            dataType:"json",
            data:{
                "openid":openid,
                "type":type
            },
            timeout:10000,
            success:function (res) {
                // alert(JSON.stringify(res));
                if(res.status==200){  //status:200表示已经有该用户的信息，直接跳转到QRcode页面
                    window.location.href="QRCode.html?robotId="+res.data.robotId+"&phone="+res.data.phone;
                    $(".loadingView").fadeOut();
                }else if(res.status==201){
                    window.location.href="QRCode.html?qr_url="+res.data.qr_url+"&verify_code="+res.data.verify_code;
                    $(".loadingView").fadeOut();
                }else if(res.status==2){
                    window.location.href="againRepeat.html";  //重复申请页面
                    $(".loadingView").fadeOut();
                }else{
                    this.getInfo();
                }
            }.bind(this),
            error:function(){
                window.location.href='loadSorry.html';
                $(".loadingView").fadeOut();
            }
        })
    },
    //获取province,city,hospital值
    getInfo:function () {
        if(info=="null"){
            window.location.href="sorry.html";
        }else{
            if(type=="12"||type=="13"){ //type=13:城市：可选,药店：可选,预产期：（可选)//type=12:城市：可选,医院：可选,预产期：（可选)
                $("#type").val(type);
                $(".changeEd").get(0).style.display="block";
                $(".changeCity").get(0).style.display="block";
                $(".noChange").get(0).style.display="none";
                $(".noChangeCity").get(0).style.display="none";
                $(".noChangeCity").find("input").removeClass("content_info");
                $(".noChange").find("input").removeClass("content_info");
                this.getCity();
                $(".loadingView").fadeOut();
            }
            else if(type == "11"){ //type=11:城市：不可选 医院：可选 预产期：（可选）
                $(".changeEd").get(0).style.display="block";
                $(".noChange").get(0).style.display="none";
                $(".noChange").find("input").removeClass("content_info");
                $(".changeCity").find("input").removeClass("content_info");
                $("#city").val(city);
                this.getHosorDrugByCity(city);
                $("#type").val(type);
                $("#province").val(province);
                $(".loadingView").fadeOut();
            }
            else if(type =='3'){//type=1 :城市：不可选 药店：不可选 预产期：（可选）
                name = info.split('-')[4];
                $(".noChange").find("input[id='hospital']").attr("placeholder","药店");
                $(".changeEd").find("input").removeClass("content_info");
                $(".changeCity").find("input").removeClass("content_info");
                $("#city").val(city);
                $("#hospital").val(hospital);
                $("#type").val(type);
                $("#province").val(province);
                $(".loadingView").fadeOut();
                this.changeAgreement(hospital);
            }
            else{ //type=1 :城市：不可选 医院：不可选 预产期：（可选） 9:项目合作群转卡券
                $(".changeEd").find("input").removeClass("content_info");
                $(".changeCity").find("input").removeClass("content_info");
                $("#city").val(city);
                $("#hospital").val(hospital);
                $("#type").val(type);
                $("#province").val(province);
                $(".loadingView").fadeOut();
                this.changeAgreement(hospital);
            }
        }
    },
    //根据调取的接口获取城市数据，选择城市
    getCity:function () {
        var url=groupIp+"HelperManage/dicdata/citys/QRcode";  //获取城市接口
        $.ajax({
            url:url,
            type:"get",
            dataType:"json",
            data:{
                "type":type,
                "areaType":"all"
            },
            timeout:10000,
            success:function (data) {
                var cityArr = new Array();
                cityArr.splice(0, cityArr.length); 
                if (!(eval(data).length == 0)) {
                    for (var i in eval(data)) {
                        cityArr.push({"value": eval(data)[i].value,"child":eval(data)[i].child})
                    }
                };
                // console.log(eval(cityArr))
                new MultiPicker({
                    input: 'address',//点击触发插件的input框的id
                    container: 'addressContainer',//插件插入的容器id
                    flag:false,
                    jsonData:cityArr,
                    success: function (arr) {
                        // console.log(arr)
                        var cityName=arr[1].value,province=arr[0].value;
                        controller.handleCityChange(cityName.trim(),province.trim());  //传参
                    }//回调：确定
                });

            },
            error:function(){
                window.location.href='loadSorry.html';
                $(".loadingView").fadeOut();
            }
        })
    },
    //根据城市名称选择医院、药店
    getHosorDrugByCity:function (cityName) {
        var url = groupIp + "HelperManage/dicdata/city/" + cityName + "/hospitals";
        console.log(url)
        $.ajax({
            url: url,
            type: "get",
            data: {"type": "1"},
            timeout:10000,
            success: function (json) {
                // console.log(eval(json));
                var hosArr=new Array();//[{value: "上海", child: [{value: "上海", child: []}]},{},{}]
                hosArr.splice(0, hosArr.length);
                if (!(eval(json).length == 0)) {
                    for (var i in eval(json)) {
                        hosArr.push({"value": eval(json)[i]})
                    }
                }
                hosArr.push({"value":"其他"})
                // console.log(hosArr);
                $('.hospitalContainer').remove();
                var hospitalContainer = 'hospitalContainer'+Math.random()
                var branch ='<div id="'+hospitalContainer+'" class="hospitalContainer"></div>'
                $("#hospitals").after(branch);
                new MultiPicker({
                    input: 'hospitals',//点击触发插件的input框的id
                    container: hospitalContainer,//插件插入的容器id
                    flag:true,
                    jsonData: hosArr,
                    success: function (arr) {
                        var hosName = arr[0].value;
                        $("input[id = " + "hospitals" + "]").val(hosName);
                        this.changeAgreement(hosName);
                        console.log(hosName)
                    }.bind(this)//回调：确定
                });
            }.bind(this),
            error:function(){
                window.location.href='loadSorry.html';
                $(".loadingView").fadeOut();
            }
        })
    },
    changeAgreement: function (hosName) {
        if(hosName.indexOf('一心堂') > -1){
            $('.noCatalogue').hide();
            $('.withCatalogue').show();
        }else{
            $('.noCatalogue').show();
            $('.withCatalogue').hide();
        }
    },
    //获取城市
    handleCityChange: function (cityName, province) {
        $("input[id = " + "address" + "]").val(cityName);
        $("#province").val(province);
        $("input[id = " + "hospitals" + "]").val("");
        if(!$("input[id=hospitals]").is(":hidden")){
            this.getHosorDrugByCity(cityName.trim());//2.点击确定时调取获取请求医院名称的接口
        }
    },
    isChecked:function () {
        $(".Checked").click(function () {
            if($(this).attr("state")=="false"){
                $(this).attr("state","true").addClass("privacyCheckedActive").removeClass("privacyChecked");
                $("#submitBtn").removeAttr("disabled").addClass("bgColor_blue").removeClass("bgColor_grey");
            }else{
                $(this).attr("state","false").addClass("privacyChecked").removeClass("privacyCheckedActive");
                $("#submitBtn").attr("disabled",'disabled').addClass("bgColor_grey").removeClass("bgColor_blue");
            }
        })
    },
    //从上一页面返回刷新本页面
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
    submit:function () {
        $("#submitBtn").get(0).addEventListener("click",function () {
            cookieFunction.setCookie()
        })
    },
    readonlyIOS:function () {
        $("input[readonly]").focus(function () {
            document.activeElement.blur();
        })
    },
    link: function () {
        $('.catalogue p').click(function () {
            var index = $(this).index();
            $('.mode-content').animate({
                scrollTop: $('.mainBody>div').eq(index).offset().top - $('.catalogue').offset().top
            })
        })
    }
}
var cookieFunction = {
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
        var edc = $("#predateSelect span").text();
        if(!/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}/.test(edc)){ alert("请选择预产期"); return false; }
        if (edc != "") {
            var nowTime = new Date(edc).getTime();
            var maxTime = new Date(toDate()[0]).getTime();
            var minTime = new Date(toDate()[1]).getTime();
            if (minTime <= nowTime && nowTime <= maxTime) {
                cookieData.edc = edc;
            } else {
                var branchs='<div class="confirmBox_area">' +
                    '<div class="confirmBox">' +
                    '<div class="confirmBox_title">您选择的预产期有误,'+'<br/>'+'请检查后重新选择。</div>'+
                    '<div class="confirmBox_submit">确定</div>'+
                    '</div>'+
                    '</div>';
                $("body").append(branchs);
                $(".confirmBox_submit").click(function () {
                    $(".confirmBox_area").remove();
                    $("#date").val("");
                    $("#predateSelect span").text("选择预产期（请妈妈填写准确预产期哦）");
                })
                return;
            }
        };
        if(type == 3){
            if(name !=''&& name !=undefined && name != null)
                cookieData.name = name;
        }
        try {
            // 判断日期是否有选择（非空判断）
            if (judgeFlag != false) {    //判断成功之后点击按钮进入到页面
                window.location.href = userInfo;
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
            if($(".Checked").attr("state")=="false")
                $(".Checked").trigger("click");
            $(".model").addClass("fade");
        });
    }
}

function get_predate(obj){
    if (obj.value == "" && $("#predateSelect span").text() == "") {
        $("#predateSelect span").text("选择预产期（请妈妈填写准确预产期哦）");
    }else{
        $("#predateSelect span").text(obj.value);
    }
}
