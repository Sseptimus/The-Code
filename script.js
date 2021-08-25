//functions 



function loaded() {
  document.getElementById("stats").style.display = "none";
}

function switchToStats() {
    if (state == 1){


        document.getElementById("progressbar").style.width = "10%;";
        document.getElementById("progressbar").style.height = "5%";
        var deadprogress = ((population/dead)*100).toString()+"%";
        var aliveprogress = ((population/alive)*100).toString()+"%";
        var sickprogress = ((population/sick)*100).toString()+"%";
        document.getElementById("deadbar").style.width = deadprogress;
        document.getElementById("alivebar").style.width = aliveprogress;
        document.getElementById("sickbar").style.width = sickprogress;
    }else{
        document.getElementById("progressbar").style.width = "0px;";
        document.getElementById("deadbar").style.width = "0px;";
        document.getElementById("alivebar").style.width = "0px;";
        document.getElementById("sickbar").style.width = "0px;";
    }
  if (state == 0) {
        state = 1;
        const fileUrl = 'stats.html' // provide file location
        fetch(fileUrl)
        .then( r => r.text() )
        .then( t => document.getElementById("parameters").innerHTML = t )
        console.log("pressed button");
        document.getElementById("statButton").innerHTML = "Paramaters";
        document.getElementById("stats").style.display = "grid";
        if (eyepain == "none"){
            document.getElementById("options1").style.color = "orange";
            document.getElementById("statButton").style.color = "green";
            document.getElementById("parameters").style.color = "grey";
            
        }
  }else{
        state = 0;
        const fileUrl = 'paramaters.html' // provide file location
        fetch(fileUrl)
        .then( r => r.text() )
        .then( t => document.getElementById("parameters").innerHTML = t )
        document.getElementById("parameters").style.display = "grid";
        document.getElementById("stats").style.display = "none";
        document.getElementById("statButton").innerHTML = "Stats";
        document.getElementById("region").innerHTML = "Region";
        document.getElementById("population").innerHTML = "Undefinded Inhabitants";
        if (eyepain == "none"){
            document.getElementById("options1").style.color = "rgb(58, 179, 166)";
            document.getElementById("statButton").style.color = "orange";
            document.getElementById("options1").style.color = "rgb(58, 179, 166)";
            document.getElementById("parameters").style.color = "grey";
        }
    }
}

function updatedist(){
    document.getElementById("distance").innerHTML = document.getElementById("distancerange").value + "%";
}

function updatevac(){
    document.getElementById("vac").innerHTML = document.getElementById("vacrange").value + "%";
}

function clicking(id) {
    d3.select(id).style("fill", "red");
}

var runningSim = false
function startStop(){
        console.log("start/stop");
        if (runningSim){
            runningSim = false;


        }else{
            runningSim = true
            document.getElementById("triangle1").style.animation = "toPauseTRI1 1s ease forwards"
            document.getElementById("triangle1").style.animation = "toPauseTRI2 1s ease forwards"
            document.getElementById("triangle1").style.animation = "toPauseTRI3 1s ease forwards"
            document.getElementById("triangle1").style.animation = "toPauseTRI4 1s ease forwards"
            console.log("moved triange")
        }
}

function zooming(e) {
    d3.select("svg g").attr("transform", e.transform);
}

function lightToDark(){
    if (eyepain == "none"){
        eyepain = "ungodly"
        document.getElementById("body").style.backgroundColor = "#2f3336;"
        document.getElementById("body").style.animation = "fadeout2 1s ease forwards"
        document.getElementById("main").style.backgroundColor = "#cfd0d5";
        document.getElementById("lightVsDark").innerHTML = "&#9728;&nbsp;&nbsp;&nbsp;&nbsp;";
        document.getElementById("lightVsDark").style.color = "orange";
        document.getElementById("lightVsDark").style.backgroundColor = "white";
        document.getElementById("options1").style.backgroundColor = "white";
        document.getElementById("options1").style.color = "black";
        document.getElementById("statButton").style.backgroundColor = "#1b1d21";
        document.getElementById("statButton").style.color = "white";
        document.getElementById("nzmap").style.fill = "	#fdfdfd";
        document.getElementById("body").style.animation = "fadein2 1s ease forwards"

    }else{
        eyepain = "none"
        document.getElementById("body").style.backgroundColor = "rgb(58, 49, 49);"
        document.getElementById("body").style.animation = "fadeout3 1s ease forwards"
        document.getElementById("lightVsDark").innerHTML = "&nbsp;&nbsp;&nbsp;&#127769;";
        document.getElementById("lightVsDark").style.color = "purple";
        document.getElementById("lightVsDark").style.backgroundColor = "black";
        document.getElementById("options1").style.backgroundColor = "#282b2e";
        document.getElementById("title").style.color = "rgb(58, 179, 166)";
        document.getElementById("statButton").style.backgroundColor = "rgb(58, 49, 49)";
        document.getElementById("statButton").style.color = "orange";
        document.getElementById("main").style.backgroundColor = "#2f3336";
        document.getElementById("nzmap").style.fill = "#52585d";
        document.getElementById("body").style.animation = "fadein3 1s ease forwards"
        document.getElementById("parameters").style.color = "grey";

    }
}

var coolButtonState = "left"
function coolButtonPresed(){
    if (coolButtonState == "left"){
        coolButtonState = "right"
        document.getElementById("coolButtonIcon").style.animation = "leftToRight 1s ease forwards"
    }else{
        coolButtonState = "left"
        document.getElementById("coolButtonIcon").style.animation = "rightToLeft 1s ease forwards"
    }
}

// variabales
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
let zoom = d3.zoom().on("zoom", zooming);
var state = 0;
var eyepain = "none"

//testing is mobile
if (isMobile) {// tests of the website is in mobile
        console.log("Mobile");
} else {
        console.log("other");
}

var popultion = 1400000 

var dead = 300000
var sick = 700000
var alive = population - dead - sick



d3.select("svg").call(zoom);

toggled = {};
//Init all regions
d3.select("svg")
  .selectAll("path")
  .each(function () {
    let element = d3.select(this);
    let name = element.attr("name");
    console.log(name);
    console.log("Popultion:", populationsOfRegions[name]);
    element.on("click", () => {
        document.getElementById("region").innerHTML = name;
        document.getElementById("population").innerHTML = populationsOfRegions[name] + " Inhabitants";
    });
});



const fileUrl = 'paramaters.html' // provide file location
fetch(fileUrl)
.then( r => r.text() )
.then( t => document.getElementById("parameters").innerHTML = t )


