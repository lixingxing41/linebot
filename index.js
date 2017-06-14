require("webduino-js");
require("webduino-blockly");

var myFirebase;
var dht;
var firebase = require("firebase");
var linebot = require('linebot');
var express = require('express');
var mTemp,mHum;
var bRain;

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
  var config = {
    apiKey: "AIzaSyAI5OY5GIKM7wBoa3inb4dBA2IozHxOYRU",
    authDomain: "webduino-23015.firebaseapp.com",
    databaseURL: "https://webduino-23015.firebaseio.com",
    projectId: "webduino-23015",
    storageBucket: "webduino-23015.appspot.com",
    messagingSenderId: "927229253803"
  };
  firebase.initializeApp(config);
  //connect
  var db = firebase.database();
  var myFirebase = db.ref();

  var timer;

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
  
  bot.on('message', function(event) {
  if (event.message.type = 'text') {
    var msg = event.message.text;
    if(msg.indexOf('濕度') != -1)
      msg = "現在濕度為 " + mHum + " %";
    if(msg.indexOf('溫度') != -1)
      msg = "現在溫度為 " + mTemp + " °C";
     if(msg.indexOf('下雨') != -1 && bRain)
      msg = "家裡附近可能會下雨，趕快回家收衣服唷!";
    event.reply(msg).then(function(data) {
      // success 
      console.log(msg);
    }).catch(function(error) {
      // error 
      console.log('error');
    });
  }
});
  
}

function rain(temperature,humidity){
 switch (temperature){
  case 20:
     if(humidity>80)
      msg = "家裡附近可能會下雨，趕快回家收衣服唷!";
      return 1;
     break;
  case 21:
     if(humidity>78)
      msg = "家裡附近可能會下雨，趕快回家收衣服唷!";
     return 1;
     break;
  case 22:
     if(humidity>78)
      msg = "家裡附近可能會下雨，趕快回家收衣服唷!";
     return 1;
     break;
  case 23:
     if(humidity>72)
      msg = "家裡附近可能會下雨，趕快回家收衣服唷!";
     return 1;
     break;
  case 24:
     if(humidity>78)
      msg = "家裡附近可能會下雨，趕快回家收衣服唷!";
     return 1;
     break;
  case 25:
     if(humidity>76)
      msg = "家裡附近可能會下雨，趕快回家收衣服唷!";
     return 1;
     break;
  case 26:if(humidity>72)
      msg = "家裡附近可能會下雨，趕快回家收衣服唷!";
     return msg;
     break;
  case 27:
     if(humidity>70)
      msg = "家裡附近可能會下雨，趕快回家收衣服唷!";
     return msg;
     break;
  case 28:
     if(humidity>71)
      msg = "家裡附近可能會下雨，趕快回家收衣服唷!";
     return msg;
     break;
  case 29:
     if(humidity>78)
      msg = "家裡附近可能會下雨，趕快回家收衣服唷!";
     return msg;
     break;
  default:
     if(humidity>70)
      msg = "家裡附近可能會下雨，趕快回家收衣服唷!";
     return msg;
     break;
 }
  event.reply(msg).then(function(data) {
      // success 
      console.log(msg);
    }).catch(function(error) {
      // error 
      console.log('error');
    });
}

boardReady({device: 'YWgg'}, function (board) {
  board.systemReset();
  board.samplingInterval = 250;
  //myFirebase = new Firebase("https://webduino-23015.firebaseio.com/");
  dht = getDht(board, 11);
  myFirebase.set({}); //clear data
  console.log("clear ok");
  //每十秒檢測一次，且記錄每半小之平均值
  var i = 0;
  var temp = 0, humidity = 0;
  bRain = 0;
  dht.read(function(evt){
    mHum = dht.humidity; 
    mTemp = dht.temperature;
    console.log(mHum);
    bRain=rain(mTemp,mHum);
    _bot();
    
/*    if(get_time("hms") == "0:0:0"){
  		myFirebase.set({}); //clear data
  	}else{*/
  		myFirebase.push({
        	date:get_date("ymd"),
            time:get_time("hms"),
            temp:dht.temperature,
            humidity:dht.humidity
        });
 // 	}
  }, 10000);
  
});

