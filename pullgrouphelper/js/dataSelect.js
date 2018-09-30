/**
 * Created by mavis on 2017/5/26.
 */
var d = new Date();
var day = d.getDate();
var month = d.getMonth() + 1;
var year = d.getFullYear();
var beginTime=new Array();
var endTime=new Array();
var minDate=toDate()[1].split("-");
var maxDate=toDate()[0].split("-"); //max="2018,03,02" endTime
for(var i in minDate){beginTime.push(parseInt(minDate[i]))}
for(var j in maxDate){endTime.push(parseInt(maxDate[j]))}
new DateSelector({
    input: 'date',//点击触发插件的input框的id
    container: 'dataContainer',//插件插入的容器id
    type: 0,
    param: [1, 1, 1, 0, 0],
    beginTime: [2000, 1, 1],
    endTime: [2050, 12, 12],
    recentTime: [year, month, day],
    success: function (arr) {
        var arr1=arr[0];
        var arr2=arr[1]; if(arr2>=1&&arr2<=9){arr2="0"+arr2;}
        var arr3=arr[2]; if(arr3>=0&&arr3<=9){arr3="0"+arr3;}
        $("#date").val(arr1+'-'+arr2+'-'+arr3);//先将值存在input中
        get_predate(document.getElementById("date"));//调取get_predate（）方法，将input的值复制给span
    }//回调
});