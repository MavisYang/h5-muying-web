/**
 * Created by mavis on 2017/6/5.
 */

var type=decodeURI(getQueryString("type"))!=""?decodeURI(getQueryString("type")):"1";
console.log(type)
var areaType=decodeURI(getQueryString("areaType"));  //区域选择
var gemiiUrl="http://mt.gemii.cc/";
var getDataFunction={
    url:{
        cityInter:gemiiUrl+"HelperManage/dicdata/citys/QRcode",  //获取城市接口
    },
    //根据调取的接口获取城市数据，选择城市
    getCity:function () {
        var url=this.url.cityInter;
        $.ajax({
            url:url,
            type:"get",
            dataType:"json",
            data:{
                "type":type,
                "areaType":areaType
            },
            success:function (data) {
                var cityArr = new Array();//[{"value": "蓬江区"}, {"value": "江海区"}, {"value": "其他"}]
                cityArr.splice(0, cityArr.length);  //push时先清空
                if (!(eval(data).length == 0)) {
                    for (var i in eval(data)) {
                        cityArr.push({"value": eval(data)[i].value,"child":eval(data)[i].child})
                    }
                }
                // console.log(cityArr)
                new MultiPicker({
                    input: 'address',//点击触发插件的input框的id
                    container: 'addressContainer',//插件插入的容器id
                    jsonData: cityArr,
                    success: function (arr) {
                        var cityName = arr[1].value, province = arr[0].value;
                        controller.handleCityChange(cityName.trim(), province.trim());  //传参
                    }//回调：确定
                });
            }
        })
    },
    getHosorDrugByCity:function (cityName) {
        var url=gemiiUrl+"HelperManage/dicdata/city/"+cityName+"/hospitals";
        $.ajax({
            url:url,
            type:"get",
            data:{"type":type},
            success:function (json) {
                // console.log(JSON.stringify(json));
                var hosArr=new Array();//[{value: "上海", child: [{value: "上海", child: []}]},{},{}]
                hosArr.splice(0, hosArr.length);
                if(!(eval(json).length == 0)){
                    for (var i in eval(json)) {
                        hosArr.push({"value": eval(json)[i]})
                    }
                };
                // if(type != 3){ //3 药店
                //     hosArr.push({"value": "其他"});
                // }

                // hosArr.push({"value": "其他"});

                // console.log(hosArr)
                $('.hospitalContainer').remove();
                var hospitalContainer = 'hospitalContainer'+Math.random()
                var branch ='<div id="'+hospitalContainer+'" class="hospitalContainer"></div>'
                $("#hospital").after(branch);
                new MultiPicker({
                    input: 'hospital',//点击触发插件的input框的id
                    container: hospitalContainer,//插件插入的容器id
                    jsonData: hosArr,
                    success: function (arr) {
                        var hosName = arr[0].value;
                        controller.handleHospitalChange(hosName.trim());
                    }//回调：确定
                });
            }
        })
    }
}
