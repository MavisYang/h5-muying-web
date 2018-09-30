/**
 * Created by mavis on 2017/6/6.
 */
//预产期:前：185天 后 280天   9个月10天
function toDate() {
    var nowTime=new Date().getTime();//当前时间的毫秒数
    var before=1000*60*60*24*185;//当前日期之前的日期，（小于）
    var after=1000*60*60*24*280;//当前日期之后的日期（大于）
    var beforeTime=new Date(nowTime-before);//"2016-01-01" 前：185天
    var afterTime =new Date(nowTime+after);//"2018-15-5" 后 280天
    var minYear=beforeTime.getFullYear();
    var minMonth=("0" + (beforeTime.getMonth() + 1)).slice(-2);
    var minDay=("0" + beforeTime.getDate()).slice(-2);
    var maxYear=afterTime.getFullYear();
    var maxMonth=("0" + (afterTime.getMonth() + 1)).slice(-2);
    var maxDay=("0" + afterTime.getDate()).slice(-2);
    var maxDate=maxYear+"-"+maxMonth+"-"+maxDay; //max="2018-03-02" endTime
    var minDate=minYear+"-"+minMonth+"-"+minDay; //min="2016-06-01" beginTime
    return [maxDate,minDate]
}
console.log(toDate());