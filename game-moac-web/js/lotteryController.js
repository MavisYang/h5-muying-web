/**
 * Created by jiayi.hu on 5/8/17.
 */
var Flag;
var modelFlag = true;
var para = 0;
var ruleFlag = true;
var isMoreFlag = true;
var controller = {
    init: function () {
        this.getInitData();//初始化得到是否是粉丝,和积分是否足够
        this.closeModel(); //关闭弹窗
        this.getPrize();   //点击领奖
        this.getReward();  //点击查看历史中奖
        this.getRule();    //查看规则
        this.postInfo();   //提交信息
        eventFunctions.handleModel()
    },
    getInitData: function () {
        $.ajax({
            url: groupIp + 'moac/verifyLoadReward?openid=' + openid,
            type: 'get',
            success: function (res) {
                console.log(res)
                if (res.status == 200) {
                    if(res.data.isMore == "F"){
                        isMoreFlag = false;
                    }
                    this.lottery(res.data.isFans)
                } else {
                    //500
                }
            }.bind(this)
        })
    },
    handleAddress: function (arr) {
        var value = arr.length == 2 ? arr[0].value + arr[1].value : arr[0].value + arr[1].value + arr[2].value;
        var sendValue = arr.length == 2 ? arr[0].value + "-" + arr[1].value : arr[0].value + "-" + arr[1].value + "-" + arr[2].value;
        $("#address").val(value).attr("name", "city" + sendValue);
    },
    lottery: function (isFans) {
        $(".butt").click(function () {
            console.log(isMoreFlag)
            if (isFans == "F") {
                modelFlag = true;
                para = 3;
                eventFunctions.handleModel();
                return;
            }
            if (!isMoreFlag) {
                modelFlag = true;
                para = 2;
                eventFunctions.handleModel();
                $(".partTitle").text("啊噢，栗子不足")
                $(".partIMG").css({"background": "url('image/liziShort.png')no-repeat center center "})
                $(".partState").empty().text("宝妈您的栗子余额不足哟,快快点击下方按钮赚取栗子吧");
                $(".negativeButton").val("赚取栗子").attr("name", "http://t.cn/R6oWMy9");
                return;
            }
            if (!Flag) {
                Flag = true;
                $(this).attr("disabled", true)
                eventFunctions.rotate();
            }
        });
    },
    closeModel: function () {
        $(".modelClose").click(function () {
            console.log("close")
            modelFlag = false;
            ruleFlag = true;
            para = 0;
            eventFunctions.handleModel()
        })
    },
    getPrize: function () {
        $(".negativeButton").click(function (e) {
            console.log(e.target)
            if (e.target.name == "http://t.cn/R6oWMy9") {
                window.location.href = e.target.name
                return
            }
            if (e.target.name.substr(0, 1) == "t") {
                para = 1;
                eventFunctions.handleModel();
                $(".fill_submit").attr("id", e.target.id)
                new MultiPicker({
                    input: 'address',//点击触发插件的input框的id
                    container: 'addressContainer',//插件插入的容器id
                    jsonData: $city,
                    success: function (arr) {
                        console.log(arr)
                        controller.handleAddress(arr);
                    }//回调
                });
            } else {
                //跳转elecUrl
                console.log(e.target.name)
                window.location.href = e.target.name.substr(1)
            }
        })
    },
    getRule: function () {
        $(".lotteryRule").click(function () {
            modelFlag = true;
            ruleFlag = false;
            para = 2;
            eventFunctions.handleModel()
            $(".partTitle").text("抽奖规则")
            $(".partIMG").css({"background": "url('image/rule.png')no-repeat center center "})
            $(".partState").empty().append("<ol style='text-align: left;margin-left:30px;font-size: 22px;line-height: 29px'><li>成为栗子妈妈俱乐部会员即可获得一次抽奖机会 </li>" +
                "<li>其余每次抽奖消耗5个栗子，不限次数，可多次抽取 </li>" +
                "<li>奖池包含礼盒、小样、优惠券等礼品，礼品多多快来参与。</li></ol>")
        })
    },
    getReward: function () {
        $(".history").click(function () {
            window.location.href = "history.html";
        })
    },
    postInfo: function () {
        $(".fill_submit").click(function (e) {
            var judgeFlag = true;
            var postInfoData = new Object()
            var inputArr = $("input[type=text]")
            inputArr.map(function (k, v) {
                console.log(v.value)
                if (v.value == "") {
                    judgeFlag = false;
                    return false;
                }
                if (v.id == "address") {
                    postInfoData["city"] = v.name.substr(4);
                } else {
                    postInfoData[v.name] = v.value
                }
            })
            //手机号验证和非空验证
            try {
                if (judgeFlag == false) {
                    throw "请完善信息"
                }
            } catch (err) {
                alert(err);
                return false;
            }
            try {
                var phoneInput = $("input[name=phone]");
                if (!(/^1[34578]\d{9}$/.test(phoneInput.val()))) {
                    throw "请输入正确手机号";
                }
            } catch (err) {
                alert(err)
                $("input[name=phone]").focus();
                return false;
            }
            postInfoData.recordId = e.target.id
            console.log(postInfoData)
            $.ajax({
                url: groupIp + 'moac/insertMoAddress',
                type: 'post',
                data: postInfoData,
                success: function (res) {
                    console.log(res)
                    if (res.status == 200) {
                        modelFlag = false;
                        para = 0;
                        eventFunctions.handleModel()
                        var branch =
                            '<div class="success-icon"></div>' +
                            '<div style="width: 80%;height: 80px;display: table-cell;vertical-align: middle;">' +
                            '提交成功' +
                            '</div>';
                        $(".shadowBox").css({"display":"block"}).empty().append(branch)
                        setInterval(function () {
                            $(".shadowBox").css({"display":"none"})
                        },2000)
                    }
                }
            })
        })
    },
}
var eventFunctions = {
    setDegree: function ($obj, deg) {
        $obj.css({
            'transform': 'rotate(' + deg + 'deg)',
            '-webkit-transform': 'rotate(' + deg + 'deg)'
        })
    },
    rotate: function () {
        var deg;
        var self = this;
        Flag = false;
        var $tar = $('.inner'),
            i, j,
            cnt = 100,
            total = 0, //旋转的度数
            ratio = [],
            offset = null, //设置初始值为空
            Famount = 9,
            amount = null,
            // amount = null,//设置初始值为空
            result = "",
            rewardReply = "",
            nickname = "",
            price = "",
            elecUrl = "",
            recordId = null,
            shortFlag = false,
            shortFlagMsg = "";
        ratio[1] = [ 0.2,0.4,0.6,0.8,1,1,1.2, 1.4,1.6,1.8];
        ratio[2] = [ 1.8,1.6,1.4,1.2,1,1,0.8,0.6,0.4,0.2];
        $.ajax({
            url: groupIp + 'moac/loadMoReward?openid=' + openid,
            type: 'get',
            success: function (res) {
                console.log(JSON.stringify(res))
                if (res.status == 200) {
                    offset = res.data.rewardId.substr(2, 1) - 1;
                    result = res.data.rewardId;
                    rewardReply = res.data.rewardType;
                    recordId = res.data.recordId;
                    nickname = res.data.nickname;
                    price = res.data.price;
                    elecUrl = res.data.elecUrl;
                    if(res.data.isMore == "F"){
                        isMoreFlag = false;
                    }
                    console.log(":"+isMoreFlag)
                } else {
                    shortFlag = true;
                    shortFlagMsg = res.msg;
                }
            },
            error: function () {

            }
        })

        for (i = 0; i < 100; i++) {
            setTimeout(function () {
                console.log(String(cnt).substr(0, 1))
                deg = Famount * ( ratio[String(cnt).substr(0, 1)][String(cnt).substr(1, 1)])*2;
                self.setDegree($tar, deg + total);//改变偏转
                total += deg;//记录
                cnt++;
            }, i * 50);
        }
        setTimeout(function () {
            // amount = amount == null?0:amount;
            offset = offset == null ? 0 : offset;
            amount = 9 - (0.6 * offset - 0.2);
            for (j = 0; j < 100; j++) {
                setTimeout(function () {
                    console.log(deg)
                    deg = amount * ( ratio[2][String(cnt).substr(1, 1)] );
                    self.setDegree($tar, deg + total);//改变偏转
                    total += deg;//记录
                    cnt++;
                }, j * 50);
            }
        }, 100 * 50)
        setTimeout(function () {
            $(".butt").removeAttr("disabled")
            if (shortFlag == true) {
                alert(shortFlagMsg);
                return;
            }
            if (rewardReply == "") {
                var branch =
                    '<div class="fresh-icon"></div>' +
                    '<div style="width: 80%;height: 80px;display: table-cell;vertical-align: middle;">' +
                    '网络不稳定请刷新重试' +
                    '</div>';

                $(".shadowBox").css({"display": "block"}).empty().append(branch)
                setInterval(function () {
                    $(".shadowBox").css({"display": "none"})
                }, 2000)
                return;
            }
            console.log("total:" + total)
            self.setModel(offset, rewardReply, recordId, nickname, price, elecUrl);
        }, 200 * 50 + 500);
    },
    setModel: function (offset, rewardReply, recordId, nickname, price, elecUrl) {
        var self = this;
        console.log(offset);
        modelFlag = true;
        para = 2;
        self.handleModel();
        console.log(rewardReply)
        $(".partTitle").text("恭喜您!")
        if (rewardReply == "e") {
            $(".partState").empty().text("亲爱的妈妈恭喜你获得" + nickname + "品牌" + price + "元优惠券");
            $(".partIMG").css({"background": "url('image/win.png')no-repeat center center "})
            $(".negativeButton").val("点击领取电子券").attr("id", recordId).attr("name", rewardReply + elecUrl);

        }
        if (rewardReply == "t") {
            var partIMG;
            if (price == "50") {
                partIMG = 'image/prize1.jpeg'
            } else {
                partIMG = 'image/prize2.jpeg'
            }
            $(".partState").empty().text("亲爱的妈妈恭喜你获得价值" + price + "元的" + nickname);
            $(".partIMG").css({"background": "url(" + partIMG + ")no-repeat center center"})
            $(".negativeButton").val("点击领取实物").attr("id", recordId).attr("name", rewardReply + elecUrl);
        }
    },
    handleModel: function () {
        $(".popupModel")[0].style.display = modelFlag == false ? "none" : "block";
        $(".btnContainer")[0].style.display = ruleFlag == false ? "none" : "block"
        if (para == 2) {
            $(".partStatus")[0].style.display = "block"
            $(".userInfo")[0].style.display = "none"
            $(".unFocus")[0].style.display = "none"

        } else if (para == 1) {
            $(".partStatus")[0].style.display = "none"
            $(".userInfo")[0].style.display = "block"
            $(".unFocus")[0].style.display = "none"
        } else if (para == 3) {
            $(".partStatus")[0].style.display = "none"
            $(".userInfo")[0].style.display = "none"
            $(".unFocus")[0].style.display = "block"
        }
    },
}