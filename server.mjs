/*
    ~ * ~ * ~ *
  RASPI HABIT TRACKER
    ~ * ~ * ~ * 
*/

import fetch from 'node-fetch';

const options = {
  hostname: '71.247.249.43',
  port: 8080,
  path: '/updateraspi',
  method: 'POST'
};

//create express server
let port = process.env.PORT || 8080;
import express from 'express';
import http from 'http';
let app = express();
let server = http.createServer(app).listen(port, function(){
  console.log('Server is listening at port: ', port);
});

//where we look for files
app.use(express.static('public'));
app.use(express.json());

//http responses
app.get('/getdays', function(req, res){
  res.send(days);  
  console.log("sending days: ");
  //console.log(days);
});

app.post('/updatedays', function(req, res){
  db.update({date: req.body.date}, { $set: {habits: req.body.newHabits}}, {upsert: true}, function (err, newDoc){
    if (err) {
      console.log ("insert err: " + err);
    } else {
      refresh();
    }
  });
  console.log(req.body); 
});

//nedb database stuff
import Datastore from 'nedb';
let db = new Datastore({filename: "habits.db", autoload: true});

//days array that gets passed to and fro
let days = [];

//retrieve database for sketch
init();
function init() {
  db.find({}, (err, docs) => {
    if (err) {
      console.log("db err: " + err);
    }
    if (docs.length != 0) {
      days = docs;
      
      //sort by date 
      days.sort(compare);
    }
  })
}

//updates days and sends to raspi
function refresh() {
  db.find({}, (err, docs) => {
    if (err) {
      console.log("db err: " + err);
    }
    if (docs.length != 0) {
      days = docs;
      
      //sort by date 
      days.sort(compare);
      
      //send to raspi
      const response = fetch('http://71.247.249.43:8080/updateraspi', {
        method: 'POST', 
        body: JSON.stringify(days),
        headers: {'Content-Type': 'application/json'}
      });
      // const data = await response.json();
      // console.log("response: " + data);
    }
  })
}

//https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
function compare(a, b) {
  if (a.date < b.date){
    return -1;
  }
  if ( a.date > b.date ){
    return 1;
  }
  return 0;
}

//clean up for testing
// db.remove({}, {multi: true}, function (err, removed){
//   if (err) {console.log("remove err: " + err);}
//   if (removed){
//     console.log ("removed:");
//     console.log(removed);
//   }
// })

//single entry removal
// db.remove({date: "2022061"}, {multi: false}, function (err, removed){
//   if (err) {console.log("remove err: " + err);}
//   if (removed){
//     console.log ("removed:");
//     console.log(removed);
//   }
// });




// async function sendToRaspi(){
  
//   var options = {
//   host: '71.247.249.43',
//   path: '/updateraspi',
//   port: '8080',
//   method: 'POST'
//   };

//   var callback = function(response) {
//     var str = '';
//     response.on('data', function (chunk) {
//       str += chunk;
//     });

//     response.on('end', function () {
//       console.log(str);
//     });
//   }

//   var req = http.request(options, callback);
//   //This is the data we are posting, it needs to be a string or a buffer
//   req.write("data");
//   req.end();
  
  // const response = await fetch('http://71.247.249.43:8080/test');
  // const response = await fetch('http://71.247.249.43:8080/updateraspi', {
  //   method: 'POST', 
  //   //body: days
  //   body: JSON.stringify(days),
  //   headers: {'Content-Type': 'application/json'}
  // });
  // const data = await response.json();
  // console.log("response: " + data);
// }

