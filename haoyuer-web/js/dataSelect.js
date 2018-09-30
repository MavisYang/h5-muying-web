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
    input: 'birChange',//点击触发插件的input框的id
    container: 'dataContainer',//插件插入的容器id
    type: 0,
    param: [1, 1, 1, 0, 0],
    beginTime: [2015,1,1],
    endTime: [2020,12,31] ,
    recentTime: [year, month, day],
    success: function (arr) {
        var newArr=[];
        var arr1=arr[0];
        var arr2=arr[1]; if(arr2>=1&&arr2<=9){arr2="0"+arr2;}
        var arr3=arr[2]; if(arr3>=0&&arr3<=9){arr3="0"+arr3;}
        newArr.push(arr1,arr2,arr3)
        console.log(newArr);
        controller.handleBirChange(newArr);
    }//回调
});
