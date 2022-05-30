/*
    ~ * ~ * ~ *
  RASPI HABIT TRACKER
    ~ * ~ * ~ * 
*/

//create express server
let port = process.env.PORT || 8080;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function(){
  console.log('Server is listening at port: ', port);
});

//where we look for files
app.use(express.static('public'));

app.use(express.json());

//http responses
app.get('/getdays', function(req, res){
  res.send(days);  
  console.log("sending days: ");
  console.log(days);
});

app.post('/updatedays', function(req, res){
  // db.update({type: "recentDays", "recentDays.date": req.body.date}, { $push: {recentDays: req.body}}, {upsert: true}, function (err, newDoc){
  let newDate = req.body.date;
  db.update({date: req.body.date}, { $set: {habits: req.body.newHabits}}, {upsert: true}, function (err, newDoc){
    // console.log(req.body.date);
    if (err) {
      console.log ("insert err: " + err);
    } else {
      console.log("okay");
      init();
    }
  });
  console.log(req.body); 
});

//nedb database stuff
const Datastore = require('nedb');
let db = new Datastore({filename: "habits.db", autoload: true});

//variables
let days = [];
let ready = false;

//retrieve database for sketch
init();
function init() {
  db.find({}, (err, docs) => {
    console.log("docs: " + docs);
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
