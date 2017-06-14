require("webduino-js");
require("webduino-blockly");

var myFirebase;
var dht;
var firebase = require("firebase");
var linebot = require('linebot');
var express = require('express');

var bot = linebot({
  channelId: channel Id,
  channelSecret: channel Secret,
  channelAccessToken: channel Access Token
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
    apiKey: "AIzaSyCG2ObOtjJVf7GwvE9Upc4TKPu1yI45q1Y",
    authDomain: "dht000-3ec11.firebaseapp.com",
    databaseURL: "https://dht000-3ec11.firebaseio.com",
    projectId: "dht000-3ec11",
    storageBucket: "dht000-3ec11.appspot.com",
    messagingSenderId: "766439163291"
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

function linebot(){
  clearTimeout(timer);
  if (temp >0 && humidity > 50) {
        bot.push('U08fdb11d718b720f728c620a3a749139', '要下雨辣~出門記得帶傘!!');
      }
      timer = setInterval(linebot, 120000);
}

linebot();
var i = 0;
var temp = 0, humidity = 0;
boardReady({device: 'XxOk'}, function (board) {
  board.systemReset();
  board.samplingInterval = 250;
  //myFirebase = new Firebase("https://webduino-23015.firebaseio.com/");
  dht = getDht(board, 11);
  myFirebase.set({}); //clear data
  console.log("clear ok");
  //每十秒檢測一次，且記錄每半小之平均值
  
  
  dht.read(function(evt){
   temp += dht.temperature;
   humidity += dht.humidity;
   i++;
   if(i>59){
    temp /= 60;
    humidity /= 60;
    myFirebase.push({
         date:get_date("ymd"),
            time:get_time("hms"),
            temp:temp,
            humidity:humidity
        });
        temp = 0;
        humidity = 0;
        i = 0;
   }
  }, 10000);
});
