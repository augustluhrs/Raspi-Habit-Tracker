let days;
let date;
let updateDayButt, dateInput, refreshButt;
let habits = [];
let sixteen = [
  {name: "8hrs", colors: [36, 224, 227]},
  {name: "nosnooze", colors: [18, 184, 140]},
  {name: "drinkwater", colors: [28, 70, 237]},
  {name: "morningpages", colors: [36, 237, 56]},
  {name: "read", colors: [17, 138, 29]},
  {name: "creed", colors: [224, 25, 45]},
  {name: "yogastretch", colors: [252, 131, 18]},
  {name: "meditate", colors: [237, 237, 26]},
  {name: "workout", colors: [188, 212, 34]},
  {name: "budget", colors: [22, 107, 9]},
  {name: "cleaninbox", colors: [193, 130, 224]},
  {name: "textsomeone", colors: [232, 7, 195]},
  {name: "workonproject", colors: [255, 255, 255]},
  {name: "floss", colors: [230, 103, 183]},
  {name: "dishesandclean", colors: [157, 34, 240]},
  {name: "cookorhomedinner", colors: [207, 56, 14]},
]
let buttons = [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}];

class Habit {
  constructor(_name, _colors){
    //this.size = 20;
    this.name = _name;
    this.colors = [_colors[0], _colors[1], _colors[2]];
    this.completed = false;
  }
}

function setup() {
  //get db info
  httpGet("https://raspi-habit-tracker.glitch.me/getdays", 'json', 
    function(data){
      days = data;
      console.log("loaded");
    },
    function(err){
      console.log("error loading db: " + err);
    }
  );
  
  if (month() < 10){
    date = year() + "0" + month() + "" + day(); 
  } else {
    date = year() + "" + month() + "" + day();
  }
  
  //habit and ui setup
  for (let i = 0; i < sixteen.length; i++) {
  // for (let habit of sixteen){
    habits.push(new Habit(sixteen[i].name, sixteen[i].colors));
  }
  
  for (let i = 0; i < habits.length; i++) {
    let newButt;
    
    if (habits[i].completed){
      newButt = createButton(habits[i].name).style('backgroundColor', 'rgb(' + habits[i].colors.join(', ') + ')')
      //newButt.mousePressed(toggleButtons(i));
    } else {
      newButt = createButton(habits[i].name);
      // newButt = createButton(habits[i].name).mousePressed(toggleButtons(i));
    }
    
    buttons[i] = newButt;
    buttons[i].mousePressed(createMousePressedFunction(i));
    
    //buttons[i].mousePressed(toggleButtons.call(buttons[i], i));
  }
  
  //p5 setup
  //createCanvas(windowWidth, windowHeight);
  
  //ui setup
  dateInput = createInput(date).input(updateButtons);
  updateDayButt = createButton("Update Day").mousePressed(updateDay);
  refreshButt = createButton("Refresh Day").mousePressed(refreshDay);
  
  //updateDayButt = createButton("Update Days").position(100, windowHeight - 50).mousePressed(updateDay);
}

// function draw() {
//   background(0, 100, 120);
// }

function updateDay(){
  let newDay = {
    date: dateInput.value(),
    newHabits: []
  };
  
  for (let h = 0; h < habits.length; h++){
    newDay.newHabits.push(habits[h]);
  }
  
  console.log(newDay);
  
  httpPost("https://raspi-habit-tracker.glitch.me/updatedays", 'json', newDay, 
     function(){console.log('update sent')}, 
     function(err){console.log("update err: ");
                   console.log(JSON.stringify(err));}
  );
  
}

function updateButtons(){
  console.log(dateInput.value());
  for (let day of days) {
    if (dateInput.value() == day.date){
      console.log("refresh date");
      habits = day.habits;
    }  
  }
}

function toggleButtons(index){
  // console.log(index);
  habits[index].completed = !habits[index].completed;
  if (habits[index].completed) {
    buttons[index].style('backgroundColor', 'rgb(' + habits[index].colors.join(', ') + ')');
  } else {
    buttons[index].style('backgroundColor', "grey");
  }
}

function refreshDay(){
  for (let day of days){
    if (day.date == dateInput.value()) {
      habits = day.habits; 
    }
  }
  for (let i = 0; i < buttons.length; i++){
    if (habits[i].completed) {
      buttons[i].style('backgroundColor', 'rgb(' + habits[i].colors.join(', ') + ')');
    } else {
      buttons[i].style('backgroundColor', "grey");
    }
  }
}


function createMousePressedFunction(index){
  return function() {toggleButtons(index)};
}