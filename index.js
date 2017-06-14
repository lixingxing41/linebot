require("webduino-js");
require("webduino-blockly");

//variable about webduino 
var myFirebase;
var dht;
var mTemp=0,mHum=0,bRain=0,uid=0,i=0,flag=0;

//variable about linebot
var linebot = require('linebot');
var express = require('express');
var bot = linebot({
  channelId: '1519721522',
  channelSecret: '806587c1591561d5843efc5921d1dad5',
  channelAccessToken: 'MkEw1JjQkoPB4hIc5G0ZkmPZIidAuTrJn+580oHFlbpedpz6YvKNLjbxQTQu2baRn6rIE5XZychETKRY2THtxLSaGsDOu/UjjeyfbRoj1RHyu/Ro0xZdPJpGlqLwL/gcJPc2w9Q/OwRrSG5sKiSxdQdB04t89/1O/w1cDnyilFU='
});
const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);


//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});


// Initialize Firebase
var firebase = require("firebase");
var config = {
    apiKey: "AIzaSyAI5OY5GIKM7wBoa3inb4dBA2IozHxOYRU",
    authDomain: "webduino-23015.firebaseapp.com",
    databaseURL: "https://webduino-23015.firebaseio.com",
    projectId: "webduino-23015",
    storageBucket: "webduino-23015.appspot.com",
    messagingSenderId: "927229253803"
};
firebase.initializeApp(config);

//firebase connect
var db = firebase.database();
var myFirebase = db.ref();


function get_date(t) {
  var varDay = new Date(),
  varYear = varDay.getFullYear(),
  varMonth = varDay.getMonth() + 1,
  varDate = varDay.getDate();
  var varNow;
  if (t == "ymd") {
    varNow = varYear + "/" + varMonth + "/" + varDate;
  } else if (t == "mdy") {
    varNow = varMonth + "/" + varDate + "/" + varYear;
  } else if (t == "dmy") {
    varNow = varDate + "/" + varMonth + "/" + varYear;
  } else if (t == "y") {
    varNow = varYear;
  } else if (t == "m") {
    varNow = varMonth;
  } else if (t == "d") {
    varNow = varDate;
  }
  return varNow;
}


function get_time(t) {
  var varTime = new Date(),
  varHours = varTime.getHours(),
  varMinutes = varTime.getMinutes(),
  varSeconds = varTime.getSeconds();
  var varNow;
  if (t == "hms") {
    varNow = varHours + ":" + varMinutes + ":" + varSeconds;
  } else if (t == "h") {
    varNow = varHours;
  } else if (t == "m") {
    varNow = varMinutes;
  } else if (t == "s") {
    varNow = varSeconds;
  }
  return varNow;
}

//linebot
function _bot(){
  console.log("bot",bRain);
  
  
  if(bRain==1){//如果判斷可能會下雨
    bot.push('U29c716493f690891169338083c3599ca', '家裡附近可能會下雨，回家收衣服喔!! ');
    bot.push('U08fdb11d718b720f728c620a3a749139', '家裡附近可能會下雨，回家收衣服喔!! ');
    bRain=0;
  }
  
  bot.on('message', function(event) {
    uid = event.source.userId;
    console.log(uid);
    if (event.message.type = 'text') {
      var msg = event.message.text;
      if(flag == 0){ 
        if(msg.indexOf('濕度') != -1)
          msg = "現在濕度為 " + mHum + " %";
        if(msg.indexOf('溫度') != -1)
          msg = "現在溫度為 " + mTemp + " °C";
        if(msg == '呼叫工具人')
          msg = '就知道你想我了吧~';
        if(msg == '工具人閉嘴'){
          flag = 1;
          msg = '掰掰~ 再次呼叫請輸入\"呼叫工具人\"';
        }
        event.reply(msg).then(function(data) {
        // success 
        console.log(msg);
        }).catch(function(error) {
        // error 
        console.log('error');
        });
      }else if(flag == 1){
        if(msg == '呼叫工具人')
          flag = 0;
      }
    }
  });
}

function rain(temperature,humidity){
 switch (temperature){
     
  case 20:
     if(humidity>80)
     bRain=1;
     break;
     
  case 21:
     if(humidity>78)
     bRain=1;
     break;
     
  case 22:
     if(humidity>78)
     bRain=1;
     break;
     
  case 23:
     if(humidity>72)
     bRain=1;
     break;
     
  case 24:
     if(humidity>78)
     bRain=1;
     break;
     
  case 25:
     if(humidity>76)
     bRain=1;
     break;
     
  case 26:
     if(humidity>77)
     bRain=1;
     break;
     
  case 27:
     if(humidity>70)
     bRain=1;
     break;
     
  case 28:
     if(humidity>71)
     bRain=1;
     break;
     
  case 29:
     if(humidity>78)
     bRain=1;
     break;
     
  default:
     if(humidity>70)
     bRain=1;
     break;
   }
}

boardReady({device: 'YWgg'}, function (board) {
  var temp = 0, humidity = 0;
  board.systemReset();
  board.samplingInterval = 250;
  //myFirebase = new Firebase("https://webduino-23015.firebaseio.com/");
  dht = getDht(board, 11);
  
  //myFirebase.set({}); //clear data
  //console.log("clear ok");
  
  //每十秒檢測一次，且記錄每半小之平均值
   dht.read(function(evt){
   mHum = dht.humidity; 
   mTemp = dht.temperature;
   i++;
   if(i > 180){//每半小時檢查一次有沒有可能會下雨
      bRain = i = 0;
      rain(mTemp,mHum);
   }
    _bot();//call linebot
    
  	myFirebase.push({
      date:get_date("ymd"),
      time:get_time("hms"),
      temp:dht.temperature,
      humidity:dht.humidity
    });
   }, 10000);
  
});

