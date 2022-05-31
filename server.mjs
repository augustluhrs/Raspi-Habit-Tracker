/*
    ~ * ~ * ~ *
  RASPI HABIT TRACKER
    ~ * ~ * ~ * 
*/
import fetch from 'node-fetch';
//const fetch = require('node-fetch');
// const https = require('node:https');

// mod.cjs
//const fetch = () => import('node-fetch').then(({default: fetch}) => fetch());

const options = {
  hostname: '71.247.249.43',
  port: 8080,
  path: '/updateraspi',
  method: 'POST'
};

//create express server
let port = process.env.PORT || 8080;
// let express = require('express');
import express from 'express';
import http from 'http';
let app = express();
//let server = require('http')
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
  // db.update({type: "recentDays", "recentDays.date": req.body.date}, { $push: {recentDays: req.body}}, {upsert: true}, function (err, newDoc){
  let newDate = req.body.date;
  db.update({date: req.body.date}, { $set: {habits: req.body.newHabits}}, {upsert: true}, function (err, newDoc){
    // console.log(req.body.date);
    if (err) {
      console.log ("insert err: " + err);
    } else {
      //console.log("okay");
      init();
      
      //send to raspi
      sendToRaspi();
      // fetch('71.247.249.43:8080/updateraspi', {
      //   method: 'POST',
      //   body: days,
      // });
    }
  });
  console.log(req.body); 
});

//nedb database stuff
// const Datastore = require('nedb');
import Datastore from 'nedb';
let db = new Datastore({filename: "habits.db", autoload: true});

//variables
let days = [];
let ready = false;

//retrieve database for sketch
init();
function init() {
  db.find({}, (err, docs) => {
    //console.log("docs: " + docs);
    if (err) {
      console.log("db err: " + err);
    }
    if (docs.length != 0) {
      days = docs;
      ready = true; 
      // console.log(days);
    }
  })
}


async function sendToRaspi(){
  
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
  const response = await fetch('http://71.247.249.43:8080/updateraspi', {
    method: 'POST', 
    //body: days
    body: JSON.stringify(days),
    headers: {'Content-Type': 'application/json'}
  });
  const data = await response.json();
  console.log("response: " + data);
}

// db.update({type: "recentDays", recentDays: {[{date: 20220530, habits: []}]}}, {upsert: true}, function (err, newDoc){
//   if (err) {
//     console.log ("insert err: " + err);
//   } else {
//     console.log("okay");
//   }
// });

// init();
// console.log(days);


//clean up for testing
// db.remove({}, {multi: true}, function (err, removed){
//   if (err) {console.log("remove err: " + err);}
//   if (removed){
//     console.log ("removed:");
//     console.log(removed);
//   }
// })
